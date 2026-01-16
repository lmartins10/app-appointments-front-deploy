'use server'

import { DEFAULT_PAGES } from '@/constants/default-pages'
import { api } from '@/lib/api'
import { revalidatePath } from 'next/cache'

export interface CreateAppointmentRequestType {
  date: string
  hour: string
  userId: string
  customerId: string
  roomId: string
}

export async function createAppointment({
  date,
  hour,
  userId,
  customerId,
  roomId,
}: CreateAppointmentRequestType) {
  try {
    const request = {
      endpoint: '/appointments',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        date,
        hour,
        userId,
        customerId,
        roomId,
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
