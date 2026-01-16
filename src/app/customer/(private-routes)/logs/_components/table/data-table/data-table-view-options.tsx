'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { LogMapperToTableType } from '@/mappers/log-mapper'
import type { Table } from '@tanstack/react-table'
import { Settings2 } from 'lucide-react'

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

type ViewOptions = {
  [key in keyof Partial<LogMapperToTableType>]: string // Index signature
}

const viewOptions: ViewOptions = {
  fullName: 'Cliente',
  type: 'Tipo de atividade',
  module: 'Módulo',
  createdAt: 'Data de Criação',
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const media = useMediaQuery('(max-width: 1120px)')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Alternar colunas"
          variant="outline"
          className="ml-auto hidden h-10 gap-2 md:flex"
          type="button"
        >
          <Settings2 className="size-4" />
          <span className={cn(media ? 'hidden' : 'flex text-sm')}>
            Visualizar
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuLabel>Colunas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[450px] overflow-y-auto">
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== 'undefined' && column.getCanHide(),
            )
            .map((column) => {
              const viewOption = viewOptions[column.id as keyof ViewOptions]

              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  <span className="truncate">{viewOption}</span>
                </DropdownMenuCheckboxItem>
              )
            })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
