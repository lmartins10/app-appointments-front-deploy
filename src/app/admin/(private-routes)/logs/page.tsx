import { fetchRecentLogsQuery } from '@/api/queries/logs/fetch-recent-logs-query'
import { AdminContentLayout } from '@/components/app/portals/admin/content-layout'
import { SearchParams } from '@/types/table/data-tables'
import z from 'zod'
import { LogsTable } from './_components/table/logs-table'

export interface LogsPageProps {
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

export default async function LogsPage({ searchParams }: LogsPageProps) {
  const parsedSearchParams = await searchParams.then((params) =>
    searchParamsSchema.parse(params),
  )

  const logsData = await fetchRecentLogsQuery({
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
    <AdminContentLayout title="Logs" description="Acompanhe todos as Logs de clientes">
      <section className="flex flex-col gap-5">
        {/* <BreadcrumbPages pageName="Clientes" /> */}
        <LogsTable logsData={logsData} />
      </section>
    </AdminContentLayout>
  )
}
