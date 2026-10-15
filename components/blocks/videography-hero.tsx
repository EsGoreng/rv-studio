"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Scan,
  Maximize2,
} from "lucide-react";
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
      videoSrc?: string;
      thumbnail?: any;
      externalThumbnail?: string;
    }>;
  } | null;
  activeVideo?: PlaylistItem | null;
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

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export function VideographyHero({
  data,
  activeVideo,
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

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [showVideo, setShowVideo] = React.useState(false);
  const [isCover, setIsCover] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(true);
  const [volume, setVolume] = React.useState(85);
  const [prevVolume, setPrevVolume] = React.useState(85);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [isControlsVisible, setIsControlsVisible] = React.useState(true);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const playerRef = React.useRef<any>(null);
  const iframeRef = React.useRef<HTMLDivElement>(null);
  const hideTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Auto-hide controls and title on inactivity after 4.5s
  const resetHideTimer = React.useCallback(() => {
    setIsControlsVisible(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    if (isPlaying) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsControlsVisible(false);
      }, 4500);
    }
  }, [isPlaying]);

  React.useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [resetHideTimer]);

  // Load YouTube Iframe API once
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Initialize or update YouTube Player whenever featuredId changes
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
          playerRef.current.setVolume(volume);
        }
        playerRef.current.playVideo();
        setIsPlaying(true);
        setShowVideo(true);
        return;
      } catch (err) {
        console.warn("Failed to switch video:", err);
      }
    }

    let pollInterval: NodeJS.Timeout | null = null;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) {
        pollInterval = setTimeout(initPlayer, 100);
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
            const dur = event.target.getDuration();
            setDuration(dur || 0);
            event.target.mute();
            setIsMuted(true);
            event.target.playVideo();
            setIsPlaying(true);
            setShowVideo(true);
          },
          onStateChange: (event: any) => {
            if (event.data === 1) {
              setIsPlaying(true);
              setShowVideo(true);
              setDuration(event.target.getDuration() || 0);
            } else if (event.data === 2) {
              setIsPlaying(false);
            } else if (event.data === 0) {
              setIsPlaying(false);
            }
          },
        },
      });
    };

    initPlayer();

    return () => {
      if (pollInterval) clearTimeout(pollInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featuredId]);

  // Periodic progress tracker
  React.useEffect(() => {
    const timer = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
        try {
          const curr = playerRef.current.getCurrentTime();
          const dur = playerRef.current.getDuration();
          if (typeof curr === "number") setCurrentTime(curr);
          if (typeof dur === "number" && dur > 0) setDuration(dur);
        } catch {
          // ignore if player is not ready
        }
      }
    }, 250);

    return () => clearInterval(timer);
  }, []);

  const togglePlay = () => {
    if (!playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch { }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    try {
      if (isMuted || volume === 0) {
        const restoreVol = prevVolume > 0 ? prevVolume : 85;
        playerRef.current.unMute();
        playerRef.current.setVolume(restoreVol);
        setVolume(restoreVol);
        setIsMuted(false);
      } else {
        setPrevVolume(volume);
        playerRef.current.mute();
        setIsMuted(true);
      }
    } catch { }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (!playerRef.current) return;
    try {
      if (newVol === 0) {
        setIsMuted(true);
        playerRef.current.mute();
      } else {
        if (isMuted) {
          setIsMuted(false);
          playerRef.current.unMute();
        }
        setPrevVolume(newVol);
        playerRef.current.setVolume(newVol);
      }
    } catch { }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!playerRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const targetTime = ratio * duration;
    playerRef.current.seekTo(targetTime, true);
    setCurrentTime(targetTime);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => { });
    } else {
      document.exitFullscreen?.().catch(() => { });
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const currentVol = isMuted ? 0 : volume;

  if (!featured) return null;

  return (
    <section
      ref={containerRef}
      onMouseMove={resetHideTimer}
      onTouchStart={resetHideTimer}
      onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
      className="relative w-full aspect-video min-h-[240px] xs:min-h-[280px] sm:min-h-[380px] md:min-h-[460px] lg:min-h-[520px] max-h-[680px] rounded-2xl sm:rounded-3xl border border-neutral-800/80 bg-black overflow-hidden flex flex-col justify-end shadow-2xl select-none group"
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

      {/* YouTube Autoplay Video Layer (Cover vs Fit mode like video-playlist) */}
      <div
        className={cn(
          "absolute inset-0 z-0 transition-opacity duration-1000 pointer-events-none overflow-hidden flex items-center justify-center",
          showVideo ? "opacity-100" : "opacity-0"
        )}
      >
        <div
          className={cn(
            "relative transition-all duration-300 flex items-center justify-center [&_iframe]:!w-full [&_iframe]:!h-full [&_iframe]:!absolute [&_iframe]:!inset-0",
            isCover
              ? "min-w-full min-h-full aspect-video scale-[1.04] origin-center shrink-0"
              : "w-full h-full max-w-full max-h-full aspect-video origin-center"
          )}
        >
          <div ref={iframeRef} className="w-full h-full relative" />
        </div>
      </div>

      {/* Transparent Click Layer on Top of Video to Toggle Play/Pause */}
      <div
        onClick={togglePlay}
        className="absolute inset-0 z-10 cursor-pointer bg-transparent"
      />

      {/* Big Center Play Button when paused */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer pointer-events-auto"
        >
          <button
            type="button"
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md text-white border border-white/30 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
            aria-label="Play Video"
          >
            <Play className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ml-1 fill-white text-white drop-shadow" />
          </button>
        </div>
      )}

      {/* Vignette Gradients (Fade out together with title & controls) */}
      <motion.div
        animate={{
          opacity: isControlsVisible ? 1 : 0,
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-0 z-10 pointer-events-none"
      >
        {/* Left side shadow for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent" />
        {/* Bottom smooth fade for controls and title */}
        <div className="absolute inset-x-0 bottom-0 h-44 xs:h-56 sm:h-72 bg-gradient-to-t from-black via-black/80 to-transparent" />
        {/* Top subtle fade */}
        <div className="absolute inset-x-0 top-0 h-16 sm:h-24 bg-gradient-to-b from-black/60 to-transparent" />
      </motion.div>

      {/* Overlay Content Container: Title, Subtitle & Interactive Video Controls */}
      <motion.div
        animate={{
          opacity: isControlsVisible ? 1 : 0,
          y: isControlsVisible ? 0 : 8,
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className={cn(
          "relative z-20 w-full px-3 xs:px-4 sm:px-6 md:px-8 pb-2.5 xs:pb-3 sm:pb-4 flex flex-col justify-end transition-all",
          isControlsVisible ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* Title & Subtitle Section */}
        <div className="max-w-sm xs:max-w-md sm:max-w-xl md:max-w-2xl space-y-1 xs:space-y-1.5 sm:space-y-2.5 mb-2 sm:mb-3">
          <h1 className="text-sm xs:text-base sm:text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">
            {featured.title}
          </h1>

          <p className="text-[10px] xs:text-xs sm:text-sm md:text-base text-neutral-300 leading-snug sm:leading-relaxed max-w-lg line-clamp-1 xs:line-clamp-2 sm:line-clamp-3 drop-shadow">
            {featured.description || "Tonton karya produksi visual terbaik dari RV Studio dengan standar sinematik berkualitas tinggi."}
          </p>
        </div>

        {/* Video Player Controls Bar (Scrub Bar + Buttons) */}
        <div className="w-full flex flex-col gap-1.5 sm:gap-2 pt-1 sm:pt-2">
          {/* Custom Scrub / Progress Bar */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleSeek(e);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              handleSeek(e);
            }}
            className="relative h-3 sm:h-2.5 w-full py-1 -my-1 cursor-pointer flex items-center group/bar"
          >
            <div className="w-full h-1.5 sm:h-2 bg-white/25 rounded-full overflow-hidden transition-all group-hover/bar:h-2.5">
              <div
                className="h-full bg-primary shadow-[0_0_12px_rgba(255,255,255,0.7)] transition-all duration-100 relative rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Control Buttons Row */}
          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap">
              {/* Play / Pause */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 active:scale-90 transition-all cursor-pointer"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
              </button>

              {/* Volume Control with Equalizer Ticks & Slider */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 transition-all group/vol"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  className="p-0.5 text-white/90 hover:text-white transition-colors active:scale-90 cursor-pointer"
                  aria-label={isMuted || volume === 0 ? "Unmute" : "Mute"}
                  title={isMuted || volume === 0 ? "Nyalakan Suara" : "Bisukan Suara"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5 text-red-300" />
                  ) : volume < 50 ? (
                    <Volume1 className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-white" />
                  )}
                </button>

                {/* Volume Ticks */}
                <div className="relative flex items-center h-4 w-14 sm:w-20 md:w-24 px-1 group/track">
                  <div className="relative w-full flex items-end justify-between h-3 pointer-events-none z-0">
                    {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((step, idx) => {
                      const isActive = currentVol >= step;
                      const barHeight = 4 + idx * 0.7;
                      return (
                        <span
                          key={step}
                          style={{ height: `${barHeight}px` }}
                          className={cn(
                            "w-[2px] rounded-full transition-colors duration-150",
                            isActive
                              ? "bg-primary shadow-[0_0_4px_rgba(255,255,255,0.7)]"
                              : "bg-white/25"
                          )}
                        />
                      );
                    })}
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={currentVol}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    aria-label="Volume Slider"
                    title={`Volume: ${currentVol}%`}
                  />
                </div>

                <span className="text-[10px] font-mono text-white/80 w-6 sm:w-7 text-right tabular-nums hidden xs:inline-block">
                  {currentVol}%
                </span>
              </div>

              {/* Duration / Current Time */}
              <span className="text-[10px] sm:text-[11px] font-mono text-white/80 ml-1 hidden sm:inline-block">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] font-mono text-white/80 sm:hidden">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              {/* Cover / Fit Mode Toggle */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCover((prev) => !prev);
                }}
                className={cn(
                  "p-1.5 sm:p-2 rounded-full backdrop-blur-sm border active:scale-90 transition-all cursor-pointer",
                  isCover
                    ? "bg-primary/90 hover:bg-primary border-primary/40 text-primary-foreground shadow-sm"
                    : "bg-white/10 hover:bg-white/20 border-white/20 text-white"
                )}
                title={
                  isCover
                    ? "Mode: Cover Penuh (Klik untuk Fit / Rasio Asli)"
                    : "Mode: Fit Rasio Asli (Klik untuk Cover Penuh)"
                }
                aria-label={isCover ? "Ubah ke mode Fit" : "Ubah ke mode Cover"}
              >
                {isCover ? (
                  <Scan className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Fullscreen Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 active:scale-90 transition-all text-white cursor-pointer"
                aria-label="Fullscreen"
                title="Layar Penuh"
              >
                <Maximize className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default VideographyHero;
