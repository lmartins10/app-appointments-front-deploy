import { appointmentStatusChange } from '@/api/actions/app/appointments/appointment-status-change'
import { ActionButton } from '@/components/app/button-actions/create-button'
import { EmptyImg } from '@/components/app/empty'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { flexRender, Row, type Table as TanstackTable } from '@tanstack/react-table'
import { parse } from 'date-fns'
import { X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'
import { AppointmentsStatus, AppointmentsStatusType } from '../appointments-status'
import { DataTablePagination } from './data-table-pagination'
import { AppointmentTableForm } from './form'

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
    appointmentId: string
    date: string
    hour: string
    customerId: string
    userId: string
    fullName: string
    roomId: string
    roomName: string
    startAndEndTime: string
    slotDuration: string
    status: string
  }

  const selectedRows = table.getSelectedRowModel().rows

  const selectedRowData = React.useMemo(() => {
    if (selectedRows.length === 0) return null

    const firstRow = selectedRows[0]

    const appointmentDate = parse((firstRow.original as ExtendedTData).date, 'dd/MM/yyyy', new Date())

    return {
      appointmentId: `${(firstRow.original as ExtendedTData).appointmentId}` as string,
      date: {
        from: appointmentDate ?? undefined,
        to: appointmentDate ?? undefined,
      },
      hour: `${(firstRow.original as ExtendedTData).hour}` as string,
      fullName: `${(firstRow.original as ExtendedTData).fullName}` as string,
      roomName: `${(firstRow.original as ExtendedTData).roomName}` as string,
      startAndEndTime: `${(firstRow.original as ExtendedTData).startAndEndTime}` as string,
      slotDuration: `${(firstRow.original as ExtendedTData).slotDuration}` as string,
      roomId: `${(firstRow.original as ExtendedTData).roomId}` as string,
      userId: `${(firstRow.original as ExtendedTData).userId}` as string,
      customerId: `${(firstRow.original as ExtendedTData).customerId}` as string,
      status: `${(firstRow.original as ExtendedTData).status}` as string,
    }
  }, [selectedRows])

  const [dialogOpen, setDialogOpen] = React.useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { createQueryString } = useQueryString(searchParams as URLSearchParams)

  const isMobile = useMediaQuery('(max-width: 639px)')

  async function handleAppointmentStatusChange({ appointmentId, status }: { appointmentId: string, status: AppointmentsStatusType }) {
    const toasterId = 'appointment-status-change'

    try {
      toast.loading('Processando...', { id: toasterId })

      const response = await appointmentStatusChange({
        appointmentId,
        status,
      })

      toast.dismiss(toasterId)

      if (response.status === 204) {
        toast.success('Agendamento atualizado com sucesso!')

        return
      }

      console.error({ response })
      toast.error('Erro ao atualizar o agendamento', {
        description: 'Por favor, tente novamente.',
      })
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

      const element = document.getElementById('appointments-details')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }

    router.push(
      `${pathname}?${createQueryString({ appointmentDetailsMode: 'view' })}`,
      { scroll: false },
    )

    // Open dialog with row data
    setDialogOpen(true)
  }, [table, router, pathname, createQueryString])

  const getRowBackgroundColor = (row: Row<TData>) => {
    const status = row.getValue('status')
    if (status === 'confirmed') return '#DBFFFA'
    if (status === 'canceled') return '#FFF3F3'
    return undefined
  }

  return (
    <div className={cn('h-full space-y-4 px-2', className)} {...props}>
      {children}
      <div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md sm:max-w-lg lg:max-w-xl">
            <DialogHeader>
              <DialogTitle>
                Detalhes do agendamento
              </DialogTitle>
              <DialogDescription>
                Visualize os dados do agendamento selecionado
              </DialogDescription>
            </DialogHeader>
            <Card>
              <CardContent>
                {selectedRowData ? (
                  <AppointmentTableForm
                    data={selectedRowData}
                    onClose={() => {
                      router.push(
                        `${pathname}?${createQueryString({ appointmentDetailsMode: null })}`,
                        { scroll: false },
                      )

                      setDialogOpen(false)
                    }}
                  />
                ) : (
                  <div>Nenhum agendamento selecionado</div>
                )}
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
                        'hidden cursor-pointer data-[state=selected]:font-bold data-[state=selected]:text-secondary-foreground sm:table-row',
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
                          row.getValue('status') === 'confirmed' && 'bg-[#DBFFFA]',
                          row.getValue('status') === 'canceled' && 'bg-[#FFF3F3]',
                        )}
                      >
                        <TableCell className="table-cell space-y-1 lg:hidden">
                          <div>
                            <span className="font-semibold text-secondary-foreground">
                              Data agendamento:
                            </span>{' '}
                            {row.getValue('dateTime')}
                          </div>

                          <div>
                            <span className="font-semibold text-secondary-foreground">
                              Nome:
                            </span>{' '}
                            {row.getValue('fullName')}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-secondary-foreground">
                              Sala de agendamento:
                            </span>{' '}
                            <Badge variant="room">
                              Sala <span className="font-bold">{row.getValue('roomName')}</span>
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-secondary-foreground">
                              Status:
                            </span>
                            <AppointmentsStatus status={row.getValue('status') as AppointmentsStatusType} />
                          </div>

                          <div className="flex flex-col gap-2">
                            <span className="mt-2 font-semibold text-secondary-foreground">
                              Ações:
                            </span>

                            <div className="flex flex-row gap-2">
                              {['pending', 'confirmed'].includes(row.getValue('status')) && (
                                <ActionButton
                                  onClick={() => handleAppointmentStatusChange({ appointmentId: String((row.original as ExtendedTData).appointmentId), status: 'canceled' })}
                                  title="Cancelar agendamento"
                                  icon={<X className="size-4" />}
                                  variant="button-onClick"

                                />
                              )}

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
