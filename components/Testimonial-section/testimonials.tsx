'use client'

import { useState, useEffect } from 'react'
import { InfiniteMovingCards } from "../ui/infinite-moving-cards"
import { LoadingSpinner } from "../ui/loading-spinner"

interface Feedback {
  user_name: string
  content: string
  rating: number
  submitted_at: string
}

interface FeedbackResponse {
  feedback: Feedback[]
}

function TestimonialList() {
  const [data, setData] = useState<FeedbackResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const res = await fetch(`${baseUrl}/api/feedback/all`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!res.ok) {
          throw new Error(`Failed to fetch feedback: ${res.status}`)
        }

        const jsonData = await res.json()
        setData(jsonData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load testimonials')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeedback()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-muted-foreground">
        Error loading testimonials
      </div>
    )
  }

  if (!data?.feedback?.length) {
    return (
      <div className="text-center text-muted-foreground">
        No testimonials available
      </div>
    )
  }

  const transformedTestimonials = data.feedback.map((feedback: Feedback, index: number) => ({
    id: `${feedback.user_name}-${feedback.submitted_at}-${index}`,
    quote: feedback.content,
    name: feedback.user_name,
    title: `${feedback.rating} ★ Rating`,
  }))

  const finalTestimonials =
    transformedTestimonials.length < 5
      ? [
          ...transformedTestimonials,
          ...transformedTestimonials.map((t) => ({
            ...t,
            id: `${t.id}-duplicate`,
          })),
        ]
      : transformedTestimonials

  return (
    <div className="rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={finalTestimonials}
        direction="right"
        speed="slow"
      />
    </div>
  )
}

export default function TestimonialContent() {
  return <TestimonialList />
}
