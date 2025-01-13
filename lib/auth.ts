"use server"
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'
import type { LoginCredentials, LoginResponse } from '@/types/auth'
import type { SignUpFormValues } from '@/lib/schemas/signUpSchema'

const AUTH_COOKIE = 'auth_token'
const BASE_URL = process.env.API_URL || 'https://api.facesearchai.com'

interface RegisterResponse {
  success: boolean
  data?: any
  error?: string
}

export async function register(data: SignUpFormValues): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: data.name,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Registration failed')
    }

    return {
      success: true,
      data: result
    }

  } catch (error) {
    console.error('Registration error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed'
    }
  }
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Login failed response:', errorText);
      throw new Error('Login failed');
    }

    const data = await response.json();

    // Set cookie with HTTP-only flag
    const cookieStore = cookies()
    await cookieStore.set({
      name: AUTH_COOKIE,
      value: data.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 60, // 30 minutes
      path: '/',
    });

    return {
      token: data.access_token,
      success: true
    };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Authentication failed');
  }
}

export async function logout() {
  const cookieStore = cookies()
  await cookieStore.delete(AUTH_COOKIE)
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = cookies()
  const cookie = await cookieStore.get(AUTH_COOKIE)
  return cookie?.value
}

export async function isTokenExpired(token: string): Promise<boolean> {
  try {
    const decoded = jwtDecode(token)
    if (!decoded.exp) return true
    
    // Add a small buffer (10 seconds) to account for any delays
    return decoded.exp * 1000 <= Date.now() + 10000
  } catch {
    return true
  }
}