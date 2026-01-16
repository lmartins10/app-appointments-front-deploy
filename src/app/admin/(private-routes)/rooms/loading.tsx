import { LoadingOverlay } from '@/components/app/loading-overlay'
import { AdminContentLayout } from '@/components/app/portals/admin/content-layout'

export default function RoomsPageLoading() {
  return (
    <>
      <LoadingOverlay isPending />
      <AdminContentLayout title="Salas" description="Gerencie as salas de agendamento">
        <section className="flex flex-col gap-5" />
      </AdminContentLayout>
    </>
  )
}
