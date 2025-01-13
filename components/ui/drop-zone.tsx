"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { UploadIcon, FileImage, FileUp } from "lucide-react";
import { DropZoneProps } from "@/types";
import { useTranslation } from "react-i18next";

export function DropZone({ onDrop, dragActive, setDragActive }: DropZoneProps) {
  const { t } = useTranslation('common');

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onDrop(file);
    }
  };

  return (
    <div
      className="relative h-80"
      onDragEnter={() => setDragActive(true)}
      onDragLeave={() => setDragActive(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <motion.div
        className={cn(
          "h-full rounded-[20px] transition-all duration-300",
          "border-2 border-dashed",
          dragActive
            ? "border-primary-500 dark:border-primary-400 bg-primary-100/50 dark:bg-primary-900/10"
            : "border-border-light dark:border-border-dark hover:border-primary-500 dark:hover:border-primary-400",
          "bg-surface-light-paper dark:bg-surface-dark-paper",
          "shadow-elevation-1 dark:shadow-dark-elevation-1",
          "hover:shadow-elevation-2 dark:hover:shadow-dark-elevation-2"
        )}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center h-full cursor-pointer p-6"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "p-4 rounded-full",
              "bg-primary-100 dark:bg-primary-900/20",
              "shadow-elevation-1 dark:shadow-dark-elevation-1"
            )}
          >
            <UploadIcon className="h-10 w-10 text-primary-500 dark:text-primary-400" />
          </motion.div>

          <motion.div
            className="mt-6 space-y-2 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="h4-bold text-primary-500 dark:text-primary-400">
              {t('dropZone.title')}
            </h3>
            <p className="body-regular text-text-light-secondary dark:text-text-dark-secondary">
              {t('dropZone.browse')}
            </p>
          </motion.div>

          <motion.div
            className="mt-6 flex flex-col items-center gap-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 small-regular text-text-light-secondary dark:text-text-dark-secondary">
              <FileImage className="h-4 w-4" />
              <span>{t('dropZone.supports')}</span>
            </div>
            <div className="flex items-center gap-2 small-regular text-text-light-secondary dark:text-text-dark-secondary">
              <FileUp className="h-4 w-4" />
              <span>{t('dropZone.maxSize')}</span>
            </div>
          </motion.div>

          {dragActive && (
            <motion.div
              className="absolute inset-0 rounded-[20px] bg-primary-100/50 dark:bg-primary-900/10 backdrop-blur-sm flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-surface-light-elevated/90 dark:bg-surface-dark-elevated/90 p-4 rounded-xl shadow-elevation-2 dark:shadow-dark-elevation-2">
                <p className="small-medium text-primary-500 dark:text-primary-400">
                  {t('dropZone.release')}
                </p>
              </div>
            </motion.div>
          )}
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onDrop(file);
          }}
          className="hidden"
        />
      </motion.div>
    </div>
  );
}