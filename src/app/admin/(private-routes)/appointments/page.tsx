import { fetchRecentAppointmentsQuery } from '@/api/queries/appointments/fetch-recent-appointments-query'
import { AdminContentLayout } from '@/components/app/portals/admin/content-layout'
import { SearchParams } from '@/types/table/data-tables'
import z from 'zod'
import { AppointmentsTable } from './_components/table/appointments-table'

export interface AppointmentsPageProps {
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

export default async function AppointmentsPage({ searchParams }: AppointmentsPageProps) {
  const parsedSearchParams = await searchParams.then((params) =>
    searchParamsSchema.parse(params),
  )

  const appointmentsData = await fetchRecentAppointmentsQuery({
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
    <AdminContentLayout title="Agendamentos" description="Acompanhe todos os agendamentos de clientes forma simples">
      <section className="flex flex-col gap-5">
        {/* <BreadcrumbPages pageName="Clientes" /> */}
        <AppointmentsTable appointmentsData={appointmentsData} />
      </section>
    </AdminContentLayout>
  )
}
