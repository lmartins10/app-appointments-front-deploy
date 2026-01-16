import { AdminContentLayout } from '@/components/app/portals/admin/content-layout'
import { Card, CardContent } from '@/components/ui/card'
import { AppointmentsTabs } from '../_components/tabs'

export default async function AppointmentsNewPage() {
  return (
    <AdminContentLayout title="Cadastrar novo agendamento" description="Realize o cadastro de um novo agendamento">
      <section className="flex h-[calc(100vh-10rem)] items-start justify-center">
        <Card className="w-full max-w-3xl">
          <CardContent>
            <AppointmentsTabs />
          </CardContent>
        </Card>
      </section>
    </AdminContentLayout>
  )
}
