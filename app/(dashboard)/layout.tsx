"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { sessionStorage } from "@/lib/utils/session"
import type { UserData } from "@/types/auth"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const userProfile = sessionStorage.getProfile() as UserData | null

      if (!userProfile?.email) {
        console.log('No user profile found, redirecting to sign-in')
        router.push('/sign-in')
        return
      }
    }

    checkAuth()
  }, [router])

  // You might want to add a loading state while checking auth
  const userProfile = sessionStorage.getProfile()
  if (!userProfile?.email) {
    return null // or return a loading spinner
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed navbar */}
      {/* <Navbar /> */}
      
      {/* Main content */}
      <main className="flex-1 pt-12">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
    </div>
  )
}