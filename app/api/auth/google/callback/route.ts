import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const stateParam = searchParams.get('state');
    
    if (!code) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=NoAuthCode`);
    }

    // Get Google user info
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const { access_token: googleAccessToken } = await tokenResponse.json();

    // Get user profile from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${googleAccessToken}` },
    });

    const googleUser = await userResponse.json();

    // Send to your backend
    const backendResponse = await fetch(`${process.env.API_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: googleUser.email,
        name: googleUser.name,
        profile_url: googleUser.picture
      }),
    });

    if (!backendResponse.ok) {
      throw new Error('Backend authentication failed');
    }

    const { access_token } = await backendResponse.json();

    // Fetch user profile from your backend
    const profileResponse = await fetch(`${process.env.API_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    if (!profileResponse.ok) {
      throw new Error('Failed to fetch profile');
    }

    const profileData = await profileResponse.json();

    // Create response with profile data
    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?profile=${encodeURIComponent(JSON.stringify(profileData))}`
    );

    // Set the auth cookie
    response.cookies.set('auth_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 60, // 30 minutes
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error('Google callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?error=AuthFailed`
    );
  }
}