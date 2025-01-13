"use client"

import useSWR from "swr"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"
import { ExternalLink, Clock, ImageIcon, Search, FileImage } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchResult {
  imageUrl: string
  sourceUrl: string
}

interface HistoryPreviewItem {
  id: string
  query: string
  result_count: number
  timestamp: string
  platform: string
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

export function HistoryList() {
  const router = useRouter()

  const { data: history, error, isLoading } = useSWR<HistoryPreviewItem[]>(
    '/api/history-preview',
    fetcher,
    {
      revalidateOnFocus: false,
      onError: (err) => {
        console.error('SWR Error:', err)
      }
    }
  )

  if (error) {
    console.error('History Error:', error)
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading history: {error.message}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-[300px] bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    )
  }

  if (!history?.length) {
    return (
      <div className="text-center py-12">
        <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Search History</h3>
        <p className="text-muted-foreground">
          Your search history will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {history.map((item, index) => {
        const firstResult = item.search_results?.[0]
        const imageUrl = firstResult?.imageUrl

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card 
              className="group cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={() => router.push(`/history-detail/${item.id}`)}
            >
              <div className="relative aspect-video bg-muted">
                {imageUrl ? (
                  <ImageWithFallback
                    src={imageUrl}
                    alt={`Search result for ${item.query}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileImage className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-sm text-white truncate">
                      {item.query.split('/').pop()?.replace('_image.jpg', '')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(item.timestamp), 'PPp')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      {item.result_count}
                    </span>
                  </div>
                </div>
                <Button 
                  className="w-full group-hover:bg-primary/90 transition-colors"
                  variant="default"
                >
                  View Results
                  <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
} 