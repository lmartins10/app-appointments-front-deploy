import { AdminContentLayout } from '@/components/app/portals/admin/content-layout'
import { Card, CardContent } from '@/components/ui/card'
import { NewCustomerForm } from '../_components/new-form'

export default async function CustomerNewPage() {
  return (
    <AdminContentLayout title="Cadastrar novo cliente" description="Realize o cadastro de um novo cliente">
      <section className="flex items-start justify-center">
        <Card className="w-[448px]">
          <CardContent>
            <NewCustomerForm />
          </CardContent>
        </Card>
      </section>
    </AdminContentLayout>
  )
}
