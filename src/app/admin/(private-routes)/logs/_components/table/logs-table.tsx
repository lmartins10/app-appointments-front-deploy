'use client'

import { fetchRecentLogsQuery } from '@/api/queries/logs/fetch-recent-logs-query'
import { useDataTable } from '@/hooks/use-data-table'
import useSyncAdvancedFiltersToUrl from '@/hooks/use-sync-advanced-filters'
import { LogMapper, LogMapperToTableType } from '@/mappers/log-mapper'
import { type DataTableFilterField } from '@/types/table/data-tables'
import { useMemo } from 'react'
import { DataTable } from './data-table'
import { DataTableToolbar } from './data-table/data-table-toolbar'
import { getColumns } from './logs-columns'

interface LogsTableProps {
  logsData: Awaited<ReturnType<typeof fetchRecentLogsQuery>>
}

export function LogsTable({ logsData }: LogsTableProps) {
  const { logs, pageCount } = logsData

  const mappedData = logs?.map(LogMapper.toTable) ?? []

  const columns = useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<LogMapperToTableType>[] = [
    {
      label: 'Pesquisar...',
      value: 'search',
      type: 'search',
      placeholder: 'Pesquisar...',
    },

    {
      label: 'Data de cadastro',
      value: 'createdAt',
      type: 'date',
    },
  ]

  const { table } = useDataTable({
    columns,
    data: mappedData || [],
    filterFields,
    pageCount,
    initialState: {
      columnPinning: { right: ['actions'] },
      sorting: [{ id: 'createdAt', desc: true }],
    },
    enableRowSelection: false,
    enableColumnFilters: false,
  })

  // Sync advanced filters (date range + status) to URL
  useSyncAdvancedFiltersToUrl(table, { debounceMs: 300, method: 'push', resetPage: true })

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields} />
    </DataTable>
  )
}
