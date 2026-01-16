import { LoadingOverlay } from '@/components/app/loading-overlay'
import { AdminContentLayout } from '@/components/app/portals/admin/content-layout'

export default function CustomerNewPageLoading() {
  return (
    <>
      <LoadingOverlay isPending />
      <AdminContentLayout title="Cadastrar novo cliente" description="Realize o cadastro de um novo cliente">
        <section className="flex flex-col gap-5" />
      </AdminContentLayout>
    </>
  )
}
