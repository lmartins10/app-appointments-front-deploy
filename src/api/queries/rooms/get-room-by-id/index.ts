'use server'

import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/next-auth-options'
import { api } from '@/lib/api'
import { CustomError } from '@/lib/utils/error/custom-error'
import { getServerSession } from 'next-auth'
import { getTagGetRoomById } from './get-revalidate-next-tag'

export interface GetRoomByIdRequest {
  id: string
}

export type GetRoomByIdResponse = {
  roomId: string
  name: string
  startTime: string
  endTime: string
  slotDuration: number

  createdAt: string
  createdBy: string | null
  updatedAt?: string
  updatedBy?: string | null
  inactivatedAt?: string
  inactivatedBy?: string | null
}

const logsTag = 'getRoomById'

export async function getRoomById({ id }: GetRoomByIdRequest) {
  const session = await getServerSession(nextAuthOptions)
  if (!session) {
    throw new CustomError('Session not found', 'SESSION_NOT_FOUND')
  }

  try {
    const request = {
      endpoint: `/rooms/${id}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const response = await api(request.endpoint, {
      method: request.method,
      headers: request.headers,
      next: {
        tags: [getTagGetRoomById({ id })],
      },
    })

    if (response.status === 500) {
      throw new Error('Error: ' + (await response.text()))
    }

    const responseData: GetRoomByIdResponse = await response.json()

    return { room: responseData }
  } catch (error) {
    console.error(error)
    return null
  }
}
