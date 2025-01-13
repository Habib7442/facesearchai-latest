"use client"

import { useState, useRef, useEffect } from "react"
import { SearchForm } from "@/components/search/search-form"
import { SearchResults } from "@/components/search/search-results"
import { SearchLoadingAnimation } from "@/components/search/search-loading"
import { AnimatePresence, motion } from "framer-motion"

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState({
    results: [],
    isPremium: false,
    remainingCredits: 0,
    search_id: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  const handleSearchComplete = (data: any) => {
    console.log("Search completed with data:", data)
    setSearchResults({
      results: data.results || [],
      isPremium: data.is_premium || false,
      remainingCredits: data.remaining_paid_credits || 0,
      search_id: data.search_id || ""
    })
  }

  // Scroll to results when they're loaded
  useEffect(() => {
    if (searchResults.results.length > 0 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, [searchResults.results])

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Face Search</h1>
        <p className="text-muted-foreground">
          Upload an image to search for similar faces across the internet
        </p>
      </div>

      <SearchForm 
        onSearchComplete={handleSearchComplete}
        setIsLoading={setIsLoading}
      />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SearchLoadingAnimation />
          </motion.div>
        ) : searchResults.results.length > 0 && (
          <motion.div
            key="results"
            ref={resultsRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SearchResults {...searchResults} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 