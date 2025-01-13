import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const publicPaths = ['/sign-in', '/sign-up', '/', '/about', '/pricing']
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // Get token from authorization header
  const token = request.headers.get('authorization')?.replace('Bearer ', '')

  try {
    if (!token && !isPublicPath) {
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Redirect authenticated users away from auth pages
    if (token && (request.nextUrl.pathname === '/sign-in' || request.nextUrl.pathname === '/sign-up')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Session middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 