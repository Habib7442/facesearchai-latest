"use client";

import { useState, useEffect } from "react";

export function useFormattedTime() {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(formatTime(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return time;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  });
}