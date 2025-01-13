import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.facesearchai.com";
const TIMEOUT_DURATION = 60000; // 60 seconds
const MAX_RETRIES = 3;

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
        { error: "Please sign in to continue" },
        { status: 401 }
      );
    }

    const { plan_id } = await request.json();
    if (!plan_id) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    // Get the origin for success/cancel URLs
    const origin = request.headers.get("origin") || "http://localhost:3000";

    const response = await fetchWithRetry(`${API_URL}/subscriptions/initialize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        plan_id,
        success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/pricing`
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.code === 'subscription_exists') {
        throw new Error('You already have an active subscription');
      }
      throw new Error(errorData.message || 'Failed to initialize subscription');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Subscription initialization error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to initialize subscription",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}