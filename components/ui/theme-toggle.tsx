"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />; // Placeholder with same dimensions
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-lg p-2 hover:bg-surface-light-paper dark:hover:bg-surface-dark-paper transition-colors relative"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <Sun 
          className="h-5 w-5 absolute top-0 left-0 rotate-0 scale-100 transition-all
            dark:rotate-90 dark:scale-0 text-accent-light-primary dark:text-accent-dark-primary"
        />
        <Moon 
          className="h-5 w-5 absolute top-0 left-0 rotate-90 scale-0 transition-all
            dark:rotate-0 dark:scale-100 text-accent-light-primary dark:text-accent-dark-primary"
        />
      </div>
      <span className="sr-only">
        {mounted ? `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme` : 'Toggle theme'}
      </span>
    </button>
  );
}