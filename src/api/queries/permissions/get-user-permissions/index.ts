'use server'

import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/next-auth-options'
import { api } from '@/lib/api'
import { CustomError } from '@/lib/utils/error/custom-error'
import { getServerSession } from 'next-auth'
import { getTagGetUserPermissions } from './get-revalidate-next-tag'

export type GetUserPermissionsResponse = {
  permissions: {
    id: string
    name: string
    status: string
  }[]
}

export async function getUserPermissions() {
  const session = await getServerSession(nextAuthOptions)
  if (!session) {
    throw new CustomError('Session not found', 'SESSION_NOT_FOUND')
  }

  const userId = session?.user?.id as string

  try {
    const request = {
      endpoint: `/users/${userId}/permissions`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const response = await api(request.endpoint, {
      method: request.method,
      headers: request.headers,
      next: {
        tags: [getTagGetUserPermissions()],
      },
    })

    if (response.status === 500) {
      throw new Error('Error: ' + (await response.text()))
    }

    const responseData: GetUserPermissionsResponse = await response.json()

    return { permissions: responseData.permissions }
  } catch (error) {
    console.error(error)
    return null
  }
}
