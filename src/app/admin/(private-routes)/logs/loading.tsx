import { LoadingOverlay } from '@/components/app/loading-overlay'
import { AdminContentLayout } from '@/components/app/portals/admin/content-layout'

export default function LogsPageLoading() {
  return (
    <>
      <LoadingOverlay isPending />
      <AdminContentLayout title="Logs" description="Acompanhe todos as Logs de clientes">
        <section className="flex flex-col gap-5" />
      </AdminContentLayout>
    </>
  )
}
