import { fetchRecentRoomsQuery } from '@/api/queries/rooms/fetch-recent-rooms-query'
import { AdminContentLayout } from '@/components/app/portals/admin/content-layout'
import { SearchParams } from '@/types/table/data-tables'
import z from 'zod'
import { RoomsTable } from './_components/table/rooms-table'

export interface RoomsPageProps {
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

export default async function RoomsPage({ searchParams }: RoomsPageProps) {
  const parsedSearchParams = await searchParams.then((params) =>
    searchParamsSchema.parse(params),
  )

  const appointmentsData = await fetchRecentRoomsQuery({
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
    <AdminContentLayout title="Salas" description="Gerencie as salas de agendamento">
      <section className="flex flex-col gap-5">
        {/* <BreadcrumbPages pageName="Clientes" /> */}
        <RoomsTable appointmentsData={appointmentsData} />
      </section>
    </AdminContentLayout>
  )
}
