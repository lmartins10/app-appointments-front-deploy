'use client'

import type { Table } from '@tanstack/react-table'
import { isValid, parse } from 'date-fns'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { useDebounce } from './use-debounce'

interface Options {
  debounceMs?: number
  method?: 'push' | 'replace'
  resetPage?: boolean
  dateField?: string
  statusField?: string
}

export function useSyncAdvancedFiltersToUrl<TData = unknown>(
  table: Table<TData>,
  { debounceMs = 300, method = 'push', resetPage = true, dateField = 'createdAt', statusField = 'status' }: Options = {},
) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // extract table column filters so it can be used as a simple dependency
  const columnFilters = table.getState().columnFilters

  const rawQs = useMemo(() => {
    const createdAtFilter = columnFilters.find((f) => f.id === dateField)
    const statusFilter = columnFilters.find((f) => f.id === statusField)

    let dateFromIso: string | null = null
    let dateToIso: string | null = null

    try {
      const range = (createdAtFilter?.value as { range: [string, string] })?.range

      if (range?.[0]) {
        const fromDate = parse(range[0], 'dd/MM/yy', new Date())
        if (isValid(fromDate)) {
          fromDate.setHours(0, 0, 0, 0)
          dateFromIso = fromDate.toISOString()
        }
      }

      if (range?.[1]) {
        const toDate = parse(range[1], 'dd/MM/yy', new Date())
        if (isValid(toDate)) {
          toDate.setHours(23, 59, 59, 999)
          dateToIso = toDate.toISOString()
        }
      }
    } catch (e) {
      // ignore parse errors
    }

    const newSearchParams = new URLSearchParams(searchParams?.toString())

    if (resetPage) newSearchParams.set('page', '1')

    if (dateFromIso) newSearchParams.set('dateFrom', dateFromIso)
    else newSearchParams.delete('dateFrom')

    if (dateToIso) newSearchParams.set('dateTo', dateToIso)
    else newSearchParams.delete('dateTo')

    if (statusFilter && Array.isArray(statusFilter.value)) {
      const statusVal = (statusFilter.value as string[]).join('.')
      if (statusVal) newSearchParams.set('status', statusVal)
      else newSearchParams.delete('status')
    } else if (statusFilter && typeof statusFilter.value === 'string') {
      if (statusFilter.value) newSearchParams.set('status', statusFilter.value as string)
      else newSearchParams.delete('status')
    }

    return newSearchParams.toString()

  // Recompute when searchParams or the table's column filters change
  }, [columnFilters, searchParams, resetPage, dateField, statusField])

  const debouncedQs = useDebounce(rawQs, debounceMs)

  useEffect(() => {
    const currentQs = searchParams?.toString() ?? ''
    if (debouncedQs === currentQs) return

    const url = debouncedQs ? `${pathname}?${debouncedQs}` : pathname

    method === 'push'
      ? router.push(url, { scroll: false })
      : router.replace(url, { scroll: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQs])
}

export default useSyncAdvancedFiltersToUrl
