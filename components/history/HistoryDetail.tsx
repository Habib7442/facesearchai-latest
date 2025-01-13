"use client"

import useSWR from "swr"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, Calendar, ImageIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"

interface SearchResult {
  adultContent: boolean
  group: number
  sourceUrl: string
  imageUrl: string
}

interface HistoryDetailData {
  id: string
  query: string
  timestamp: string
  search_results: SearchResult[]
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to fetch')
  }
  return res.json()
}

export function HistoryDetail({ id }: { id: string }) {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  
  const { data: historyItem, error, isLoading } = useSWR<HistoryDetailData>(
    `/api/history-detail/${id}`,
    fetcher,
    {
      revalidateOnFocus: false,
      onError: (err) => {
        console.error('SWR Error:', err)
      }
    }
  )

  if (error) {
    console.error('History Detail Error:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <p className="text-destructive">Error loading history details: {error.message}</p>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="h-[600px] bg-muted animate-pulse rounded-xl" />
      </div>
    )
  }

  if (!historyItem) {
    return null
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="w-fit hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Button>

          <Card className="p-6 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent backdrop-blur-xl">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 
                           dark:from-gray-100 dark:via-gray-200 dark:to-gray-300
                           bg-clip-text text-transparent">
                Search Details
              </h1>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(historyItem.timestamp), 'PPP')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span>{historyItem.search_results.length} results</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Results Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {historyItem.search_results.map((result, index) => (
            <motion.div
              key={`${result.imageUrl}-${index}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div 
                  className="relative aspect-square cursor-pointer overflow-hidden bg-muted"
                  onClick={() => setSelectedImage(result.imageUrl)}
                >
                  <ImageWithFallback
                    src={result.imageUrl}
                    alt={`Search result ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="p-4 bg-gradient-to-b from-transparent to-muted/50">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full hover:bg-primary/5"
                    asChild
                  >
                    <a
                      href={result.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Source
                    </a>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Image Preview Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div 
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            >
              <motion.div 
                className="relative max-w-4xl w-full aspect-square"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
              >
                <ImageWithFallback
                  src={selectedImage}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}