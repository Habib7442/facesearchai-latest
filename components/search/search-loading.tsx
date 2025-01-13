"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function SearchLoadingAnimation() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play()
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <div className="relative w-64 h-64">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full"
        >
          <source src="/animations/searching.webm" type="video/webm" />
        </video>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-muted-foreground mt-4 text-center"
      >
        Searching for similar faces...
      </motion.p>
    </motion.div>
  )
} 