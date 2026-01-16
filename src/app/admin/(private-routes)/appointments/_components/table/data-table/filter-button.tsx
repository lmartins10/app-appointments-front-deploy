'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { DataTableFilterField } from '@/types/table/data-tables'
import type { Table } from '@tanstack/react-table'
import { FilterIcon, X } from 'lucide-react'
import * as React from 'react'
import { DataTableDateFilter } from './data-table-date-filter'
import { DataTableFacetedFilter } from './data-table-faceted-filter'

interface FilterButtonProps<TData> {
  filterableColumns: DataTableFilterField<TData>[]
  dateableColumns: DataTableFilterField<TData>[]
  table: Table<TData>
  handleClear: () => void
}

export function FilterButton<TData>({
  filterableColumns,
  dateableColumns,
  table,
  handleClear,
}: FilterButtonProps<TData>) {
  const [open, setOpen] = React.useState(false)

  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="flex items-center">
          <div
            className="flex h-9 cursor-pointer flex-row items-center gap-2 rounded-md border border-dashed border-input bg-background px-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label="Filter"
          >
            {isFiltered && (
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                {table.getState().columnFilters.length}
              </span>
            )}
            <FilterIcon className="size-4" />
            <span className="hidden md:inline-block">Filtros</span>

            {isFiltered && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleClear()
                      }}
                      className="size-4 p-0"
                    >
                      <X className="size-4 text-muted-foreground hover:bg-accent hover:text-accent-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Limpar filtros</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader className="mb-2 space-y-1 text-left">
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription className="">
            Selecione os filtros que deseja aplicar
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="flex flex-col gap-4 px-4">
          {filterableColumns.length > 0 &&
            filterableColumns.map(
              (column) =>
                table.getColumn(column.value ? String(column.value) : '') && (
                  <div key={String(column.value)} className="space-y-2">
                    <h3 className="text-sm font-medium">{column.label}:</h3>
                    <DataTableFacetedFilter
                      column={table.getColumn(
                        column.value ? String(column.value) : '',
                      )}
                      title={column.label}
                      options={column.options ?? []}
                    />
                  </div>
                ),
            )}
          {dateableColumns.length > 0 &&
            dateableColumns.map(
              (column) =>
                table.getColumn(column.value ? String(column.value) : '') && (
                  <div key={String(column.value)} className="space-y-2">
                    <h3 className="text-sm font-medium">{column.label}:</h3>
                    <DataTableDateFilter
                      column={table.getColumn(
                        column.value ? String(column.value) : '',
                      )}
                      label={column.label}
                    />
                  </div>
                ),
            )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
