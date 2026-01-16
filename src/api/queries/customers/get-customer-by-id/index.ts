'use server'

import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/next-auth-options'
import { api } from '@/lib/api'
import { CustomError } from '@/lib/utils/error/custom-error'
import { getServerSession } from 'next-auth'
import { getTagGetCustomerById } from './get-revalidate-next-tag'

export interface GetCustomerByIdRequest {
  id: string
}

export type GetCustomerByIdResponse = {
  userId: string
  name: string
  lastName: string
  email: string
  customerId: string
  zipCode: string
  address: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string

  createdAt: string
  createdBy: string | null
  updatedAt?: string
  updatedBy?: string | null
  inactivatedAt?: string
  inactivatedBy?: string | null
}

export async function getCustomerById({ id }: GetCustomerByIdRequest) {
  const session = await getServerSession(nextAuthOptions)
  if (!session) {
    throw new CustomError('Session not found', 'SESSION_NOT_FOUND')
  }

  try {
    const request = {
      endpoint: `/customers/${id}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const response = await api(request.endpoint, {
      method: request.method,
      headers: request.headers,
      next: {
        tags: [getTagGetCustomerById({ id })],
      },
    })

    if (response.status === 500) {
      throw new Error('Error: ' + (await response.text()))
    }

    const responseData: GetCustomerByIdResponse = await response.json()

    return { room: responseData }
  } catch (error) {
    console.error(error)
    return null
  }
}
