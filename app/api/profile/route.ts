import { NextResponse } from "next/server"
import { getAuthToken } from "@/lib/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function GET() {
  try {
    const token = await getAuthToken()
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const response = await fetch(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch profile')
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    )
  }
} 