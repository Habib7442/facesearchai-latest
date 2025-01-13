"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/store"
import { ScanningAnimation } from "./scanning-animation"
import { ProgressIndicator } from "./progress-indicator"
import { setUploadedImage } from '@/store/slices/uploadedImageSlice'

interface ImageUploadProps {
  open: boolean
  onClose: () => void
}

export default function ImageUpload({ open, onClose }: ImageUploadProps) {
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const uploadedImage = useSelector((state: RootState) => state.uploadedImage.image)
  const dispatch = useDispatch()

  const handleUpload = useCallback(() => {
    if (!isUploading && uploadedImage) {
      setIsUploading(true)
      setProgress(0)
    }
  }, [isUploading, uploadedImage])

  const handleClose = useCallback(() => {
    setIsUploading(false)
    setProgress(0)
    onClose()
  }, [onClose])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (open && isUploading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => {
              handleClose()
              router.push("/search")
            }, 500)
            return 100
          }
          return prev + 2
        })
      }, 50)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [open, isUploading, router, handleClose])

  useEffect(() => {
    if (open && uploadedImage && !isUploading) {
      handleUpload()
      dispatch(setUploadedImage(uploadedImage))
    }
  }, [open, uploadedImage, isUploading, handleUpload, dispatch])

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl p-0 bg-surface-light-paper dark:bg-surface-dark-paper overflow-hidden">
        <div className="p-8">
          <DialogHeader>
            <DialogTitle className="h3-bold bg-gradient-to-r from-primary-300 to-primary-500 dark:from-primary-200 dark:to-primary-400 bg-clip-text text-transparent">
              Processing Your Image
            </DialogTitle>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-text-light-secondary dark:text-text-dark-secondary text-center mt-2"
            >
              We&apos;ll analyze your image and find similar faces
            </motion.p>
          </DialogHeader>

          <div className="mt-8 space-y-6 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative h-80 border-2 border-dashed border-border-light dark:border-border-dark rounded-2xl 
                       flex items-center justify-center bg-surface-light-elevated/50 dark:bg-surface-dark-elevated/50 
                       backdrop-blur-sm hover:border-primary-300 dark:hover:border-primary-400 transition-colors
                       shadow-elevation-1 dark:shadow-dark-elevation-1"
            >
              <AnimatePresence mode="wait">
                {uploadedImage && (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative h-full w-full"
                  >
                    <Image
                      src={uploadedImage}
                      alt="Uploaded preview"
                      fill
                      className="object-contain rounded-xl"
                    />
                    {isUploading && <ScanningAnimation />}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {isUploading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ProgressIndicator progress={progress} />
              </motion.div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 