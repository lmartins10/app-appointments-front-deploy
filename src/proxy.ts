/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from './middlewares/auth-middleware'
import { chain } from './middlewares/chain'
import { securityMiddleware } from './middlewares/security-middleware'

const middlewares = [securityMiddleware, authMiddleware]

export default function proxy(request: NextRequest) {
  const response = NextResponse.next()
  return chain(middlewares)(request, {} as any, response)
}

export const config = {
  matcher: [{
    source: '/((?!api|manifest.json|icons/.*|_next/static|_next/image|favicon.ico|redirect-handler|signout-handler).*)',
    missing: [
      { type: 'header', key: 'next-router-prefetch' },
      { type: 'header', key: 'purpose', value: 'prefetch' },
    ],
  }],
}
