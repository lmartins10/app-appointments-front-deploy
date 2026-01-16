'use server'

import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/next-auth-options'
import { DEFAULT_PAGES } from '@/constants/default-pages'
import { api } from '@/lib/api'
import { CustomError } from '@/lib/utils/error/custom-error'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'

export interface UpdateCustomerActionType {
  customerId: string
  userId: string
  name: string
  lastName: string
  email: string
  password?: string
  zipCode: string
  address: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
}

export async function updateCustomer({
  customerId,
  userId,
  name,
  lastName,
  email,
  password,
  zipCode,
  address,
  number,
  complement,
  neighborhood,
  city,
  state,
}: UpdateCustomerActionType) {
  const session = await getServerSession(nextAuthOptions)
  if (!session) {
    throw new CustomError('Session not found', 'SESSION_NOT_FOUND')
  }

  try {
    const request = {
      endpoint: `/customers/${customerId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        userId,
        name,
        lastName,
        email,
        password,
        zipCode,
        address,
        number,
        complement,
        neighborhood,
        city,
        state,
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

    revalidatePath(DEFAULT_PAGES.ADMIN.appointments)

    return { responseData, status: response.status }
  } catch (error) {
    console.error('Error: ' + error)
    return { error, status: 500 }
  }
}
