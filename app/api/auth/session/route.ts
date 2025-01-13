import { NextResponse } from 'next/server'
import { getAuthToken, isTokenExpired } from '@/lib/auth'
import { jwtDecode } from 'jwt-decode'

export async function GET() {
  try {
    const token = await getAuthToken()
    
    if (!token || isTokenExpired(token)) {
      return NextResponse.json({
        authenticated: false,
        session: null
      })
    }

    const decoded = jwtDecode(token)
    
    return NextResponse.json({
      authenticated: true,
      session: {
        expiresAt: decoded.exp,
        email: decoded.email
      }
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json(
      { error: 'Failed to get session' },
      { status: 500 }
    )
  }
} 