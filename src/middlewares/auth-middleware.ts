import { DEFAULT_PAGES } from '@/constants/default-pages'
import { Session } from 'next-auth'
import { getToken } from 'next-auth/jwt'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { CustomMiddleware } from './chain'

export function authMiddleware(middleware: CustomMiddleware): CustomMiddleware {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse,
  ) => {
    const token = (await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })) as Session | null

    const path = request.nextUrl.pathname
    const accessToken = token?.user.accessToken as string
    const role = token?.user.role as string
    const tokenError = token?.error

    if (isPublicRoute(path)) {
      if (!accessToken || tokenError) {
        return middleware(request, event, response)
      }

      if (role === 'ADMIN') {
        return NextResponse.redirect(
          new URL(`${DEFAULT_PAGES.ADMIN.home}`, request.url),
        )
      }

      if (role === 'CUSTOMER') {
        return NextResponse.redirect(
          new URL(`${DEFAULT_PAGES.CUSTOMER.home}`, request.url),
        )
      }

      return NextResponse.redirect(new URL('/', request.url))
    }

    if (!accessToken || tokenError) {
      return handleUnauthorizedAccess(path, request)
    }

    const hasCustomerRole = role === 'CUSTOMER'
    const hasAdminRole = role === 'ADMIN'

    if (path === '/' && accessToken && hasCustomerRole) {
      return NextResponse.redirect(
        new URL(`${DEFAULT_PAGES.CUSTOMER.home}`, request.url),
      )
    }

    if (path === '/' && accessToken && hasAdminRole) {
      return NextResponse.redirect(
        new URL(`${DEFAULT_PAGES.ADMIN.home}`, request.url),
      )
    }

    if (accessToken && hasCustomerRole && (path === '/admin' || path.startsWith('/admin/'))) {
      return NextResponse.redirect(
        new URL(`${DEFAULT_PAGES.CUSTOMER.home}`, request.url),
      )
    }

    if (accessToken && hasAdminRole && (path === '/customer' || path.startsWith('/customer/'))) {
      return NextResponse.redirect(
        new URL(`${DEFAULT_PAGES.ADMIN.home}`, request.url),
      )
    }

    const authRoutes = [
      `${DEFAULT_PAGES.PUBLIC_ROUTES.adminSignIn}`,
      `${DEFAULT_PAGES.PUBLIC_ROUTES.customerSignIn}`,
      `${DEFAULT_PAGES.PUBLIC_ROUTES.customerSignUp}`,
    ]

    if (accessToken && authRoutes.includes(path)) {
      if (hasAdminRole) {
        return NextResponse.redirect(
          new URL(`${DEFAULT_PAGES.ADMIN.home}`, request.url),
        )
      }

      if (hasCustomerRole) {
        return NextResponse.redirect(
          new URL(`${DEFAULT_PAGES.CUSTOMER.home}`, request.url),
        )
      }

      return middleware(request, event, response)
    }
  }
}

function isPublicRoute(path: string): boolean {
  const publicPaths = [
    DEFAULT_PAGES.PUBLIC_ROUTES.customerSignIn,
    DEFAULT_PAGES.PUBLIC_ROUTES.adminSignIn,
    DEFAULT_PAGES.PUBLIC_ROUTES.customerSignUp,
  ]
  return publicPaths.some((publicPath) => {
    return path.includes(publicPath)
  })
}

function handleUnauthorizedAccess(
  path: string,
  request: NextRequest,
): NextResponse {
  if (path.startsWith('/customer/') || path.startsWith('/admin/')) {
    return NextResponse.redirect(
      new URL(`${DEFAULT_PAGES.PUBLIC_ROUTES.signoutHandler}`, request.nextUrl.origin),
    )
  }

  return NextResponse.next()
}
