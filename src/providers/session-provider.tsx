'use client'

import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

interface NextAuthSessionProviderProps {
  children: React.ReactNode
  session: Session | null
}

export default function NextAuthSessionProvider({
  children,
  session,
}: NextAuthSessionProviderProps) {
  return (
    <SessionProvider session={session} refetchInterval={5}>
      {children}
    </SessionProvider>
  )
}
