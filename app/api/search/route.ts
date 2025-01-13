import { NextResponse } from "next/server"
import { getAuthToken } from "@/lib/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.facesearchai.com"
const TIMEOUT_DURATION = 60000 // 30 seconds
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
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
    }
  }
  throw new Error('Max retries reached')
}

export async function POST(request: Request) {
  try {
    const token = await getAuthToken()
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { image, adult_filter } = await request.json()
    if (!image) {
      return NextResponse.json({ error: "Missing image" }, { status: 400 })
    }

    const formData = new FormData()
    const byteCharacters = atob(image)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: "image/jpeg" })
    formData.append("file", blob, "image.jpg")

    console.log("Attempting API request to:", API_URL)
    
    const response = await fetchWithRetry(`${API_URL}/search`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'API request failed')
    }

    const data = await response.json()
    const filteredResults = adult_filter
      ? data.data.filter((result: any) => !result.adultContent)
      : data.data

    console.log("API Response successful:", data)

    return NextResponse.json({
      results: filteredResults,
      user_email: data.user_email,
      is_premium: data.is_premium,
      search_id: data.search_id,
    })
  } catch (error: any) {
    console.error("Search error:", error)
    return NextResponse.json(
      { 
        error: error.message || "An error occurred during the search",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 