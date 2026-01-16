'use server'

import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/next-auth-options'
import { api } from '@/lib/api'
import { CustomError } from '@/lib/utils/error/custom-error'
import { getServerSession } from 'next-auth'
import { getTagFetchAvailableTimes } from './get-revalidate-next-tag'

export interface FetchAvailableTimesRequest {
  roomId: string
  date: string
}

export type FetchAvailableTimesResponse = {
  availableTimes: string[]
}

export async function fetchAvailableTimes({ roomId, date }: FetchAvailableTimesRequest) {
  const session = await getServerSession(nextAuthOptions)
  if (!session) {
    throw new CustomError('Session not found', 'SESSION_NOT_FOUND')
  }

  try {
    const request = {
      endpoint: `/rooms/${roomId}/available-times?date=${date}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const response = await api(request.endpoint, {
      method: request.method,
      headers: request.headers,
      next: {
        tags: [getTagFetchAvailableTimes({ roomId, date })],
      },
    })

    if (response.status === 500) {
      throw new Error('Error: ' + (await response.text()))
    }

    const responseData: FetchAvailableTimesResponse = await response.json()

    return { availableTimes: responseData.availableTimes }
  } catch (error) {
    console.error(error)
    return null
  }
}
