import { NextResponse } from 'next/server'
import { getAuthToken, isTokenExpired } from '@/lib/auth'
import { jwtDecode } from 'jwt-decode'

export async function GET() {
  const token = await getAuthToken()

  if (!token || isTokenExpired(token)) {
    return NextResponse.json({
      authenticated: false,
      user: null
    })
  }

  const decoded = jwtDecode(token)
  
  return NextResponse.json({
    authenticated: true,
    user: {
      email: decoded.email,
      sub: decoded.sub
    }
  })
} 