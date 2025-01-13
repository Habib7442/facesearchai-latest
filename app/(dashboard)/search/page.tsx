"use client"

import { useState } from "react"
import { SearchForm } from "@/components/search/search-form"
import { SearchResults } from "@/components/search/search-results"

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState({
    results: [],
    isPremium: false,
    remainingCredits: 0,
    search_id: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSearchComplete = (data: any) => {
    console.log("Search completed with data:", data)
    setSearchResults({
      results: data.results || [],
      isPremium: data.is_premium || false,
      remainingCredits: data.remaining_paid_credits || 0,
      search_id: data.search_id || ""
    })
  }

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
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : searchResults.results.length > 0 && (
        <SearchResults {...searchResults} />
      )}
    </div>
  )
} 