import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { CustomMiddleware } from './chain'

/**
 * Security middleware following Next.js official CSP documentation
 * Generates nonce and sets security headers
 *
 * @see https://nextjs.org/docs/app/guides/content-security-policy
 */
export function securityMiddleware(
  middleware: CustomMiddleware,
): CustomMiddleware {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse,
  ) => {
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
    const isDev = process.env.NODE_ENV === 'development'

    const cspHeader = `
      default-src 'self';
      script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ''};
      style-src 'self' 'unsafe-inline' data:;
      img-src 'self' blob: data: https:;
      font-src 'self' data:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      connect-src 'self';
      upgrade-insecure-requests;
    `

    const contentSecurityPolicyHeaderValue = cspHeader
      .replace(/\s{2,}/g, ' ')
      .trim()

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-nonce', nonce)

    const modifiedRequest = new NextRequest(request.url, {
      method: request.method,
      headers: requestHeaders,
      body: request.body,
    })

    const result = await middleware(modifiedRequest, event, response)

    // Ensure we have a NextResponse to work with
    const finalResponse =
      result instanceof NextResponse ? result : NextResponse.next()

    const env = process.env.NODE_ENV || 'development'

    const hstsConfigs: Record<string, string> = {
      development: 'max-age=300',
      staging: 'max-age=86400; includeSubDomains',
      production: 'max-age=31536000; includeSubDomains; preload',
    }

    finalResponse.headers.set(
      'Content-Security-Policy',
      contentSecurityPolicyHeaderValue,
    )
    finalResponse.headers.set(
      'Strict-Transport-Security',
      hstsConfigs[env] || hstsConfigs.development,
    )
    finalResponse.headers.set('X-Content-Type-Options', 'nosniff')
    finalResponse.headers.set(
      'X-Frame-Options',
      env === 'development' ? 'SAMEORIGIN' : 'DENY',
    )
    finalResponse.headers.set('X-XSS-Protection', '1; mode=block')
    finalResponse.headers.set(
      'Referrer-Policy',
      'strict-origin-when-cross-origin',
    )
    finalResponse.headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), usb=(), bluetooth=(), magnetometer=(), accelerometer=(), gyroscope=(), payment=(), interest-cohort=()',
    )
    finalResponse.headers.set(
      'Cross-Origin-Embedder-Policy',
      env === 'development' ? 'unsafe-none' : 'require-corp',
    )
    finalResponse.headers.set(
      'Cross-Origin-Resource-Policy',
      env === 'development' ? 'cross-origin' : 'same-origin',
    )
    finalResponse.headers.set(
      'Cross-Origin-Opener-Policy',
      env === 'development' ? 'unsafe-none' : 'same-origin',
    )
    finalResponse.headers.set('x-nonce', nonce)

    return finalResponse
  }
}
