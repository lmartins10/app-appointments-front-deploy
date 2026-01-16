import { fetchRecentCustomersQuery } from '@/api/queries/customers/fetch-recent-customers-query'
import { AdminContentLayout } from '@/components/app/portals/admin/content-layout'
import { SearchParams } from '@/types/table/data-tables'
import z from 'zod'
import { CustomersTable } from './_components/table/customers-table'

export interface CustomersPageProps {
  searchParams: Promise<SearchParams>
}

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(50),
  filterBy: z.string().optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
  status: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const parsedSearchParams = await searchParams.then((params) =>
    searchParamsSchema.parse(params),
  )

  const customersData = await fetchRecentCustomersQuery({
    page: parsedSearchParams.page,
    perPage: parsedSearchParams.per_page,
    filterBy: parsedSearchParams.filterBy,
    search: parsedSearchParams.search,
    sort: parsedSearchParams.sort,
    status: parsedSearchParams.status,
    dateFrom: parsedSearchParams.dateFrom,
    dateTo: parsedSearchParams.dateTo,
  })

  return (
    <AdminContentLayout title="Clientes" description="Overview de todos os clientes">
      <section className="flex flex-col gap-5">
        {/* <BreadcrumbPages pageName="Clientes" /> */}
        <CustomersTable customersData={customersData} />
      </section>
    </AdminContentLayout>
  )
}
