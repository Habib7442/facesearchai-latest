"use client";

export function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-64 h-64"
      >
        <source src="/animations/searching.webm" type="video/webm" />
        <source src="/animations/searching.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p className="mt-4 text-text-light-secondary dark:text-text-dark-secondary animate-pulse">
        Searching...
      </p>
    </div>
  );
} 