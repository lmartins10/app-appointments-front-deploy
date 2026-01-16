import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/next-auth-options'

import { getServerSession } from 'next-auth'
import QueryClientProvider from './query-client-provider'
import NextAuthSessionProvider from './session-provider'

interface ProviderProps {
  children: React.ReactNode
}

export default async function Providers({ children }: ProviderProps) {
  const session = await getServerSession(nextAuthOptions)

  return (
    <QueryClientProvider>
      <NextAuthSessionProvider session={session}>
        {children}
      </NextAuthSessionProvider>
    </QueryClientProvider>
  )
}
