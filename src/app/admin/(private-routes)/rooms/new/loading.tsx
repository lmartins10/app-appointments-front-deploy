import { LoadingOverlay } from '@/components/app/loading-overlay'
import { AdminContentLayout } from '@/components/app/portals/admin/content-layout'

export default function RoomsNewPageLoading() {
  return (
    <>
      <LoadingOverlay isPending />
      <AdminContentLayout title="Cadastrar nova sala" description="Realize o cadastro de uma nova sala">
        <section className="flex flex-col gap-5" />
      </AdminContentLayout>
    </>
  )
}
