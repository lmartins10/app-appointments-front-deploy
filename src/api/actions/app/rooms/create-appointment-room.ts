'use server'

import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/next-auth-options'
import { DEFAULT_PAGES } from '@/constants/default-pages'
import { api } from '@/lib/api'
import { CustomError } from '@/lib/utils/error/custom-error'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'

export interface CreateAppointmentRoomActionType {
  name: string
  startTime: string
  endTime: string
  slotDuration: number
}

export async function createAppointmentRoom({
  name,
  startTime,
  endTime,
  slotDuration,
}: CreateAppointmentRoomActionType) {
  const session = await getServerSession(nextAuthOptions)
  if (!session) {
    throw new CustomError('Session not found', 'SESSION_NOT_FOUND')
  }

  try {
    const request = {
      endpoint: '/rooms',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        name,
        startTime,
        endTime,
        slotDuration,
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

    revalidatePath(DEFAULT_PAGES.ADMIN.rooms)

    return { responseData, status: response.status }
  } catch (error) {
    console.error('Error: ' + error)
    return { error, status: 500 }
  }
}
