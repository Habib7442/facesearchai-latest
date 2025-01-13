"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, Link as LinkIcon, Check, Loader2, EyeOff, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"
import { FloatingInfoButton } from "./FloatingInfoButton"

const ITEMS_PER_PAGE = 15

interface SearchResult {
  adultContent: boolean
  group: number
  sourceUrl: string
  imageUrl: string
}

interface GroupedResults {
  [key: number]: SearchResult[]
}

interface SearchResultsProps {
  results: SearchResult[]
  isPremium: boolean
  remainingCredits: number
  search_id: string
}

interface ResultCardProps {
  result: SearchResult
  isPremium: boolean
  isSelected: boolean
  onSelect: (imageUrl: string) => void
  onError: (imageUrl: string) => void
  groupCount?: number
}

export function SearchResults({ results, isPremium, remainingCredits, search_id }: SearchResultsProps) {
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [displayedResults, setDisplayedResults] = useState<SearchResult[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [showAdultContent, setShowAdultContent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [groupedView, setGroupedView] = useState(false)
  
  // Memoize filtered results to prevent unnecessary recalculations
  const filteredResults = useMemo(() => 
    results.filter(result => 
      !failedImages.has(result.imageUrl) && 
      (showAdultContent ? true : !result.adultContent)
    ),
    [results, failedImages, showAdultContent]
  )

  // Add grouped results memo
  const groupedResults = useMemo(() => {
    const groups: GroupedResults = {}
    filteredResults.forEach(result => {
      if (!groups[result.group]) {
        groups[result.group] = []
      }
      groups[result.group].push(result)
    })
    return groups
  }, [filteredResults])

  // Add display results memo
  const displayResults = useMemo(() => {
    if (!groupedView) return filteredResults
    // In grouped view, only show one image per group
    return Object.values(groupedResults).map(group => group[0])
  }, [groupedView, filteredResults, groupedResults])

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  })

  // Initialize results
  useEffect(() => {
    const initialResults = displayResults.slice(0, ITEMS_PER_PAGE)
    setDisplayedResults(initialResults)
    setHasMore(displayResults.length > ITEMS_PER_PAGE)
    setPage(1)
  }, [displayResults])

  // Load more results when scrolling
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      setIsLoading(true)
      const nextPage = page + 1
      const start = (nextPage - 1) * ITEMS_PER_PAGE
      const end = start + ITEMS_PER_PAGE
      
      // Simulate loading delay
      setTimeout(() => {
        const newResults = displayResults.slice(start, end)
        if (newResults.length > 0) {
          setDisplayedResults(prev => [...prev, ...newResults])
          setPage(nextPage)
          setHasMore(end < displayResults.length)
        } else {
          setHasMore(false)
        }
        setIsLoading(false)
      }, 500)
    }
  }, [inView, hasMore, isLoading, displayResults, page])

  const handleSelect = (imageUrl: string) => {
    if (!isPremium) {
      toast("Premium subscription required to select images")
      return
    }

    setSelectedImages(prev => {
      const newSelected = new Set(prev)
      if (prev.has(imageUrl)) {
        newSelected.delete(imageUrl)
      } else {
        newSelected.add(imageUrl)
      }
      return newSelected
    })
  }

  const handleImageError = (imageUrl: string) => {
    setFailedImages(prev => new Set(prev).add(imageUrl))
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:justify-between">
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {!isPremium && (
            <Button variant="outline" onClick={() => window.location.href = "/pricing"}>
              Upgrade for Analysis
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdultContent(!showAdultContent)}
            className="flex items-center gap-2"
          >
            {showAdultContent ? (
              <>
                
                <Eye className="w-4 h-4" />
                <span>Show Adult Content</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Hide Adult Content</span>
              </>
            )}
          </Button>

          {/* Add grouping toggle button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setGroupedView(!groupedView)}
            className="flex items-center gap-2"
          >
            {groupedView ? (
              <span>Show All Images</span>
            ) : (
              <span>Group Similar</span>
            )}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Showing {displayedResults.length} of {displayResults.length} results
        </p>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
        {displayedResults.map((result, index) => (
          <motion.div
            key={`${result.imageUrl}-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="transform-gpu w-full max-w-sm"
          >
            <ResultCard
              result={result}
              isPremium={isPremium}
              isSelected={selectedImages.has(result.imageUrl)}
              onSelect={handleSelect}
              onError={handleImageError}
              groupCount={groupedView ? groupedResults[result.group].length : undefined}
            />
          </motion.div>
        ))}
      </div>

      {/* Loading indicator */}
      <div 
        ref={ref}
        className={cn(
          "h-20 flex items-center justify-center",
          !hasMore && "hidden"
        )}
      >
        {isLoading && (
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        )}
      </div>

      <FloatingInfoButton 
        selectedImages={selectedImages} 
        searchId={search_id}
        allResults={results}
      />
    </div>
  )
}

// Update ResultCard to show group count
function ResultCard({ 
  result, 
  isPremium, 
  isSelected, 
  onSelect, 
  onError,
  groupCount
}: ResultCardProps) {
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 w-full",
        isSelected && "border border-border/40"
      )}
    >
      <div className="relative aspect-video bg-muted">
        <Image
          src={result.imageUrl}
          alt="Search result"
          fill
          className={cn(
            "object-cover transition-all duration-200",
            isSelected && "brightness-95"
          )}
          onError={() => onError(result.imageUrl)}
          unoptimized
        />
        
        {/* Selection control */}
        <div 
          onClick={(e) => {
            e.stopPropagation()
            onSelect(result.imageUrl)
          }}
          className={cn(
            "absolute top-3 left-3 flex items-center gap-2 p-1.5 rounded-md",
            "bg-black/50 hover:bg-black/60 transition-colors backdrop-blur-sm",
            isSelected && "bg-primary/80 hover:bg-primary/90"
          )}
        >
          <div className={cn(
            "w-5 h-5 rounded border-2 border-white flex items-center justify-center",
            isSelected && "bg-white"
          )}>
            {isPremium ? (
              <Check className={cn(
                "w-4 h-4 transition-all",
                isSelected ? "text-primary scale-100" : "scale-0"
              )} />
            ) : (
              <Lock className="w-3 h-3 text-white" />
            )}
          </div>
          <span className="text-xs text-white font-medium">
            {!isPremium 
              ? 'Premium Only' 
              : isSelected
                ? 'Selected' 
                : 'Select'}
          </span>
        </div>

        {/* Add group count badge */}
        {groupCount && groupCount > 1 && (
          <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-md text-xs backdrop-blur-sm">
            +{groupCount - 1} similar
          </div>
        )}
      </div>

      <div className="p-3 bg-white dark:bg-gray-900 border-t">
        <a
          href={result.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary truncate w-full"
        >
          <LinkIcon className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{result.sourceUrl}</span>
        </a>
      </div>
    </Card>
  )
}