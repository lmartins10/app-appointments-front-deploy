import { LoadingOverlay } from '@/components/app/loading-overlay'
import { AdminContentLayout } from '@/components/app/portals/admin/content-layout'

export default function RoomsViewPageLoading() {
  return (
    <>
      <LoadingOverlay isPending />
      <AdminContentLayout title="Visualizar sala" description="Visualize os detalhes da sala">
        <section className="flex flex-col gap-5" />
      </AdminContentLayout>
    </>
  )
}
