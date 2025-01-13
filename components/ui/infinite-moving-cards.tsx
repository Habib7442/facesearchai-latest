"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Item {
  id: string;
  quote: string;
  name: string;
  title: string;
}

export const InfiniteMovingCards = ({
  items,
  direction = "right",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: Item[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
  }, []);

  const getAnimationDuration = () => {
    switch (speed) {
      case "fast":
        return "30s";
      case "normal":
        return "40s";
      case "slow":
        return "50s";
      default:
        return "40s";
    }
  };

  const addAnimation = () => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      // Set animation duration
      if (scrollerRef.current) {
        scrollerRef.current.style.setProperty(
          "--animation-duration",
          getAnimationDuration()
        );
      }
      setStart(true);
    }
  };

  const getRating = (title: string) => {
    const rating = parseInt(title.split(' ')[0]);
    return isNaN(rating) ? 0 : rating;
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && (direction === "left" ? "animate-scroll" : "animate-scroll-reverse"),
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item) => (
          <li
            className="group w-[350px] max-w-full relative rounded-xl border flex-shrink-0 
              bg-surface-light-paper dark:bg-surface-dark-paper 
              border-border-light dark:border-border-dark 
              hover:border-primary-500/50 dark:hover:border-primary-400/50
              shadow-elevation-1 dark:shadow-dark-elevation-1
              hover:shadow-elevation-2 dark:hover:shadow-dark-elevation-2
              transition-all duration-300
              px-8 py-6 md:w-[450px]"
            key={item.id}
          >
            <blockquote>
              <div className="relative z-20 mb-6 flex items-center">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-5 h-5",
                        star <= getRating(item.title)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 fill-gray-300"
                      )}
                    />
                  ))}
                </div>
              </div>
              
              <span className="relative z-20 text-sm leading-[1.6] text-text-light-primary dark:text-text-dark-primary font-normal italic">
                "{item.quote}"
              </span>

              <div className="relative z-20 mt-6 flex flex-row items-center">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary">
                    {item.name}
                  </span>
                  <span className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
                    Verified User
                  </span>
                </div>
              </div>
            </blockquote>

            <div className="absolute inset-0 bg-gradient-to-b from-primary-50/0 via-primary-50/0 to-primary-50/20 
                         dark:from-primary-400/0 dark:via-primary-400/0 dark:to-primary-400/10 
                         rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </li>
        ))}
      </ul>
    </div>
  );
};
