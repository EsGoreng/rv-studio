"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BackToTopProps {
  /**
   * Scroll distance in pixels before the button appears.
   * @default 300
   */
  threshold?: number;
  /**
   * Additional CSS classes for positioning or styling.
   */
  className?: string;
  /**
   * Whether to show a circular scroll progress indicator around the button.
   * @default true
   */
  showProgress?: boolean;
  /**
   * Accessible label for screen readers.
   * @default "Kembali ke atas"
   */
  ariaLabel?: string;
}

export function BackToTop({
  threshold = 300,
  className,
  showProgress = true,
  ariaLabel = "Kembali ke atas",
}: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      setIsVisible(scrollY > threshold);

      if (docHeight > 0) {
        const progress = Math.min(Math.max(scrollY / docHeight, 0), 1);
        setScrollProgress(progress);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Circular progress calculations (radius = 20 for a 48x48 box)
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - scrollProgress * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className={cn(
            "fixed bottom-20 right-5 md:bottom-6 md:right-6 z-40 group flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800/80 bg-neutral-900/85 text-foreground shadow-2xl backdrop-blur-xl transition-all duration-200 hover:bg-neutral-800 hover:border-neutral-700 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
            className
          )}
          aria-label={ariaLabel}
          title={ariaLabel}
        >
          {showProgress && (
            <svg
              className="absolute inset-0 -rotate-90 pointer-events-none"
              width="48"
              height="48"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              {/* Background ring */}
              <circle
                cx="24"
                cy="24"
                r={radius}
                className="stroke-neutral-800/70"
                strokeWidth="2.5"
                fill="none"
              />
              {/* Progress ring */}
              <circle
                cx="24"
                cy="24"
                r={radius}
                className="stroke-foreground transition-[stroke-dashoffset] duration-150 ease-out"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          )}

          <ArrowUp className="h-5 w-5 text-foreground/80 transition-transform duration-200 group-hover:text-foreground group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default BackToTop;
