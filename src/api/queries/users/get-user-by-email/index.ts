'use server'

import { api } from '@/lib/api'

interface GetUserByEmailRequest {
  email: string,
  role: 'ADMIN' | 'CUSTOMER'
}

export async function getUserByEmail({
  email,
  role,
}: GetUserByEmailRequest) {
  try {
    const request = {
      endpoint: `/users/${email}?role=${role}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const response = await api(request.endpoint, {
      method: request.method,
      headers: request.headers,
    })

    if (response.status === 500) {
      throw new Error('Error: ' + (await response.text()))
    }

    const responseData = await response.json()

    return { data: responseData, status: response.status }
  } catch (error) {
    console.error('Error: ' + error)
    return { error, status: 500 }
  }
}
