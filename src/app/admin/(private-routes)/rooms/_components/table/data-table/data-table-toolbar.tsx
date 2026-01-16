'use client'

import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'
import { cn } from '@/lib/utils'
import type { DataTableFilterField } from '@/types/table/data-tables'
import type { Table } from '@tanstack/react-table'
import { SearchIcon } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'
import { DataTableViewOptions } from './data-table-view-options'
import { FilterButton } from './filter-button'

interface DataTableToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>
  filterFields?: DataTableFilterField<TData>[]
}

export function DataTableToolbar<TData>({
  table,
  filterFields = [],
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const search = searchParams?.get('search')

  const isCleaning = React.useRef(false)

  const [searchValue, setSearchValue] = React.useState(search || '')

  const debouncedValue = useDebounce(searchValue, 300)

  // Memoize computation of searchableColumns and filterableColumns
  const { searchableColumns, filterableColumns, dateableColumns } =
    React.useMemo(() => {
      return {
        searchableColumns: filterFields.filter(
          (field) => field.type === 'search',
        ),
        filterableColumns: filterFields.filter(
          (field) => field.type === 'faceted',
        ),
        dateableColumns: filterFields.filter((field) => field.type === 'date'),
      }
    }, [filterFields])

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString())

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, String(value))
        }
      }

      return newSearchParams.toString()
    },
    [searchParams],
  )

  function handleClear() {
    isCleaning.current = true
    table.resetColumnFilters()

    if (!searchValue) return
    setSearchValue('')
    router.push(
      `${pathname}?${createQueryString({
        search: null,
      })}`,
      {
        scroll: false,
      },
    )
  }

  React.useEffect(() => {
    const params = new URLSearchParams()

    if (debouncedValue.length > 0) {
      params.set('filterBy', 'name')
      params.set('search', debouncedValue)

      router.push(`${pathname}?${params.toString()}`, {
        scroll: false,
      })

      return
    }

    // When search is cleared keep only filterBy (if present)
    if (debouncedValue.length === 0) {
      params.set('filterBy', 'name')

      const qs = params.toString()

      router.push(qs ? `${pathname}?${qs}` : pathname, {
        scroll: false,
      })
    }
  }, [pathname, router, debouncedValue])

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between sm:space-y-0',
        className,
      )}
      {...props}
    >
      <div className="flex flex-1 items-center">
        {searchableColumns.length > 0 &&
          searchableColumns.map((column) => {
            if (column.value === 'search') {
              return (
                <Input.Root
                  key={String(column.value)}
                  className="flex h-9 w-fit items-center"
                >
                  <SearchIcon className="ml-2 size-3 shrink-0 text-muted-foreground sm:size-4" />
                  <Input.Content
                    key={String(column.value)}
                    placeholder="Pesquisar por nº da sala..."
                    value={searchValue}
                    onChange={(event) => {
                      setSearchValue(event.target.value)
                      table.setColumnFilters([
                        {
                          id: String(column.value),
                          value: event.target.value,
                        },
                      ])
                    }}
                    className="h-8 md:w-[180px] lg:w-[250px]"
                  />
                </Input.Root>
              )
            }
            return null
          })}

        <FilterButton
          filterableColumns={filterableColumns}
          dateableColumns={dateableColumns}
          table={table}
          handleClear={handleClear}
        />
      </div>
      <div className="flex items-center space-x-1">
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
