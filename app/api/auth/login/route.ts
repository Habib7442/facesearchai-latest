import { NextResponse } from 'next/server'
import { login } from '@/lib/auth'
import type { LoginCredentials } from '@/types/auth'

export async function POST(request: Request) {
  try {
    const credentials: LoginCredentials = await request.json()
    const loginResponse = await login(credentials)
    
    if (!loginResponse.success) {
      throw new Error('Login failed');
    }

    // After successful login, fetch the user profile
    const profileResponse = await fetch(`${process.env.API_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${loginResponse.token}`
      }
    });

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      console.error('Profile fetch failed:', errorText);
      throw new Error('Failed to fetch profile');
    }

    const profileData = await profileResponse.json();

    // Return both auth status and user profile
    return NextResponse.json({
      success: true,
      user: profileData
    })
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    )
  }
} 