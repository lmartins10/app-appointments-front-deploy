import { getUserPermissions } from '@/api/queries/permissions/get-user-permissions'
import { CustomError } from '@/lib/utils/error/custom-error'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { nextAuthOptions } from '../auth/[...nextauth]/next-auth-options'

export async function GET() {
  try {
    const session = await getServerSession(nextAuthOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'SESSION_NOT_FOUND' },
        { status: 401 },
      )
    }

    const result = await getUserPermissions()

    return NextResponse.json(result?.permissions)
  } catch (error) {
    console.error('Error in GET /api/permissions/[userId]:', error)

    if (error instanceof CustomError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
