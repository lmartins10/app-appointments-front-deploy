import { LoadingOverlay } from '@/components/app/loading-overlay'
import { AdminContentLayout } from '@/components/app/portals/admin/content-layout'

export default function AppointmentsPageLoading() {
  return (
    <>
      <LoadingOverlay isPending />
      <AdminContentLayout title="Agendamentos" description="Acompanhe todos os agendamentos de clientes forma simples">
        <section className="flex flex-col gap-5" />
      </AdminContentLayout>
    </>
  )
}
