import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUser, setUserLoading, setUserError } from '@/store/slices/userSlice'
import type { UserProfile } from '@/types/user'

export function useProfile() {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProfile = async () => {
      dispatch(setUserLoading(true))
      try {
        const response = await fetch('/api/profile')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch profile')
        }

        dispatch(setUser(data as UserProfile))
      } catch (error: any) {
        console.error('Profile fetch error:', error)
        dispatch(setUserError(error.message))
      } finally {
        dispatch(setUserLoading(false))
      }
    }

    fetchProfile()
  }, [dispatch])
} 