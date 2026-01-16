import { authUserAction } from '@/api/actions/auth/auth-action'
import { decrypt } from '@/lib/auth/decrypt'
import { UserSession } from '@/types/session/user-session'
import { NextAuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'

export const nextAuthOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'E-mail',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
        role: {
          label: 'Role',
          type: 'text',
        },
      },

      async authorize(credentials) {
        try {
          const response = await authUserAction({
            email: credentials?.email ?? '',
            password: credentials?.password ?? '',
            role: credentials?.role ?? '',
          })

          const data = response.data
          console.log('authorize response', data)

          if (response.status === 400) {
            throw new Error(`400:${data.error}`)
          }

          if (response.status === 401) {
            throw new Error(`401:${data.error}`)
          }

          if (response.status === 403) {
            throw new Error(`403:${data.error}`)
          }

          if (response.status === 404) {
            throw new Error(`404:${data.error}`)
          }

          if (response.status === 429) {
            console.error(
              'NextAuth authorize: received 429 from authUserAction', {
                status: response.status,
                data,
              },
            )
            const msg = data?.message ?? 'Muitas requisições. Tente novamente mais tarde.'
            throw new Error(`429:${msg}`)
          }

          const accessToken = data.access_token as string

          if (!accessToken) {
            return null
          }

          const payload = await decrypt(accessToken)

          if (!payload) {
            throw new Error('User not found')
          }

          const forcePasswordChange = data.force_password_change as boolean

          if (forcePasswordChange) {
            throw new Error(`403: Password change required:${payload.user.id}`)
          }

          const id = payload.user.id as string
          const name = payload.user.name as string
          const lastName = payload.user.lastName as string
          const email = payload.user.email as string
          const customerId = payload.user.customerId as string
          const role = payload.user.role as string

          if (response.ok && response.status === 200) {
            const user = {
              id,
              name,
              lastName,
              email,
              customerId,
              role,
              accessToken,
            }

            return user
          } else {
            console.error({
              NextAuth: { message: data.message },
            })

            return null
          }
        } catch (error) {
          console.error({ NextAuth: { error } })
          if (error instanceof Error) {
            throw new Error(error.message || 'Erro desconhecido.')
          } else {
            throw new Error('Erro desconhecido.')
          }
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 1, // 1 hour
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      const dateNow = Math.floor(Date.now() / 1000)

      if (trigger === 'update') {
        return { ...token, ...session }
      }

      if (user) {
        token.user = user as UserSession
        return token
      } else {
        const newToken = await refreshAccessToken(token)
        return newToken
      }
    },
    async session({ session, token }) {
      session.user = token.user as UserSession
      session.error = token.error as 'RefreshTokenError' | undefined

      return session
    },
  },
}

async function refreshAccessToken(token: JWT) {
  try {
    const tokenUser = token?.user as UserSession

    const newToken = {
      ...token,
      user: tokenUser,
    }

    return newToken
  } catch (error) {
    const dateNow = Math.floor(Date.now() / 1000)
    console.error('Error refreshing access_token', error)
    token.error = 'RefreshTokenError'

    return { ...token, exp: dateNow }
  }
}
