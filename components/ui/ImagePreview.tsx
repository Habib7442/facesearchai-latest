"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { GlassCard } from "@/components/ui/glass-card";
import type { ImagePreviewProps } from "@/types";

export function ImagePreview({ src, alt, title, sourceUrl }: ImagePreviewProps) {
  return (
    <GlassCard className="p-6 bg-white dark:bg-gray-800">
      {title && (
        <h2 className="h4-bold text-[20px] text-text-light-primary dark:text-text-dark-primary mb-4">
          {title}
        </h2>
      )}
      <motion.div
        className="relative aspect-square rounded-[20px] overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </motion.div>
      {sourceUrl && (
        <motion.p
          className="mt-4 small-regular text-text-light-secondary dark:text-text-dark-secondary break-words"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Source:{" "}
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-400 hover:text-primary-500 dark:text-primary-300 dark:hover:text-primary-200 underline"
          >
            {sourceUrl}
          </a>
        </motion.p>
      )}
    </GlassCard>
  );
}