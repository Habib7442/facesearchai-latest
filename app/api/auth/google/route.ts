import { NextRequest, NextResponse } from "next/server";

const GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    
    // Generate state with callback information
    const state = {
      nonce: Math.random().toString(36).substring(7),
      callback: callbackUrl
    };
    
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
      response_type: 'code',
      scope: 'email profile',
      state: JSON.stringify(state),
      access_type: 'offline',
      prompt: 'consent'
    });

    return NextResponse.redirect(`${GOOGLE_OAUTH_URL}?${params.toString()}`);

  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?error=AuthInitFailed`
    );
  }
} 