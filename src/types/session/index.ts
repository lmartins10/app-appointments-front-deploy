import { UserSession } from './user-session'

export interface Session {
  sub: string
  user: UserSession
  iat: number
}
