"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { SAMPLE_PLAYLIST, PlaylistItem } from "@/constants/video-playlist";
import { resolveImageUrl } from "@/sanity/lib/image";

export interface VideographyHeroProps {
  data?: {
    title?: string;
    description?: string;
    items?: Array<{
      _key?: string;
      title?: string;
      description?: string;
      category?: string;
      duration?: string;
      videoSrc?: string;
      thumbnail?: any;
      externalThumbnail?: string;
    }>;
  } | null;
  activeVideo?: PlaylistItem | null;
  onOpenDetail?: (item: PlaylistItem) => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

function getYouTubeId(url: string): string {
  if (!url) return "";
  if (url.includes("embed/")) return url.split("embed/")[1]?.split("?")[0] || "";
  if (url.includes("watch?v=")) return url.split("watch?v=")[1]?.split("&")[0] || "";
  if (url.includes("youtu.be/")) return url.split("youtu.be/")[1]?.split("?")[0] || "";
  return url;
}

export function VideographyHero({
  data,
  activeVideo,
  onOpenDetail,
}: VideographyHeroProps) {
  const items: PlaylistItem[] = React.useMemo(() => {
    if (data?.items && data.items.length > 0) {
      return data.items
        .filter((item) => item.videoSrc)
        .map((item, index) => {
          const fallback = SAMPLE_PLAYLIST[index % SAMPLE_PLAYLIST.length];
          const thumb = resolveImageUrl(
            item.thumbnail,
            item.externalThumbnail || fallback?.thumbnail
          );
          return {
            id: item._key || String(index + 1),
            title: item.title || fallback?.title || `Video ${index + 1}`,
            description: item.description || fallback?.description || "",
            duration: item.duration || "YouTube",
            thumbnail: thumb,
            videoSrc: item.videoSrc || fallback?.videoSrc || "",
            category: item.category || fallback?.category,
          };
        });
    }
    return SAMPLE_PLAYLIST;
  }, [data?.items]);

  // Use activeVideo if provided, fallback to first item
  const featured = activeVideo || items[0];
  const featuredId = React.useMemo(
    () => getYouTubeId(featured?.videoSrc || ""),
    [featured?.videoSrc]
  );

  const [isMuted, setIsMuted] = React.useState(true);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [showVideo, setShowVideo] = React.useState(false);
  const [isTextVisible, setIsTextVisible] = React.useState(true);
  const hideTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const playerRef = React.useRef<any>(null);
  const iframeRef = React.useRef<HTMLDivElement>(null);

  // Auto-hide title & subtitle after 5 seconds, reset timer on user interaction
  const resetHideTimer = React.useCallback(() => {
    setIsTextVisible(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setIsTextVisible(false);
    }, 5000);
  }, []);

