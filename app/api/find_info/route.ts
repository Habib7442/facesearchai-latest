import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get('auth_token');

    if (!authToken?.value) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    console.log('Received request body:', body);

    if (!body.uuid || !body.sources) {
      return NextResponse.json(
        { error: "Search ID (uuid) and sources are required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.sources)) {
      return NextResponse.json(
        { error: "Sources must be an array" },
        { status: 400 }
      );
    }

    console.log('Making API request:', {
      url: `${process.env.API_URL}/find_info`,
      searchId: body.uuid,
      sources: body.sources
    });

    const response = await fetch(`${process.env.API_URL}/find_info`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uuid: body.uuid,
        sources: body.sources
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        detail: `API error: ${response.status} ${response.statusText}`
      }));

      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });

      if (response.status === 401) {
        cookieStore.delete('auth_token');
        return NextResponse.json(
          { error: "Session expired" },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: errorData.detail || "Find info failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('API Response:', data);
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Find info error:", error);
    
    return NextResponse.json(
      { 
        error: error.message || "Internal server error",
        details: error.toString()
      },
      { status: error.status || 500 }
    );
  }
} 