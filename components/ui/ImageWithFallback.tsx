"use client"

import { useState, useEffect } from 'react'
import Image, { ImageProps } from 'next/image'

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError' | 'src'> {
  src: string | null | undefined
  fallback?: string
}

export function ImageWithFallback({ 
  src, 
  fallback = '/images/placeholder.png',
  alt,
  ...props 
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (src) {
      setImgSrc(src)
      setHasError(false)
    } else {
      setImgSrc(fallback)
      setHasError(true)
    }
  }, [src, fallback])

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallback)
      setHasError(true)
    }
  }

  if (!imgSrc) {
    return null
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || ''}
      onError={handleError}
    />
  )
} 