import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { type Column } from '@tanstack/react-table'
import {
  ArrowDownIcon,
  ArrowUpDown,
  ArrowUpIcon,
  EyeOffIcon,
} from 'lucide-react'

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div
      className={cn(
        'flex items-center justify-start whitespace-nowrap',
        className,
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={
              column.getIsSorted() === 'desc'
                ? 'Ordenado em ordem crescente. Clique para ordenar em ordem decrescente.'
                : column.getIsSorted() === 'asc'
                  ? 'Ordenado em ordem crescente. Clique para ordenar em ordem decrescente.'
                  : 'Não ordenado. Clique para ordenar em ordem crescente.'
            }
            variant="ghost"
            size="sm"
          >
            <span>{title}</span>
            <SortIcon
              canSort={column.getCanSort()}
              isSorted={column.getIsSorted() as 'desc' | 'asc' | undefined}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {column.getCanSort() && (
            <>
              <DropdownMenuItem
                aria-label="Ordenar em ordem crescente."
                onClick={() => column.toggleSorting(false)}
              >
                <ArrowUpIcon
                  className="mr-2 size-3.5 text-muted-foreground/70"
                  aria-hidden="true"
                />
                Crescente
              </DropdownMenuItem>
              <DropdownMenuItem
                aria-label="Ordenar em ordem decrescente."
                onClick={() => column.toggleSorting(true)}
              >
                <ArrowDownIcon
                  className="mr-2 size-3.5 text-muted-foreground/70"
                  aria-hidden="true"
                />
                Decrescente
              </DropdownMenuItem>
            </>
          )}
          {column.getCanSort() && column.getCanHide() && (
            <DropdownMenuSeparator />
          )}
          {column.getCanHide() && (
            <DropdownMenuItem
              aria-label="Ocultar coluna"
              onClick={() => column.toggleVisibility(false)}
            >
              <EyeOffIcon
                className="mr-2 size-3.5 text-muted-foreground/70"
                aria-hidden="true"
              />
              Ocultar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function SortIcon({
  canSort,
  isSorted,
}: {
  canSort: boolean
  isSorted: 'desc' | 'asc' | undefined
}) {
  if (!canSort) {
    return null
  }

  if (isSorted === 'desc') {
    return <ArrowDownIcon className="ml-2 size-4" aria-hidden="true" />
  }

  if (isSorted === 'asc') {
    return <ArrowUpIcon className="ml-2 size-4" aria-hidden="true" />
  }

  return <ArrowUpDown className="ml-2 size-4" aria-hidden="true" />
}
