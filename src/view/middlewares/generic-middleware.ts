import { decrypt, encrypt } from '@/lib/crypto-utils'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { routeConfigs } from './config'

const secret = '12345678901234567890123456789012' // Must be 32 characters

interface MiddlewareConfig {
  protectedRoutes: string[] // Auth-protected routes
  tokenKey: string // Cookie key for auth token (e.g., 'token', 'adminToken')
  loginPath: string // Path to login screen
  defaultPath: string // Path to redirect authenticated users to
}

export async function genericMiddleware(
  request: NextRequest,
  _response: NextResponse,
  config: MiddlewareConfig
) {
  const token = request.cookies.get(config.tokenKey)?.value ?? ''
  const { pathname, searchParams, origin } = request.nextUrl
  const callbackParam = searchParams.get('callbackUrl')

  const fullPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
  const isAuthRoute = routeConfigs.authRoutes.some((authRoute) => pathname === authRoute)
  const isProtectedRoute = config.protectedRoutes.some((route) => pathname.startsWith(route))

  if (isAuthRoute && token) {
    if (callbackParam) {
      const decodedCallbackParam = decodeURIComponent(callbackParam)
      const decryptedCallbackUrl = await decrypt(decodedCallbackParam, secret)
      if (decryptedCallbackUrl === '/admin' || decryptedCallbackUrl === '/user') {
        return NextResponse.redirect(new URL(config?.defaultPath, origin))
      }
      return NextResponse.redirect(new URL(decryptedCallbackUrl, origin))
    }
    return NextResponse.redirect(new URL(config.defaultPath, origin))
  }

  if (isProtectedRoute && !token && !isAuthRoute) {
    const loginUrl = new URL(config.loginPath, origin)
    const encryptedCallbackUrl = await encrypt(fullPath, secret)
    loginUrl.searchParams.set('callbackUrl', encodeURIComponent(encryptedCallbackUrl))
    return NextResponse.redirect(loginUrl)
  } else if (isProtectedRoute && token) {
    if (callbackParam) {
      const decodedCallbackParam = decodeURIComponent(callbackParam)
      const decryptedCallbackUrl = await decrypt(decodedCallbackParam, secret)
      const cleanUrl = new URL(decryptedCallbackUrl, origin)
      return NextResponse.redirect(cleanUrl)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}
