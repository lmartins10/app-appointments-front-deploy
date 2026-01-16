'use client'
import { fetchRecentCustomersQuery } from '@/api/queries/customers/fetch-recent-customers-query'
import { ActionButton } from '@/components/app/button-actions/create-button'
import { statuses } from '@/components/app/status/activation-status'
import { useDataTable } from '@/hooks/use-data-table'
import { useSyncAdvancedFiltersToUrl } from '@/hooks/use-sync-advanced-filters'
import { CustomerMapper, CustomerMapperToTableType } from '@/mappers/customer-mapper'
import { type DataTableFilterField } from '@/types/table/data-tables'
import { CirclePlus } from 'lucide-react'
import { useMemo } from 'react'
import { NewCustomerForm } from '../new-form'
import { getColumns } from './customers-columns'
import { DataTable } from './data-table'
import { DataTableToolbar } from './data-table/data-table-toolbar'

interface CustomersTableProps {
  customersData: Awaited<ReturnType<typeof fetchRecentCustomersQuery>>
}

export function CustomersTable({ customersData }: CustomersTableProps) {
  const { customers, pageCount } = customersData
  const mappedData = customers?.map(CustomerMapper.toTable) ?? []

  const columns = useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<CustomerMapperToTableType>[] = [
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
    enableAdvancedFilter: true,
  })

  useSyncAdvancedFiltersToUrl(table, { debounceMs: 300, method: 'push', resetPage: true })

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <ActionButton
          title="Novo Cliente"
          description="Preencha os dados do formulário para criar o cliente"
          icon={<CirclePlus className="size-4" aria-hidden="true" />}
          className="h-10"
          variant="dialog"
          dialogContentClassName="flex max-h-[calc(100vh-8rem)] max-w-md flex-col sm:max-w-lg lg:max-w-xl"
        >
          <div className="min-h-0 flex-1 overflow-auto">
            <NewCustomerForm />
          </div>
        </ActionButton>
      </DataTableToolbar>
      <span className="hidden text-xs font-medium italic text-muted-foreground lg:inline">*Clique sobre uma linha da tabela para visualizar detalhes do cliente</span>
    </DataTable>
  )
}
