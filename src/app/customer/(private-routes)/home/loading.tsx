import { LoadingOverlay } from '@/components/app/loading-overlay'
import { AdminContentLayout } from '@/components/app/portals/admin/content-layout'

export default function HomeCustomerPageLoading() {
  return (
    <>
      <LoadingOverlay isPending />
      <AdminContentLayout title="Página Inicial" description="Bem-vindo ao portal de clientes">
        <section className="flex flex-col gap-5" />
      </AdminContentLayout>
    </>
  )
}
