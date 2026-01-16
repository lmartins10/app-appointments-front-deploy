'use client'

import { signOut } from 'next-auth/react'
import { useEffect } from 'react'

export function NextAuthSignOut({ redirectTo }: { redirectTo?: string }) {
  useEffect(() => {
    signOut({ redirect: true, callbackUrl: redirectTo })
  }, [redirectTo])

  return null
}
