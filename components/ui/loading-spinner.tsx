"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <div className="flex justify-center items-center h-full">
      <video
        autoPlay
        loop
        muted
        playsInline
        className={cn(
          "object-contain",
          size === "sm" && "w-16 h-16",
          size === "md" && "w-24 h-24",
          size === "lg" && "w-32 h-32",
          className
        )}
      >
        <source src="/animations/loading.webm" type="video/webm" />
        {/* Fallback for browsers that don't support WebM */}
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-.3s]" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-.5s]" />
        </div>
      </video>
    </div>
  );
}