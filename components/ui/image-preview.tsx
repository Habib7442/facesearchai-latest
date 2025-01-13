"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ImagePreviewProps } from "@/types";
import { Link, ExternalLink } from "lucide-react";

export function ImagePreview({ src, alt, title, sourceUrl }: ImagePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl"
    >
      <div className="p-6 space-y-6">
        {/* Title with animated underline */}
        {title && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-dark-primary">
              {title}
            </h2>
            <motion.div
              className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600 dark:from-primary-300 dark:to-primary-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.4, duration: 0.6 }}
            />
          </motion.div>
        )}

        {/* Image Container with Hover Effects */}
        <motion.div
          className="relative aspect-square rounded-xl overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
          
          {/* Image */}
          <div className="relative w-full h-full">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Hover Overlay with Icon */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link className="w-12 h-12 text-white" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Source URL with Enhanced Animation */}
        <AnimatePresence>
          {sourceUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-dark-secondary"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Source:</span>
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-500 dark:text-primary-300 
                         dark:hover:text-primary-200 underline underline-offset-2
                         transition-colors duration-200 truncate max-w-[240px]"
              >
                {sourceUrl}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animated Border Gradient */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                   bg-gradient-to-r from-primary-400/20 via-primary-500/20 to-primary-600/20"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

