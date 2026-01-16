import { LoadingOverlay } from '@/components/app/loading-overlay'
import { AdminContentLayout } from '@/components/app/portals/admin/content-layout'

export default function LogsCustomerPageLoading() {
  return (
    <>
      <LoadingOverlay isPending />
      <AdminContentLayout title="Perfil do Usuário" description="Gerencie as informações do seu perfil de usuário">
        <section className="flex flex-col gap-5" />
      </AdminContentLayout>
    </>
  )
}
