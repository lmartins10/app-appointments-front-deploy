import { Logo } from '@/components/app/logo'
import { AdminContentLayout } from '@/components/app/portals/admin/content-layout'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function HomePage() {
  const currentDate = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  })

  return (
    <AdminContentLayout title="Página Inicial" description="Bem-vindo ao portal de administração">
      <div className="flex min-h-[calc(100vh-200px)] w-full items-center justify-center">
        <section className="w-full max-w-4xl px-4 py-8 text-center">
          <div className="mb-8 flex items-center justify-center">
            <Logo className="size-16" />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-xl font-bold text-gray-800 sm:text-2xl md:text-3xl lg:text-4xl">
                Portal de Administrador
              </h1>
              <p className="mx-auto max-w-xl text-sm text-gray-600 sm:text-base md:text-lg lg:max-w-2xl">
                Destinado à equipe de administração, oferecendo recursos para otimizar o
                processo administrativo de maneira eficiente e eficaz.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-blue-700 shadow-sm">
                <Badge variant="outline" className="mr-2">
                  📅
                </Badge>
                <span className="text-sm font-medium">{currentDate}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminContentLayout>
  )
}
