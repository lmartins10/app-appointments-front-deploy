import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/next-auth-options'
import PanelLayout from '@/components/app/portals/admin/panel-layout'
import { DEFAULT_PAGES } from '@/constants/default-pages'
import { RolePermissionProvider } from '@/contexts/role-permission-context'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function PrivateRoutesCustomerTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(nextAuthOptions)

  if (!session) {
    redirect(DEFAULT_PAGES.PUBLIC_ROUTES.customerSignIn)
  }

  return (
    <RolePermissionProvider>
      <PanelLayout>
        {children}
      </PanelLayout>
    </RolePermissionProvider>
  )
}
