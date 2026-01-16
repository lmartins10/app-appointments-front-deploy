'use server'

import { DEFAULT_PAGES } from '@/constants/default-pages'
import { api } from '@/lib/api'
import { revalidatePath } from 'next/cache'

export interface CreateNewCustomerRequestType {
  name: string
  lastName: string
  email: string
  password: string
  zipCode: string
  address: string
  number: string
  complement?: string | null
  neighborhood: string
  city: string
  state: string
  role: string
}

export async function createNewCustomer({
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
  role,
}: CreateNewCustomerRequestType) {
  try {
    const request = {
      endpoint: '/customers',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        name,
        lastName,
        email,
        password,
        zipCode,
        address,
        number,
        complement: complement || null,
        neighborhood,
        city,
        state,
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

    const responseData = response.status === 201 ? 'No Content' : await response.json()

    revalidatePath(DEFAULT_PAGES.ADMIN.customers)

    return { data: responseData, status: response.status }
  } catch (error) {
    console.error('Error: ' + error)
    return { error, status: 500 }
  }
}
