import { toggleRoomIsInactive } from '@/api/actions/app/rooms/inactive-room'
import { EmptyImg } from '@/components/app/empty'
import { ActivationStatusType } from '@/components/app/status/activation-status'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrapper,
} from '@/components/ui/table'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useQueryString } from '@/hooks/use-query-string'
import { cn } from '@/lib/utils'
import { getCommonPinningStyles } from '@/lib/utils/data-table'
import { formatSlotDuration } from '@/lib/utils/formatters/date-time-rooms'
import { flexRender, Row, type Table as TanstackTable } from '@tanstack/react-table'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'
import { AppointmentRoomForm } from '../../form'
import { DataTablePagination } from './data-table-pagination'

interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  table: TanstackTable<TData>
  floatingBar?: React.ReactNode | null
}

export function DataTable<TData>({
  table,
  floatingBar = null,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  type ExtendedTData = TData & {
    roomId: string
    name: string
    startTime: string
    endTime: string
    slotDuration: string
    status: ActivationStatusType
  }

  const selectedRows = table.getSelectedRowModel().rows

  const selectedRowData = React.useMemo(() => {
    if (selectedRows.length === 0) return null

    const firstRow = selectedRows[0]

    return {
      roomId: `${(firstRow.original as ExtendedTData).roomId}` as string,
      name: `${(firstRow.original as ExtendedTData).name}` as string,
      startTime: `${(firstRow.original as ExtendedTData).startTime}` as string,
      endTime: `${(firstRow.original as ExtendedTData).endTime}` as string,
      slotDuration: `${(firstRow.original as ExtendedTData).slotDuration}` as string,
      status: (firstRow.original as ExtendedTData).status as ActivationStatusType,
    }
  }, [selectedRows])

  const [dialogOpen, setDialogOpen] = React.useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { createQueryString } = useQueryString(searchParams as URLSearchParams)

  const isMobile = useMediaQuery('(max-width: 639px)')

  const handleToggleStatus = async (roomId: string, status: string) => {
    const toasterId = 'room-is-inactivated'
    try {
      toast.loading(
        status === 'inactive'
          ? 'Ativando sala...'
          : 'Inativando sala...',
        {
          id: toasterId,
        },
      )
      const response = await toggleRoomIsInactive({
        id: roomId,
      })

      toast.dismiss(toasterId)

      if (response.status === 204) {
        toast.success(
          status === 'inactive'
            ? 'Sala ativada com sucesso'
            : 'Sala inativada com sucesso',
        )

        return
      }

      console.error({ response })
      toast.error(
        status === 'inactive'
          ? 'Erro ao ativar a sala'
          : 'Erro ao inativar a sala',
        {
          description: 'Por favor, tente novamente.',
        },
      )
    } catch (error) {
      console.error(error)
      toast.dismiss(toasterId)
      toast.error('Ocorreu um erro inesperado', {
        description: 'Por favor, tente novamente.',
      })
    }
  }

  const tableWrapperRef = React.useRef<HTMLDivElement>(null)
  const pageIndex = table.getState()?.pagination?.pageIndex ?? -1

  React.useEffect(() => {
    // Scroll to top when page changes
    if (tableWrapperRef.current) {
      tableWrapperRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    }
  }, [pageIndex])

  const handleSelectRow = React.useCallback((row: Row<TData>, cellId: 'actions' | string) => {
    if (cellId === 'actions') {
      return
    }

    if (!row.getIsSelected()) {
      table.resetRowSelection()
      row.toggleSelected()

      const element = document.getElementById('rooms-details')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }

    const roomId = `${(row.original as ExtendedTData).roomId}`

    router.push(
      `${pathname}?${createQueryString({ roomDetailsMode: 'view', roomId })}`,
      { scroll: false },
    )

    // Open dialog with row data
    setDialogOpen(true)
  }, [table, router, pathname, createQueryString])

  const getRowBackgroundColor = (row: Row<TData>) => {
    const status = (row.original as ExtendedTData).status
    if (status === 'inactive') return '#f3f4f6'

    return undefined
  }

  return (
    <div className={cn('h-full space-y-4 px-2', className)} {...props}>
      {children}
      <div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="flex max-h-[calc(100vh-8rem)] w-full max-w-3xl flex-col sm:w-[600px]">
            <DialogHeader>
              <DialogTitle>
                Detalhes da sala de agendamento
              </DialogTitle>
              <DialogDescription>
                Visualize os dados da sala selecionada
              </DialogDescription>
            </DialogHeader>

            <Card>
              <CardContent>
                <div className="min-h-0 flex-1 overflow-auto">
                  {selectedRowData ? (
                    <AppointmentRoomForm
                      data={selectedRowData}
                      onClose={() => {
                        router.push(
                          `${pathname}?${createQueryString({ roomDetailsMode: null, roomId: null })}`,
                          { scroll: false },
                        )

                        setDialogOpen(false)
                      }}
                    />
                  ) : (
                    <div>Nenhum agendamento selecionado</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
        <TableWrapper ref={tableWrapperRef}>
          <Table>
            {!isMobile && (
              <TableHeader className="sticky top-0 z-10 bg-background shadow">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          style={{
                            ...getCommonPinningStyles({
                              column: header.column,
                            }),
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
            )}

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      className={cn(
                        'hidden cursor-pointer data-[state=selected]:font-bold data-[state=selected]:text-secondary-foreground sm:table-row h-12',
                        row.getIsSelected() && 'font-bold text-secondary-foreground',
                      )}
                      style={{ backgroundColor: getRowBackgroundColor(row) }}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const pinningStyles = getCommonPinningStyles({
                          column: cell.column,
                        })
                        return (
                          <TableCell
                            onClick={() => handleSelectRow(row, cell.column.id)}
                            key={cell.id}
                            style={{
                              ...pinningStyles,
                              backgroundColor: pinningStyles.backgroundColor || 'inherit',
                            }}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        )
                      })}
                    </TableRow>

                    {isMobile && (
                      <TableRow
                        key={row.id}
                        className={cn(
                          row.getValue('status') === 'inactive' && 'bg-gray-100',
                        )}
                      >
                        <TableCell className="table-cell space-y-1 lg:hidden">
                          <div>
                            <span className="font-semibold text-secondary-foreground">
                              N°da sala:
                            </span>{' '}
                            {row.getValue('name')}
                          </div>

                          <div>
                            <span className="font-semibold text-secondary-foreground">
                              Horário de Início:
                            </span>{' '}
                            {row.getValue('startTime')}
                          </div>

                          <div>
                            <span className="font-semibold text-secondary-foreground">
                              Horário de Término:
                            </span>{' '}
                            {row.getValue('endTime')}
                          </div>

                          <div>
                            <span className="font-semibold text-secondary-foreground">
                              Bloco de Duração:
                            </span>{' '}
                            {formatSlotDuration(row.getValue('slotDuration'))}
                          </div>

                          <div className="flex flex-col gap-2">
                            <span className="mt-2 font-semibold text-secondary-foreground">
                              Status:
                            </span>

                            <div className="flex flex-row gap-2">
                              <Switch
                                checked={(row.original as ExtendedTData).status === 'active'}
                                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                onCheckedChange={() => handleToggleStatus((row.original as ExtendedTData).roomId, (row.original as ExtendedTData).status)}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow className="h-[calc(100vh-28rem)]">
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="p-0 align-middle"
                  >
                    <div className="flex size-full items-center justify-center py-10">
                      <EmptyImg />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableWrapper>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {table.getFilteredSelectedRowModel().rows.length > 0 && floatingBar}
      </div>
    </div>
  )
}
