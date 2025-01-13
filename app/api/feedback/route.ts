import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.facesearchai.com";
const TIMEOUT_DURATION = 60000; // 60 seconds
const MAX_RETRIES = 3;

interface FeedbackRequest {
  rating: number;
  content: string;
  feedback: string;
}

async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error: any) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw new Error('Max retries reached');
}

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json(
        { error: "Please sign in to submit feedback" },
        { status: 401 }
      );
    }

    // Parse and validate the request body
    const body = await request.json() as FeedbackRequest;
    
    // Validate required fields
    if (!body.rating || !body.content) {
      return NextResponse.json(
        { error: "Rating and content are required" },
        { status: 400 }
      );
    }

    // Structure the feedback data
    const feedbackData = {
      feedback: {
        rating: Number(body.rating),
        content: body.content.trim(),
        feedback: body.content.trim()
      }
    };

    const response = await fetchWithRetry(`${API_URL}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(feedbackData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail?.[0]?.msg || 'Failed to submit feedback');
    }

    const data = await response.json();
    return NextResponse.json({
      status: 'success',
      message: 'Feedback submitted successfully',
      data
    });

  } catch (error: any) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to submit feedback",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 