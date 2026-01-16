'use server'

import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/next-auth-options'
import { DEFAULT_PAGES } from '@/constants/default-pages'
import { api } from '@/lib/api'
import { CustomError } from '@/lib/utils/error/custom-error'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'

export interface UpdateUserActionType {
  name: string
  lastName: string
  email: string
  password?: string
}

export async function updateUser({
  name,
  lastName,
  email,
  password,

}: UpdateUserActionType) {
  const session = await getServerSession(nextAuthOptions)
  if (!session) {
    throw new CustomError('Session not found', 'SESSION_NOT_FOUND')
  }

  const userId = session.user.id as string
  const role = session.user.role as string

  try {
    const request = {
      endpoint: `/users/${userId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        name,
        lastName,
        email,
        password,
        role,
      },
    }

    const response = await api(request.endpoint, {
      method: request.method,
      headers: request.headers,
      body: JSON.stringify(request.body),
    })

    if (response.status === 500) {
      throw new Error('Error: ' + (await response.text()))
    }

    const responseData =
      response.status === 204 ? 'No Content' : await response.json()

    revalidatePath(DEFAULT_PAGES.ADMIN.customers)

    return { responseData, status: response.status }
  } catch (error) {
    console.error('Error: ' + error)
    return { error, status: 500 }
  }
}
