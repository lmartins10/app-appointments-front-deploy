import { EmptyImg } from '@/components/app/empty'
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

      const element = document.getElementById('rooms-details')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [table])

  return (
    <div className={cn('h-full space-y-4 px-2', className)} {...props}>
      {children}
      <div>
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
                      >
                        <TableCell className="table-cell space-y-1 lg:hidden">
                          <div>
                            <span className="font-semibold text-secondary-foreground">
                              Cliente:
                            </span>{' '}
                            {row.getValue('fullName')}
                          </div>

                          <div>
                            <span className="font-semibold text-secondary-foreground">
                              Tipo de atividade:
                            </span>{' '}
                            {row.getValue('type')}
                          </div>

                          <div>
                            <span className="font-semibold text-secondary-foreground">
                              Módulo:
                            </span>{' '}
                            {row.getValue('module')}
                          </div>

                          <div>
                            <span className="font-semibold text-secondary-foreground">
                              Data de criação:
                            </span>{' '}
                            {row.getValue('createdAt')}
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
