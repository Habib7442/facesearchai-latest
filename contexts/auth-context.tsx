'use client'

import { createContext, useContext, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import type { UserSession, LoginCredentials, UserData } from '@/types/auth'
import { setUser, clearUser, setUserLoading, setUserError } from '@/store/slices/userSlice'
import { sessionStorage } from '@/lib/utils/session'
import { isTokenExpired, getAuthToken } from '@/lib/auth'
import { jwtDecode } from 'jwt-decode'

interface AuthContextType {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
  updateProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const logoutTimer = useRef<NodeJS.Timeout>()

  const handleLogout = async () => {
    sessionStorage.clearProfile()
    dispatch(clearUser())
    router.push('/')
  }

  const setAutoLogout = async (token: string) => {
    try {
      // Clear any existing timer
      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current)
      }

      const decoded = jwtDecode(token)
      if (!decoded.exp) return

      // Calculate time until token expires (subtract 10 seconds for safety margin)
      const timeUntilExpiry = decoded.exp * 1000 - Date.now() - 10000
      
      if (timeUntilExpiry <= 0) {
        // Token is already expired
        await handleLogout()
        return
      }

      // Set timer to logout when token expires
      logoutTimer.current = setTimeout(() => {
        handleLogout()
      }, timeUntilExpiry)
      
    } catch (error) {
      console.error('Error setting auto logout:', error)
    }
  }

  const checkSession = async () => {
    try {
      const token = await getAuthToken()
      
      // if (!token || isTokenExpired(token)) {
      //   console.log('Token expired or not found, logging out')
      //   await handleLogout()
      //   return false
      // }

      // Set auto logout timer based on token expiry
      // await setAutoLogout(token)
      return true
    } catch (error) {
      console.error('Session check error:', error)
      await handleLogout()
      return false
    }
  }

  const refreshSession = async () => {
    try {
      dispatch(setUserLoading(true))
      
      // First check if session is valid
      const isValid = await checkSession()
      if (!isValid) return

      // Get stored profile for immediate display
      const profile = sessionStorage.getProfile()
      if (profile) {
        dispatch(setUser(profile))
      }

      // Fetch fresh data from API
      const response = await fetch('/api/auth/session')
      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          sessionStorage.setProfile(data.user)
          dispatch(setUser(data.user))
        }
      } else {
        await handleLogout()
      }
    } catch (error) {
      console.error('Session refresh error:', error)
      dispatch(setUserError('Failed to refresh session'))
      await handleLogout()
    } finally {
      dispatch(setUserLoading(false))
    }
  }

  // Initial session check
  useEffect(() => {
    refreshSession()

    // Cleanup timer on unmount
    return () => {
      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current)
      }
    }
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch(setUserLoading(true))
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
      }

      const data = await response.json()
      
      if (!data.user) {
        throw new Error('No user data received')
      }

      // Set auto logout timer for the new token
      if (data.access_token) {
        await setAutoLogout(data.access_token)
      }

      sessionStorage.setProfile(data.user)
      dispatch(setUser(data.user))

      console.log('Login successful, profile stored:', data.user)
      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      dispatch(setUserError(error instanceof Error ? error.message : 'Login failed'))
      throw error
    } finally {
      dispatch(setUserLoading(false))
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      await handleLogout()
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear local data even if API call fails
      await handleLogout()
    }
  }

  const updateProfile = async () => {
    try {
      // Check session before updating
      const isValid = await checkSession()
      if (!isValid) return

      const response = await fetch('/api/auth/session')
      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          sessionStorage.setProfile(data.user)
          dispatch(setUser(data.user))
        }
      }
    } catch (error) {
      console.error('Profile update error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ login, logout, refreshSession, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}