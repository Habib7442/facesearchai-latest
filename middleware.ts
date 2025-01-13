import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isTokenExpired } from '@/lib/auth'

const publicOnlyPaths = [
  '/sign-in',
  '/sign-up',
  // Add other public-only routes
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublicOnlyPath = publicOnlyPaths.some(path => pathname.startsWith(path))

  try {
    const token = request.cookies.get('token')?.value
    const isAuthenticated = token && !isTokenExpired(token)

    // Only redirect authenticated users away from public-only pages
    if (isAuthenticated && isPublicOnlyPath) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 