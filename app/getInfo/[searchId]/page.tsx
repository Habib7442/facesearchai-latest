"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ArrowLeft, ExternalLink, Link2, ImageIcon, User, Music, Youtube, Star, AlertTriangle } from "lucide-react"

const ITEMS_PER_PAGE = 12

interface SearchResult {
  adultContent: boolean
  group: number
  sourceUrl: string
  imageUrl: string
}

interface PersonInfo {
  "Full Name": string
  "Topics": string[]
  "More Information": string
  "Confidential Analysis Score": string
  "Poem": string
}

interface FindInfoResponse {
  message: string
  search_history_id: string
  gpt_result: PersonInfo
  search_results: Array<SearchResult>
}

export default function GetInfoPage() {
  const params = useParams()
  const router = useRouter()
  const [allResults, setAllResults] = useState<SearchResult[]>([])
  const [displayedResults, setDisplayedResults] = useState<SearchResult[]>([])
  const [personInfo, setPersonInfo] = useState<PersonInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sources, setSources] = useState<Array<{ source_url: string; source_image_url: string }>>([])
  const [retryCount, setRetryCount] = useState(0)
  const MAX_RETRIES = 3

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false
  })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  const handleRetry = () => {
    if (retryCount < MAX_RETRIES) {
      setError(null)
      setIsLoading(true)
      setRetryCount(prev => prev + 1)
    } else {
      toast.error("Maximum retry attempts reached. Please try again later.")
    }
  }

  useEffect(() => {
    const fetchResults = async () => {
      if (!params.searchId) {
        setError("Invalid search ID")
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const savedSources = sessionStorage.getItem(`sources_${params.searchId}`)
        const sourcesData = savedSources ? JSON.parse(savedSources) : []
        setSources(sourcesData)

        if (!sourcesData.length) {
          throw new Error("No source images found. Please try your search again.")
        }

        const response = await fetch("/api/find_info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uuid: params.searchId,
            sources: sourcesData
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch results")
        }

        const data: FindInfoResponse = await response.json()
        
        if (!data.gpt_result || !data.search_results) {
          throw new Error("Invalid response format from server")
        }

        setPersonInfo(data.gpt_result)
        setAllResults(data.search_results)
        setDisplayedResults(data.search_results.slice(0, ITEMS_PER_PAGE))
        setHasMore(data.search_results.length > ITEMS_PER_PAGE)

        // Reset retry count on successful fetch
        setRetryCount(0)
      } catch (err: any) {
        console.error("Error fetching results:", err)
        setError(err.message || "Failed to load results")
        toast.error(err.message || "Failed to load results")
        
        if (retryCount < MAX_RETRIES) {
          // Auto-retry after 2 seconds
          setTimeout(handleRetry, 2000)
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (params.searchId) {
      fetchResults()
    }
  }, [params.searchId, retryCount])

  useEffect(() => {
    if (inView && hasMore && !isLoading && allResults.length > 0) {
      const currentLength = displayedResults.length
      const nextResults = allResults.slice(
        currentLength,
        currentLength + ITEMS_PER_PAGE
      )
      
      if (nextResults.length > 0) {
        setDisplayedResults(prev => [...prev, ...nextResults])
        setHasMore(currentLength + ITEMS_PER_PAGE < allResults.length)
      }
    }
  }, [inView, hasMore, isLoading, allResults, displayedResults.length])

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <LoadingSpinner size="lg" />
        {retryCount > 0 && (
          <p className="text-sm text-muted-foreground">
            Retry attempt {retryCount} of {MAX_RETRIES}...
          </p>
        )}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error}</p>
            {retryCount < MAX_RETRIES ? (
              <Button onClick={handleRetry} className="w-full">
                Retry
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Maximum retry attempts reached. Please try again later.
              </p>
            )}
            <Button 
              variant="outline" 
              onClick={() => router.back()} 
              className="w-full"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!personInfo && !displayedResults.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              No Results Found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              No results were found for this search. Please try again with a different image.
            </p>
            <Button 
              onClick={() => router.back()} 
              className="w-full"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="hover:bg-background/60"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-2xl font-bold tracking-tight">Search Results</h1>
        </div>

        {/* Person Info Section */}
        {personInfo && (
          <div className="mb-12 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {personInfo["Full Name"]}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* More Information */}
                <div className="prose dark:prose-invert">
                  <p className="text-muted-foreground">{personInfo["More Information"]}</p>
                </div>

                {/* Topics */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Key Topics
                  </h3>
                  <ul className="space-y-2">
                    {personInfo.Topics.map((topic, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{topic.replace(/^- /, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Poem */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Music className="w-4 h-4" />
                    Poem
                  </h3>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <pre className="whitespace-pre-line font-serif text-sm">
                      {personInfo.Poem}
                    </pre>
                  </div>
                </div>

                {/* Analysis Score */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Youtube className="w-4 h-4" />
                  Confidence Score: {personInfo["Confidential Analysis Score"]}%
                </div>
              </CardContent>
            </Card>

            <h2 className="text-xl font-semibold mt-8 mb-4">Related Images</h2>
          </div>
        )}

        {/* Results Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {displayedResults.map((result, index) => (
            <motion.div key={`${result.sourceUrl}-${index}`} variants={item}>
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative aspect-video group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={result.imageUrl}
                      alt={`Result ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </CardContent>
                
                <CardFooter className="p-4">
                  <div className="flex items-center justify-between w-full gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-8"
                      asChild
                    >
                      <a
                        href={result.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <Link2 className="w-3 h-3" />
                        <span className="truncate">Source</span>
                      </a>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-8"
                      asChild
                    >
                      <a
                        href={result.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span className="truncate">Original</span>
                      </a>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Loading indicator */}
        {hasMore && (
          <div ref={ref} className="flex justify-center items-center py-8">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  )
}