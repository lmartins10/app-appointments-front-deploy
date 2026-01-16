import { AdminContentLayout } from '@/components/app/portals/admin/content-layout'
import { Card, CardContent } from '@/components/ui/card'
import { AdminUserProfileForm } from './_components/form'

export default async function AdminUserProfilePage() {
  return (
    <AdminContentLayout title="Perfil do Usuário" description="Gerencie as informações do seu perfil de usuário">
      <section className="flex items-start justify-center">
        <Card className="w-[448px]">
          <CardContent>
            <AdminUserProfileForm />
          </CardContent>
        </Card>
      </section>
    </AdminContentLayout>
  )
}
