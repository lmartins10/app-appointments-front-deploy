'use client'
import { fetchRecentAppointmentsQuery } from '@/api/queries/appointments/fetch-recent-appointments-query'
import { ActionButton } from '@/components/app/button-actions/create-button'
import { DEFAULT_PAGES } from '@/constants/default-pages'
import { useDataTable } from '@/hooks/use-data-table'
import useSyncAdvancedFiltersToUrl from '@/hooks/use-sync-advanced-filters'
import { AppointmentMapper, AppointmentMapperToTableType } from '@/mappers/appointment-mapper'
import { type DataTableFilterField } from '@/types/table/data-tables'
import { CirclePlus } from 'lucide-react'
import { useMemo } from 'react'
import { getColumns } from './appointments-columns'
import { statusesAppointments } from './appointments-status'
import { DataTable } from './data-table'
import { DataTableToolbar } from './data-table/data-table-toolbar'

interface AppointmentsTableProps {
  appointmentsData: Awaited<ReturnType<typeof fetchRecentAppointmentsQuery>>
}

export function AppointmentsTable({ appointmentsData }: AppointmentsTableProps) {
  const { appointments, pageCount } = appointmentsData

  const mappedData = appointments?.map(AppointmentMapper.toTable) ?? []

  const columns = useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<AppointmentMapperToTableType>[] = [
    {
      label: 'Pesquisar...',
      value: 'search',
      type: 'search',
      placeholder: 'Pesquisar...',
    },
    {
      label: 'Status',
      value: 'status',
      type: 'faceted',
      options: statusesAppointments.map((statusAppointment) => ({
        label: statusAppointment.label,
        value: statusAppointment.value,
      })),
    },
    {
      label: 'Data agendamento',
      value: 'dateTime',
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
      sorting: [{ id: 'dateTime', desc: true }],
    },
    enableRowSelection: false,
    enableColumnFilters: false,
    enableAdvancedFilter: true,
  })

  useSyncAdvancedFiltersToUrl(table, { debounceMs: 300, method: 'push', resetPage: true, dateField: 'dateTime' })

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <ActionButton
          title="Novo Agendamento"
          href={DEFAULT_PAGES.ADMIN.appointment + '/new'}
          icon={<CirclePlus className="size-4" aria-hidden="true" />}
          variant="default"
          className="h-10"
        />
      </DataTableToolbar>
      <span className="hidden text-xs font-medium italic text-muted-foreground lg:inline">*Clique sobre uma linha da tabela para visualizar detalhes do agendamento</span>
    </DataTable>
  )
}
