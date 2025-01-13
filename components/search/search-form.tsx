"use client"

import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { FileUploader } from "@/components/search/file-uploader"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Trash2, ZoomIn, ZoomOut, Upload } from "lucide-react"
import { motion } from "framer-motion"
import { setLoading, setResults, setError } from '@/store/slices/searchSlice'
import { selectUser } from '@/store/slices/userSlice'
import { useProfile } from '@/hooks/useProfile'
import type { RootState } from '@/store'

interface SearchFormProps {
  onSearchComplete: (results: any) => void
}

export function SearchForm({ onSearchComplete }: SearchFormProps) {
  useProfile()
  
  const dispatch = useDispatch()
  const isLoading = useSelector((state: RootState) => state.search.isLoading)
  const user = useSelector(selectUser)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const imageRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const uploadedImage = useSelector((state: RootState) => state.uploadedImage.image)

  // Auto-submit when file is selected
  useEffect(() => {
    if (file && formRef.current) {
      formRef.current.requestSubmit()
    }
  }, [file])

  useEffect(() => {
    if (uploadedImage) {
      // Convert base64 to File object
      fetch(uploadedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'uploaded-image.jpg', { type: 'image/jpeg' })
          setFile(file)
          setPreviewUrl(uploadedImage)
        })
    }
  }, [uploadedImage])

  const handlePublicSearch = async (file: File) => {
    try {
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          const base64String = reader.result as string
          
          const response = await fetch('/api/public-search', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: base64String,
              adult_filter: true
            })
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Search failed")
          }

          const data = await response.json()
          dispatch(setResults(data.results))
          onSearchComplete(data)
        } catch (error: any) {
          console.error("Public search error:", error)
          dispatch(setError(error.message || "Failed to perform search"))
          toast.error(error.message || "Failed to perform search. Please try again.")
        }
      }

      reader.readAsDataURL(file)
    } catch (error: any) {
      throw error
    }
  }

  const handlePremiumSearch = async (file: File) => {
    try {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

      const imageData = base64.split(',')[1]
      
      const response = await fetch('/api/search', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imageData,
          adult_filter: true
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Search failed")
      }

      const data = await response.json()
      dispatch(setResults(data.results))
      onSearchComplete(data)
    } catch (error: any) {
      console.error("Premium search error:", error)
      dispatch(setError(error.message || "Failed to perform search"))
      toast.error(error.message || "Failed to perform search. Please try again.")
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    dispatch(setLoading(true))
    try {
      if (user?.subscription?.premium_status) {
        await handlePremiumSearch(file)
      } else {
        await handlePublicSearch(file)
      }
      
      // Show remaining searches for free users
      if (!user?.subscription?.premium_status) {
        toast.info(`Searches remaining: ${data?.remaining_searches || 0}`)
      }
    } catch (error: any) {
      console.error("Search error:", error)
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile)
    const url = URL.createObjectURL(selectedFile)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(Math.max(0.5, prev + delta), 3))
  }

  const clearImage = () => {
    setFile(null)
    setPreviewUrl(null)
    setZoom(1)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card className="overflow-hidden border border-border/40 shadow-sm">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-muted-foreground" />
                Upload Image
              </span>
              {!user?.subscription?.premium_status && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                  Free Search
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <form ref={formRef} onSubmit={handleSubmit} className="h-full">
              <div className="aspect-[4/3] relative">
                <FileUploader 
                  file={file} 
                  onFileSelect={handleFileSelect}
                  className="rounded-none border-none bg-background/50 h-[400px]"
                />
              </div>
              <div className="p-4 border-t bg-muted/30">
                <Button 
                  type="submit" 
                  disabled={!file || isLoading}
                  className="w-full"
                >
                  {isLoading ? "Searching..." : "Search"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card className="overflow-hidden border border-border/40 shadow-sm">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                Preview
              </span>
              {previewUrl && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-muted/50 rounded-md px-2 py-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleZoom(-0.1)}
                      disabled={zoom <= 0.5}
                      className="h-8 w-8 p-0"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium w-12 text-center">
                      {Math.round(zoom * 100)}%
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleZoom(0.1)}
                      disabled={zoom >= 3}
                      className="h-8 w-8 p-0"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={clearImage}
                    className="shadow-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="aspect-[4/3] relative bg-muted/20" ref={imageRef}>
              {previewUrl ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full h-full relative"
                >
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-contain transition-all duration-200"
                    style={{ transform: `scale(${zoom})` }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </motion.div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="relative w-24 h-24 mb-4">
                    <Image
                      src="/icons/preview.png"
                      alt="Upload preview"
                      fill
                      className="opacity-20"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload an image to preview
                  </p>
                </div>
              )}
            </div>
            {previewUrl && (
              <div className="p-4 border-t bg-muted/30">
                <p className="text-sm text-muted-foreground truncate">
                  {file?.name}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}