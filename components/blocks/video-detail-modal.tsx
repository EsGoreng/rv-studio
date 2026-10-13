"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Share2, Check } from "lucide-react";
import { PlaylistItem } from "@/constants/video-playlist";

export interface VideoDetailModalProps {
  video: PlaylistItem | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper to get direct YouTube watch URL from embed or raw link
function getYouTubeWatchUrl(url?: string): string {
  if (!url) return "";
  if (url.includes("embed/")) {
    const id = url.split("embed/")[1]?.split("?")[0];
    return id ? `https://www.youtube.com/watch?v=${id}` : url;
  }
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split("?")[0];
    return id ? `https://www.youtube.com/watch?v=${id}` : url;
  }
  return url;
}

export function VideoDetailModal({ video, isOpen, onClose }: VideoDetailModalProps) {
  const [copied, setCopied] = React.useState(false);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!video) return null;

  const directWatchUrl = getYouTubeWatchUrl(video.videoSrc);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(directWatchUrl || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl z-10 my-auto text-white"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/70 hover:bg-black text-white/80 hover:text-white flex items-center justify-center border border-white/20 transition-all active:scale-95"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Video Player or Thumbnail */}
            <div className="relative aspect-video w-full bg-black overflow-hidden">
              {video.videoSrc ? (
                <iframe
                  src={`${video.videoSrc}?autoplay=1&rel=0`}
                  title={video.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              )}
              {/* Gradient Vignette at Bottom */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-neutral-900 to-transparent pointer-events-none" />
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-6 space-y-4">
              {/* Header Info */}
              <div className="space-y-2">
                {video.category && (
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {/* Category Pill - White */}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20 font-medium tracking-wide">
                      {video.category}
                    </span>
                  </div>
                )}

                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                  {video.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                {video.description || "Video dokumentasi dan produksi visual berkualitas tinggi dari RV Studio."}
              </p>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <a
                    href={directWatchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg text-xs sm:text-sm transition-all active:scale-95 shadow-md"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Buka di YouTube
                  </a>
                  <button
                    onClick={handleShare}
                    type="button"
                    className="inline-flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium px-3 py-2 rounded-lg text-xs sm:text-sm border border-neutral-700 transition-all active:scale-95"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    {copied ? "Tersalin!" : "Bagikan"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
