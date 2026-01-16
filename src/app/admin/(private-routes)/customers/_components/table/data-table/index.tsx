import { toggleUserIsInactive } from '@/api/actions/app/customers/inactive-customer'
import { updateUserPermissions } from '@/api/actions/app/users/update-user-permissions'
import { EmptyImg } from '@/components/app/empty'
import { Badge } from '@/components/ui/badge'
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
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { getCommonPinningStyles } from '@/lib/utils/data-table'
import { flexRender, Row, type Table as TanstackTable } from '@tanstack/react-table'
import * as React from 'react'
import { toast } from 'sonner'
import { DataTablePagination } from './data-table-pagination'
import { CustomerForm } from './form'

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
    customerId: string
    userId: string
    name: string
    email: string
    password: string
    lastName: string
    zipCode: string
    address: string
    number: string
    neighborhood: string
    complement: string | null
    city: string
    state: string
    status: string
    permissions: {
      permissionId: string
      name: string
      status: string
    }[]

  }

  async function handleUpdateUserPermissions(
    userId: string,
    permissionId: string,
    status: string,
  ) {
    const toasterId = 'update-user-permissions'
    try {
      const newStatus = status === 'active' ? 'inactive' : 'active'
      toast.loading('Atualizando permissões do cliente...', { id: toasterId })

      const response = await updateUserPermissions({
        userId,
        permission: {
          id: permissionId,
          status: newStatus,
        },
      })

      toast.dismiss(toasterId)

      if (response.status === 204) {
        toast.success(
          newStatus === 'active'
            ? 'Permissão ativada com sucesso'
            : 'Permissão desativada com sucesso',
        )

        return
      }

      if (response.status === 403) {
        toast.error('Você não tem permissão para realizar esta ação')
        return
      }

      console.error({ response })
      toast.error('Erro ao atualizar a permissão', {
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

  async function handleToggleStatus(customerId: string, status: string) {
    const toasterId = 'customer-is-inactivated'
    try {
      toast.loading(
        status === 'inactive'
          ? 'Ativando usuário...'
          : 'Inativando usuário...',
        {
          id: toasterId,
        },
      )
      const response = await toggleUserIsInactive({
        id: customerId,
      })

      toast.dismiss(toasterId)

      if (response.status === 204) {
        toast.success(
          status === 'inactive'
            ? 'Usuário ativado com sucesso'
            : 'Usuário inativado com sucesso',
        )

        return
      }

      if (response.status === 403) {
        toast.error('Não é possível inativar o próprio usuário')
        return
      }

      console.error({ response })
      toast.error(
        status === 'inactive'
          ? 'Erro ao ativar o usuário'
          : 'Erro ao inativar o usuário',
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

  const selectedRows = table.getSelectedRowModel().rows

  const selectedRowData = React.useMemo(() => {
    if (selectedRows.length === 0) return null

    const firstRow = selectedRows[0]

    return {
      customerId: `${(firstRow.original as ExtendedTData).customerId}` as string,
      userId: `${(firstRow.original as ExtendedTData).userId}` as string,
      name: `${(firstRow.original as ExtendedTData).name}` as string,
      email: `${(firstRow.original as ExtendedTData).email}` as string,
      password: `${(firstRow.original as ExtendedTData).password}` as string,
      lastName: `${(firstRow.original as ExtendedTData).lastName}` as string,
      zipCode: `${(firstRow.original as ExtendedTData).zipCode}` as string,
      address: `${(firstRow.original as ExtendedTData).address}` as string,
      number: `${(firstRow.original as ExtendedTData).number}` as string,
      neighborhood: `${(firstRow.original as ExtendedTData).neighborhood}` as string,
      complement: `${(firstRow.original as ExtendedTData).complement}` as string,
      city: `${(firstRow.original as ExtendedTData).city}` as string,
      state: `${(firstRow.original as ExtendedTData).state}` as string,
      status: `${(firstRow.original as ExtendedTData).status}` as string,
      permissions: `${(firstRow.original as ExtendedTData).permissions}` as string,
    }
  }, [selectedRows])

  const [dialogOpen, setDialogOpen] = React.useState(false)

  const isMobile = useIsMobile()

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

      const element = document.getElementById('customers-details')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    // Open dialog with row data
    setDialogOpen(true)
  }, [table])

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
          <DialogContent className="flex max-h-[calc(100vh-8rem)] max-w-md flex-col sm:max-w-lg lg:max-w-xl">
            <DialogHeader>
              <DialogTitle>
                Detalhes do cliente
              </DialogTitle>
              <DialogDescription>
                Visualize os dados do cliente selecionado
              </DialogDescription>
            </DialogHeader>
            <div className="min-h-0 flex-1 overflow-auto">
              {selectedRowData ? (
                <CustomerForm data={selectedRowData} onClose={() => setDialogOpen(false)} />
              ) : (
                <div>Nenhum agendamento selecionado</div>
              )}
            </div>
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
                          row.getValue('status') === 'inactive' && 'bg-gray-100',
                        )}
                      >
                        <TableCell className="table-cell space-y-2 lg:hidden">
                          <div className="relative flex flex-1 justify-between">
                            <div>
                              <span className="font-semibold text-secondary-foreground">
                                Nome:
                              </span> <br />
                              {row.getValue('fullName')}
                            </div>

                            <div>
                              <span className="font-semibold text-secondary-foreground">
                                Status:
                              </span><br />
                              <div className="absolute mt-1 whitespace-normal">
                                <Switch
                                  checked={(row.original as ExtendedTData).status === 'active'}
                                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                  onCheckedChange={() => handleToggleStatus((row.original as ExtendedTData).customerId, (row.original as ExtendedTData).status)}
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <span className="font-semibold text-secondary-foreground">
                              Endereço:
                            </span> <br />

                            {row.getValue('address')}, {(row.original as ExtendedTData).number} <br />
                            {(row.original as ExtendedTData).neighborhood} - {(row.original as ExtendedTData).city}/{(row.original as ExtendedTData).state}
                          </div>

                          <div>
                            <span className="font-semibold text-secondary-foreground">
                              Data de cadastro:
                            </span> <br />
                            {row.getValue('createdAt')}
                          </div>

                          <div className="space-y-2">
                            <span className="font-semibold text-secondary-foreground">
                              Permissões:
                            </span><br />
                            <div className="flex flex-wrap gap-2">
                              {(row.original as ExtendedTData)?.permissions.map((permission: { permissionId: string; name: string; status: string }) => (
                                <Badge
                                  key={permission.permissionId}
                                  variant={permission.status === 'active' ? 'default' : 'outline'}
                                  className="rounded-full p-0.5 px-4 text-sm hover:cursor-pointer hover:bg-primary/90 hover:text-primary-foreground"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleUpdateUserPermissions((row.original as ExtendedTData).userId, permission.permissionId, permission.status)
                                  }}
                                >
                                  {permission.name}
                                </Badge>
                              ))}
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
