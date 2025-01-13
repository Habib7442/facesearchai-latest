// app/api/feedback/all/route.ts
import { NextRequest, NextResponse } from "next/server"

const API_URL = "https://api.facesearchai.com"
const API_KEY = process.env.API_KEY // Make sure this is set in your .env

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_URL}/api/feedback/all`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`, // If required by the API
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    })
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}