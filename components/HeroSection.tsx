"use client"

import Balancer from "react-wrap-balancer"
import Link from "next/link"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { badges } from "@/constants"
import { toast } from "sonner"
import { ToggleSwitch } from "@/components/ui/toggle-switch"
import { setUploadedImage } from "@/store/slices/uploadedImageSlice"
import { HeroSectionProps } from "@/types"
import { WebcamCapture } from "@/components/ui/webcam-capture"
import { DropZone } from "@/components/ui/drop-zone"
import { useTranslation } from "react-i18next"
import { ChevronDownIcon } from "lucide-react"
import Image from "next/image"
import ImageUpload from "@/components/upload/image-upload"

const HeroSection: React.FC<HeroSectionProps> = () => {
  const { t } = useTranslation()
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [useCamera, setUseCamera] = useState(false)
  const dispatch = useDispatch()

  const handleFile = (file: File) => {
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, or WEBP)")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Please upload an image smaller than 10MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      dispatch(setUploadedImage(e.target?.result as string))
      setDialogOpen(true)
    }
    reader.onerror = () => {
      toast.error("Failed to read the image file")
    }
    reader.readAsDataURL(file)
  }

  const handleCameraCapture = async (imageSrc: string) => {
    try {
      const response = await fetch(imageSrc)
      const blob = await response.blob()
      const file = new File([blob], "camera-capture.jpg", {
        type: "image/jpeg",
      })
      handleFile(file)
    } catch (error) {
      toast.error("Failed to capture image")
    }
  }

  return (
    <div className="relative min-h-full">
      <section className="relative overflow-hidden min-h-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center h-full py-12 lg:py-20">
            {/* Left Column - Content */}
            <div className="flex flex-col justify-center text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
              {/* Stats Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/5 rounded-full px-4 py-2 mb-6 w-fit mx-auto lg:mx-0 hover:scale-[1.02] transition-transform">
                <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                  {t("hero.stats.users")}
                </span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                <Balancer>
                  {t("hero.title.main")}
                  <span className="block mt-2 text-primary-500">
                    {t("hero.title.subMain")}
                  </span>
                  <span className="block mt-2">
                    {t("hero.title.sub")}
                  </span>
                </Balancer>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                {t("hero.description")}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                {badges.map((badge) => (
                  <Link
                    key={badge.id}
                    href={badge.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-transform hover:scale-105"
                  >
                    <Image
                      src={badge.src}
                      alt={badge.alt}
                      width={120}
                      height={40}
                      className="h-10 w-auto"
                      priority
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Column - Upload */}
            <div className="w-full h-full flex flex-col">
              <div className="mb-6">
                <ToggleSwitch
                  leftLabel="Upload"
                  rightLabel="Camera"
                  isChecked={useCamera}
                  onChange={() => setUseCamera(!useCamera)}
                />
              </div>

              <div className="flex-1 min-h-[400px] w-full">
                {useCamera ? (
                  <div className="h-full w-full rounded-xl overflow-hidden">
                    <WebcamCapture onCapture={handleCameraCapture} />
                  </div>
                ) : (
                  <div className="h-full w-full">
                    <DropZone
                      onDrop={handleFile}
                      dragActive={isDragging}
                      setDragActive={setIsDragging}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block opacity-0 animate-[fadeIn_0.6s_ease-out_1s_forwards]">
            <button
              onClick={() => document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" })}
              className="flex flex-col items-center gap-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <span className="text-sm font-medium">{t("hero.title.scrollToUpload")}</span>
              <ChevronDownIcon className="w-5 h-5 animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      <ImageUpload open={isDialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  )
}

export default HeroSection