import 'next-auth'
import { UserSession } from './user-session'

declare module 'next-auth' {
  interface Session {
    user: UserSession
    error?: 'RefreshTokenError'
  }

  declare module 'next-auth/jwt' {
    interface JWT {
      error?: 'RefreshTokenError'
    }
  }
}
