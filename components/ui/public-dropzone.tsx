import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface PublicDropZoneProps {
    onDrop: (file: File) => void;
    dragActive: boolean;
    setDragActive: (dragActive: boolean) => void;
    className?: string;
}

export function PublicDropZone({ onDrop, dragActive, setDragActive, className }: PublicDropZoneProps) {
    const { t } = useTranslation();

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        onDrop(file);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onDrop(file);
      }
    };
  
    return (
      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className="h-full"
      >
        <label 
          className={cn(
            "flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer",
            "border-2 border-dashed transition-colors duration-200",
            dragActive 
              ? "border-primary-500 bg-primary-50/10" 
              : "border-gray-300 dark:border-gray-600 hover:border-primary-500/70",
            "bg-surface-light-paper dark:bg-surface-dark-base",
            className
          )}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload 
              className="w-10 h-10 mb-3 text-gray-400" 
              aria-label={t('dropzone.uploadIcon')}
            />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">{t('dropzone.clickToUpload')}</span>{' '}
              {t('dropzone.dragAndDrop')}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('dropzone.fileTypes')}
            </p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            onChange={handleChange}
            accept="image/*"
          />
        </label>
      </div>
    );
}