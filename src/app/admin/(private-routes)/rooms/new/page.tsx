import { AdminContentLayout } from '@/components/app/portals/admin/content-layout'
import { Card, CardContent } from '@/components/ui/card'
import { NewAppointmentRoomForm } from '../_components/new-form'

export default async function RoomNewPage() {
  return (
    <AdminContentLayout title="Cadastrar nova sala" description="Realize o cadastro de uma nova sala">
      <section className="flex h-[calc(100vh-10rem)] items-start justify-center">
        <Card className="w-[448px]">
          <CardContent>
            <NewAppointmentRoomForm />
          </CardContent>
        </Card>
      </section>
    </AdminContentLayout>
  )
}
