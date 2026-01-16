import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/next-auth-options'
import { getServerSession } from 'next-auth'

export async function authenticationInterceptor(
  url: string,
  init?: RequestInit,
): Promise<[string, RequestInit?]> {
  const session = await getServerSession(nextAuthOptions)

  if (!session?.user?.accessToken) {
    return [url, init]
  }

  const headers = {
    ...init?.headers,
    Authorization: `Bearer ${session.user.accessToken}`,
  }

  return [
    url,
    {
      ...init,
      headers,
    },
  ]
}
