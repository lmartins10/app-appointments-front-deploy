import { api } from '@/lib/api'
import { CustomError } from '@/lib/utils/error/custom-error'

export interface AuthUserActionRequestType {
  email: string
  password: string
  role: string
}

export async function authUserAction({
  email,
  password,
  role,
}: AuthUserActionRequestType) {
  try {
    const request = {
      endpoint: '/sessions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ',
      },
      body: {
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

    const responseData = await response.json()

    if (!responseData) {
      throw new CustomError('Response data not found', 'DATA_NOT_FOUND')
    }

    return { data: responseData, status: response.status, ok: response.ok }
  } catch (error) {
    console.error(error)
    return { status: 500, error }
  }
}
