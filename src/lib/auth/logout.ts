'use client'

import { signOut } from 'next-auth/react'
import { toast } from 'sonner'

export async function Logout({
  redirectUrl = '/',
  router,
}: {
  redirectUrl?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router: any
}) {
  await signOut({
    redirect: false,
  })
  toast.success('Logout realizado com sucesso', {
    description: 'Esperamos vê-lo novamente em breve!',
  })
  router.replace(redirectUrl)
  router.refresh()
}
