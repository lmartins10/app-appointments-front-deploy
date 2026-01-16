'use client'

import { fetchRecentRoomsQuery } from '@/api/queries/rooms/fetch-recent-rooms-query'
import { ActionButton } from '@/components/app/button-actions/create-button'
import { statuses } from '@/components/app/status/activation-status'
import { useDataTable } from '@/hooks/use-data-table'
import useSyncAdvancedFiltersToUrl from '@/hooks/use-sync-advanced-filters'
import { RoomMapper, RoomMapperToTableType } from '@/mappers/room-mapper'
import { type DataTableFilterField } from '@/types/table/data-tables'
import { CirclePlus } from 'lucide-react'
import { useMemo } from 'react'
import { NewAppointmentRoomForm } from '../new-form'
import { DataTable } from './data-table'
import { DataTableToolbar } from './data-table/data-table-toolbar'
import { getColumns } from './room-columns'

interface RoomsTableProps {
  appointmentsData: Awaited<ReturnType<typeof fetchRecentRoomsQuery>>
}

export function RoomsTable({ appointmentsData }: RoomsTableProps) {
  const { rooms, pageCount } = appointmentsData

  const mappedData = rooms?.map(RoomMapper.toTable) ?? []

  const columns = useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<RoomMapperToTableType>[] = [
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
      options: statuses.map((status) => ({
        label: status.label,
        value: status.value,
      })),
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

  useSyncAdvancedFiltersToUrl(table, { debounceMs: 300, method: 'push', resetPage: true })

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <ActionButton
          title="Novo Sala"
          description="Preencha os dados do formulário para criar a sala"
          icon={<CirclePlus className="size-4" aria-hidden="true" />}
          className="h-10"
          variant="dialog"
        >
          <NewAppointmentRoomForm />
        </ActionButton>
      </DataTableToolbar>
      <span className="hidden text-xs font-medium italic text-muted-foreground lg:inline">*Clique sobre uma linha da tabela para visualizar detalhes da sala</span>
    </DataTable>
  )
}