  React.useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [resetHideTimer]);

  // Load / Update YouTube Player whenever featuredId changes
  React.useEffect(() => {
    if (typeof window === "undefined" || !featuredId) return;

    resetHideTimer();

    // If player is already initialized, switch video dynamically
    if (playerRef.current && typeof playerRef.current.loadVideoById === "function") {
      try {
        playerRef.current.loadVideoById({
          videoId: featuredId,
          startSeconds: 0,
        });
        if (isMuted) {
          playerRef.current.mute();
        } else {
          playerRef.current.unMute();
        }
        playerRef.current.playVideo();
        setIsPlaying(true);
        setShowVideo(true);
        return;
      } catch (err) {
        console.warn("Failed to switch video:", err);
      }
    }

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) {
        setTimeout(initPlayer, 100);
        return;
      }
      if (playerRef.current) return;
      playerRef.current = new window.YT.Player(iframeRef.current, {
        videoId: featuredId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          playsinline: 1,
          loop: 1,
          playlist: featuredId,
        },
        events: {
          onReady: (event: any) => {
            event.target.mute();
            event.target.playVideo();
            setIsPlaying(true);
            setShowVideo(true);
          },
          onStateChange: (event: any) => {
            if (event.data === 1) setIsPlaying(true);
            if (event.data === 2) setIsPlaying(false);
          },
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featuredId]);

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(80);
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  if (!featured) return null;

  return (
    <section
      onMouseMove={resetHideTimer}
      onTouchStart={resetHideTimer}
      className="relative w-full aspect-video min-h-[220px] xs:min-h-[260px] sm:min-h-[360px] md:min-h-[460px] lg:min-h-[520px] max-h-[680px] rounded-2xl sm:rounded-3xl border border-neutral-800/80 bg-black overflow-hidden flex flex-col justify-end shadow-2xl"
    >
      {/* Background Thumbnail (Static image fallback) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={featured.id || featured.thumbnail}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={featured.thumbnail}
            alt={featured.title}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* YouTube Autoplay Video Layer (Height matches 16:9 video naturally) */}
      <div
        className={cn(
          "absolute inset-0 z-0 transition-opacity duration-1000 pointer-events-none overflow-hidden",
          showVideo ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="w-full h-full relative aspect-video flex items-center justify-center">
          <div ref={iframeRef} className="w-full h-full" />
        </div>
      </div>

      {/* Vignette Gradients */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Left side shadow for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent" />
        {/* Bottom smooth fade */}
        <div className="absolute inset-x-0 bottom-0 h-28 xs:h-36 sm:h-52 bg-gradient-to-t from-black via-black/80 to-transparent" />
        {/* Top subtle fade */}
        <div className="absolute inset-x-0 top-0 h-16 sm:h-24 bg-gradient-to-b from-black/60 to-transparent" />
      </div>

      {/* Hero Content Container (Scaled down nicely on mobile) */}
      <div className="relative z-20 w-full px-3 xs:px-4 sm:px-6 md:px-8 pb-3 xs:pb-4 sm:pb-8 md:pb-10 flex items-end justify-between gap-3">
        {/* Left Column: Title, Subtitle & Buttons */}
        <div className="max-w-sm xs:max-w-md sm:max-w-xl md:max-w-2xl space-y-1.5 xs:space-y-2 sm:space-y-3.5">
          {/* Animated Hero Content (Fades out after 5 seconds of inactivity) */}
          <motion.div
            key={`hero-text-${featured.id}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: isTextVisible ? 1 : 0,
              y: isTextVisible ? 0 : 6,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className={cn(
              "space-y-1 xs:space-y-1.5 sm:space-y-2.5 transition-opacity",
              !isTextVisible && "pointer-events-none"
            )}
          >
            {/* Main Title - scaled down on mobile */}
            <h1 className="text-sm xs:text-base sm:text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">
              {featured.title}
            </h1>

            {/* Subtitle / Description - compact on mobile */}
            <p className="text-[10px] xs:text-xs sm:text-sm md:text-base text-neutral-300 leading-snug sm:leading-relaxed max-w-lg line-clamp-1 xs:line-clamp-2 sm:line-clamp-3 drop-shadow">
              {featured.description || "Tonton karya produksi visual terbaik dari RV Studio dengan standar sinematik berkualitas tinggi."}
            </p>

            {/* Action Button: Play (membuka modal detail / info) */}
            <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 pt-0.5 sm:pt-1 flex-wrap">
              <button
                type="button"
                onClick={() => onOpenDetail ? onOpenDetail(featured) : window.open(featured.videoSrc, "_blank")}
                className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-neutral-200 active:scale-95 text-black font-bold px-3 py-1 xs:px-3.5 xs:py-1.5 sm:px-6 sm:py-2.5 rounded text-[11px] xs:text-xs sm:text-sm md:text-base transition-all shadow-xl cursor-pointer"
              >
                <Play className="w-3 h-3 sm:w-4 sm:h-4 fill-black shrink-0" />
                Putar
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Audio Button */}
        <div className="flex items-center gap-2 shrink-0 pb-0.5">
          {/* Mute Button */}
          <button
            type="button"
            onClick={toggleMute}
            className="w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9 rounded-full border border-white/40 bg-black/50 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center text-white transition-all active:scale-90"
            aria-label={isMuted ? "Nyalakan Suara" : "Bisukan"}
            title={isMuted ? "Nyalakan Suara" : "Bisukan"}
          >
            {isMuted ? (
              <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

export default VideographyHero;
