import { LoadingOverlay } from '@/components/app/loading-overlay'
import { AdminContentLayout } from '@/components/app/portals/admin/content-layout'

export default function RoomsEditPageLoading() {
  return (
    <>
      <LoadingOverlay isPending />
      <AdminContentLayout title="Editar sala" description="Realize a edição da sala">
        <section className="flex flex-col gap-5" />
      </AdminContentLayout>
    </>
  )
}
