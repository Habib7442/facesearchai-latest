// app/api/feedback/all/route.ts
import { NextResponse } from "next/server";

export const revalidate = 60; // revalidate every 60 seconds

export async function GET() {
  try {
    const res = await fetch(`${process.env.API_URL}/feedback/all`, {
      next: {
        revalidate: 60 // cache for 60 seconds
      }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}