import { LoadingOverlay } from '@/components/app/loading-overlay'
import { AdminContentLayout } from '@/components/app/portals/admin/content-layout'

export default function LogsCustomerPageLoading() {
  return (
    <>
      <LoadingOverlay isPending />
      <AdminContentLayout title="Logs" description="Visualize os logs de atividades do cliente">
        <section className="flex flex-col gap-5" />
      </AdminContentLayout>
    </>
  )
}
