import { NextRequest, NextResponse } from "next/server";
import { toast } from "sonner";

const API_KEY = process.env.PUBLIC_SEARCH_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.facesearchai.com";
const ALLOWED_PLATFORMS = ['web', 'mobile', 'desktop'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  try {
    // Rate limiting headers
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const platform = request.headers.get("x-platform") || 'web';
    
    // Validate API key
    if (!API_KEY) {
      console.error("API key not configured");
      return NextResponse.json(
        { error: "Service not configured properly" },
        { status: 500 }
      );
    }

    // Validate platform
    if (!ALLOWED_PLATFORMS.includes(platform.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid platform. Allowed platforms: web, mobile, desktop" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { image, adultFilter = true } = body;

    // Validate request body
    if (!image) {
      return NextResponse.json(
        { error: "Missing image data" },
        { status: 400 }
      );
    }

    // Convert base64 to blob with validation
    try {
      const base64Data = image.split(',')[1]; // Remove data URL prefix if present
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
      
      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      
      const blob = new Blob(byteArrays, { type: 'image/jpeg' });

      // Validate file size
      if (blob.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "Image size exceeds 10MB limit" },
          { status: 400 }
        );
      }

      const formData = new FormData();
      formData.append('file', blob, 'image.jpg');

      // Call the search API with proper error handling
      const response = await fetch(`${API_URL}/public-search`, {
        method: "POST",
        headers: {
          "X-API-Key": API_KEY,
          "X-Platform": platform,
          "X-Forwarded-For": ip,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
      }

      const data = await response.json();

      // Format and filter results
      const formattedData = {
        results: data.data || [],
        user_email: data.user_email || 'guest',
        is_premium: false, // Always false for public search
        search_id: data.search_id || Date.now().toString(),
        remaining_searches: data.remaining_searches || 0,
      };

      const filteredResults = adultFilter 
        ? formattedData.results.filter((result: any) => !result.adultContent)
        : formattedData.results;

      return NextResponse.json({
        success: true,
        results: filteredResults,
        user_email: formattedData.user_email,
        is_premium: formattedData.is_premium,
        search_id: formattedData.search_id,
        remaining_searches: formattedData.remaining_searches,
      });

    } catch (error: any) {
      console.error("Base64 conversion error:", error);
      return NextResponse.json(
        { error: "Invalid image data" },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error("Public search error:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
        metadata: {
          timestamp: new Date().toISOString(),
          request_id: crypto.randomUUID()
        }
      },
      { status: error.status || 500 }
    );
  }
} 