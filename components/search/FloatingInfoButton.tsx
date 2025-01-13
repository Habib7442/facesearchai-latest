"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Info } from "lucide-react"
import { toast } from "sonner"

interface ImageData {
  adultContent: boolean
  group: number
  sourceUrl: string
  imageUrl: string
}

interface FloatingInfoButtonProps {
  selectedImages: Set<string>
  searchId: string
  allResults: ImageData[]
}

export function FloatingInfoButton({ 
  selectedImages, 
  searchId,
  allResults 
}: FloatingInfoButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  const handleGetInfo = async () => {
    if (selectedImages.size === 0) {
      toast.error("Please select at least one image")
      return
    }

    setIsLoading(true)
    setIsNavigating(true)
    
    try {
      const selectedImagesData = allResults.filter(
        result => selectedImages.has(result.imageUrl)
      )

      const sources = selectedImagesData.map(img => ({
        source_url: img.sourceUrl || '',
        source_image_url: img.imageUrl
      }))

      // Save sources to sessionStorage before navigation
      sessionStorage.setItem(`sources_${searchId}`, JSON.stringify(sources))

      const response = await fetch("/api/find_info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uuid: searchId,
          sources: sources
        })
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to fetch information")
      }

      router.push(`/getInfo/${searchId}`)

    } catch (error) {
      console.error("Find info error:", error)
      toast.error("Failed to get information")
      setIsNavigating(false)
    } finally {
      setIsLoading(false)
    }
  }

  if (selectedImages.size === 0) return null

  return (
    <>
      {isNavigating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
            <LoadingSpinner className="w-12 h-12 mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Getting information...
            </p>
          </div>
        </div>
      )}
      <Button
        onClick={handleGetInfo}
        disabled={isLoading}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 rounded-full shadow-xl bg-primary hover:bg-primary/90 transition-all duration-300 px-8"
        size="lg"
      >
        <Info className="w-5 h-5 mr-3" />
        Get Info ({selectedImages.size} selected)
        {isLoading && (
          <div className="ml-3 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce" />
          </div>
        )}
      </Button>
    </>
  )
} 