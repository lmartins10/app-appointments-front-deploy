import { env } from '@/env'
import { Session } from '@/types/session'
import jwt from 'jsonwebtoken'

export async function decrypt(input: string) {
  try {
    const payload = jwt.verify(input, env.JWT_SECRET, {
      algorithms: ['HS256'],
    })

    if (!payload) {
      return null
    }
    return payload as Session
  } catch (error) {
    console.error('Error decrypting JWT:', error)
    return null
  }
}
