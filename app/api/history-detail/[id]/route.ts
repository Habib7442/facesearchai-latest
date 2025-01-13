import { NextResponse } from "next/server"
import { getAuthToken } from "@/lib/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.facesearchai.com"
const TIMEOUT_DURATION = 30000
const MAX_RETRIES = 3

async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION)

      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      return response
    } catch (error: any) {
      console.error(`Attempt ${i + 1} failed:`, error)
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
    }
  }
  throw new Error('Max retries reached')
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getAuthToken()
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const historyId = params.id
    const response = await fetchWithRetry(`${API_URL}/history-detail/${historyId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      console.error(`API error: ${response.status}`)
      throw new Error(`Backend API error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("History detail data:", data)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("History detail fetch error:", error)
    return NextResponse.json(
      { 
        error: error.message || "Failed to fetch history detail",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}