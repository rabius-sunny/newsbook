import type { NextRequest, NextResponse } from 'next/server'
import { handleMiddlewares } from './middlewares'

export async function middleware(request: NextRequest, response: NextResponse) {
  return handleMiddlewares(request, response)
}

// Define matchers to restrict middleware application to specific routes
export const config = {
  matcher: [
    '/admin/:path*',
    '/super-admin/:path*',
    '/user/:path*',
    '/login',
    '/register',
    '/checkout',
    '/forget-password'
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    // '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ] // Apply middleware only to these routes
}
