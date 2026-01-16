import { LoadingOverlay } from '@/components/app/loading-overlay'
import { AdminContentLayout } from '@/components/app/portals/admin/content-layout'

export default function CustomersPageLoading() {
  return (
    <>
      <LoadingOverlay isPending />
      <AdminContentLayout title="Clientes" description="Overview de todos os clientes">
        <section className="flex flex-col gap-5" />
      </AdminContentLayout>
    </>
  )
}
