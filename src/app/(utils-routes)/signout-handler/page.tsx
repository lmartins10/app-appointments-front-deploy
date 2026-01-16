import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/next-auth-options'
import { LoadingOverlay } from '@/components/app/loading-overlay'
import { NextAuthSignOut } from '@/components/app/next-auth-sign-out'
import { DEFAULT_PAGES } from '@/constants/default-pages'
import { getServerSession } from 'next-auth'

export default async function SignoutHandlerPage() {
  const session = await getServerSession(nextAuthOptions)

  const role = session?.user?.role

  switch (role) {
    case 'CUSTOMER': {
      return (
        <>
          <NextAuthSignOut redirectTo={`${DEFAULT_PAGES.PUBLIC_ROUTES.customerSignIn}`} />
          <LoadingOverlay isPending />
        </>
      )
    }

    case 'ADMIN': {
      return (
        <>
          <NextAuthSignOut redirectTo={`${DEFAULT_PAGES.PUBLIC_ROUTES.adminSignIn}`} />
          <LoadingOverlay isPending />
        </>
      )
    }

    default:
      return (
        <>
          <NextAuthSignOut redirectTo="/" />
          <LoadingOverlay isPending />
        </>
      )
  }
}
