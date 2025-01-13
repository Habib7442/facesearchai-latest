import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.PUBLIC_SEARCH_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.facesearchai.com";

export async function POST(request: NextRequest) {
  try {
    const { image, adult_filter } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "Missing image" }, { status: 400 });
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', new Blob([Buffer.from(image, 'base64')], { type: 'image/jpeg' }), 'image.jpg');
    formData.append('adult_filter', adult_filter ? 'true' : 'false');

    // Make request to external API
    const response = await fetch(`${API_URL}/public-search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Search failed' },
        { status: response.status }
      );
    }

    const apiData = await response.json();
    
    // Format the response to match the expected structure
    const formattedData = {
      results: apiData.results || [],
      is_premium: false,
      remaining_searches: apiData.remaining_searches || 0,
      search_id: apiData.search_id || Date.now().toString(),
    };

    return NextResponse.json(formattedData);
  } catch (error: any) {
    console.error('Public search error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 