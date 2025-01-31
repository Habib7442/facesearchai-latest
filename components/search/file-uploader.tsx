"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"

interface FileUploaderProps {
  file: File | null
  onFileSelect: (file: File) => void
}

export function FileUploader({ file, onFileSelect }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  })

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary h-[400px] flex flex-col items-center justify-center"
    >
      <input {...getInputProps()} />
      <div className="space-y-4">
        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
        {file ? (
          <p className="text-base">{file.name}</p>
        ) : (
          <p className="text-base text-muted-foreground">
            {isDragActive ? "Drop the image here" : "Drag & drop an image, or click to select"}
          </p>
        )}
      </div>
    </div>
  )
} 