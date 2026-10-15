"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  ListVideo,
  PanelRightClose,
  PanelRightOpen,
  Search,
  X,
  Filter,
  Scan,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PlaylistItem } from "@/constants/video-playlist";

export interface VideoPlaylistProps {
  items: PlaylistItem[];
  hideOnStart?: boolean;
  className?: string;
  autoplayOnChange?: boolean;
  nextOverlay?: boolean;
  nextCountdownThreshold?: number;
  defaultCover?: boolean; // Default true: full cover mode
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

// Extract YouTube video ID
function getYouTubeId(url: string): string {
  if (!url) return "";
  if (url.includes("embed/")) {
    return url.split("embed/")[1]?.split("?")[0] || "";
  }
  if (url.includes("watch?v=")) {
    return url.split("watch?v=")[1]?.split("&")[0] || "";
  }
  if (url.includes("youtu.be/")) {
    return url.split("youtu.be/")[1]?.split("?")[0] || "";
  }
  return url;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export function VideoPlaylist({
  items,
  hideOnStart = false,
  className,
  defaultCover = false,
}: VideoPlaylistProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [showPlaylist, setShowPlaylist] = React.useState(!hideOnStart);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isCover, setIsCover] = React.useState(defaultCover);
  // Default muted: true agar autoplay diizinkan oleh browser
  const [isMuted, setIsMuted] = React.useState(true);
  const [volume, setVolume] = React.useState(85);
  const [prevVolume, setPrevVolume] = React.useState(85);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [showControls, setShowControls] = React.useState(true);
  const [isDesktop, setIsDesktop] = React.useState(false);

  // Kategori & Search Filter
  const [selectedCategory, setSelectedCategory] = React.useState<string>("Semua");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const containerRef = React.useRef<HTMLDivElement>(null);
  const playerRef = React.useRef<any>(null);
  const iframeContainerRef = React.useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Deteksi ukuran layar desktop (lg breakpoint >= 1024px) untuk animasi sidebar
  React.useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // List kategori unik dari items
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    const unique = Array.from(set);
    return ["Semua", ...unique];
  }, [items]);

  // Filter items berdasarkan kategori dan pencarian
  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      const matchCategory =
        selectedCategory === "Semua" ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  const currentVideo = items[currentIndex];

  const currentVideoId = React.useMemo(
    () => getYouTubeId(currentVideo?.videoSrc || ""),
    [currentVideo?.videoSrc]
  );

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

  // Initialize or re-cue player when video changes
  React.useEffect(() => {
    if (typeof window === "undefined" || !currentVideoId) return;

    let pollInterval: NodeJS.Timeout | null = null;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) {
        pollInterval = setTimeout(initPlayer, 100);
        return;
      }

      if (playerRef.current) {
        if (typeof playerRef.current.loadVideoById === "function") {
          try {
            playerRef.current.loadVideoById({
              videoId: currentVideoId,
              startSeconds: 0,
            });
            if (isMuted) {
              playerRef.current.mute?.();
            } else {
              playerRef.current.unMute?.();
              playerRef.current.setVolume?.(volume);
            }
            playerRef.current.playVideo?.();
            setIsPlaying(true);
            return;
          } catch (err) {
            console.warn("Failed to switch video:", err);
          }
        } else {
          // Player instance sudah ada tapi YouTube API belum selesai inisialisasi (belum onReady)
          pollInterval = setTimeout(initPlayer, 100);
          return;
        }
      }

      if (!iframeContainerRef.current) return;

      // Create new player with autoplay=1 & mute=1
      playerRef.current = new window.YT.Player(iframeContainerRef.current, {
        videoId: currentVideoId,
        playerVars: {
          autoplay: 1, // Autoplay aktif
          mute: 1, // Muted tanpa suara agar autoplay berjalan di browser
          controls: 0, // HIDE YOUTUBE CONTROLS
          disablekb: 1, // Disable keyboard shortcuts
          fs: 0, // Disable native full screen
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            try {
              const dur = event.target.getDuration();
              setDuration(dur || 0);
              event.target.mute(); // Mute saat awal agar autoplay lolos
              setIsMuted(true);
              event.target.playVideo();
              setIsPlaying(true);
            } catch { }
          },
          onStateChange: (event: any) => {
            try {
              if (event.data === 1) {
                setIsPlaying(true);
                setDuration(event.target.getDuration() || 0);
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 0) {
                setIsPlaying(false);
                handleNextVideo();
              }
            } catch { }
          },
        },
      });
    };

    initPlayer();

    return () => {
      if (pollInterval) clearTimeout(pollInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideoId]);

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

  // Controls auto-hide on inactivity
  const handleInteraction = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3500);
    }
  };

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
    try {
      if (typeof playerRef.current.seekTo === "function") {
        playerRef.current.seekTo(targetTime, true);
      }
    } catch { }
    setCurrentTime(targetTime);
  };

  const handleSelectVideo = (targetIndex: number) => {
    setCurrentIndex(targetIndex);
  };

  const handleNextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
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

  return (
    <div
      className={cn(
        "relative w-full rounded-2xl sm:rounded-3xl border border-border/80 bg-card shadow-xl overflow-hidden select-none",
        className
      )}
    >
      <div
        ref={containerRef}
        onMouseMove={handleInteraction}
        onTouchStart={handleInteraction}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className="flex flex-col lg:flex-row h-full rounded-2xl sm:rounded-3xl overflow-hidden relative"
      >
        {/* Left Side: Video Player Area */}
        <div className="relative flex-1 bg-black flex flex-col justify-center min-h-[240px] sm:min-h-[380px] md:min-h-[460px] lg:min-h-[580px] aspect-video lg:aspect-auto overflow-hidden group transition-[flex] duration-300">
          {/* YouTube Embed: Cover vs Fit mode */}
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none flex items-center justify-center">
            <div
              className={cn(
                "relative transition-all duration-300 flex items-center justify-center [&_iframe]:!w-full [&_iframe]:!h-full [&_iframe]:!absolute [&_iframe]:!inset-0",
                isCover
                  ? "min-w-full min-h-full aspect-video scale-[1.04] origin-center shrink-0"
                  : "w-full h-full max-w-full max-h-full aspect-video origin-center"
              )}
            >
              <div
                ref={iframeContainerRef}
                className="w-full h-full relative"
              />
            </div>
          </div>

          {/* Click layer on top of YouTube to play/pause with custom controls */}
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
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md text-white border border-white/30 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200"
              >
                <Play className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ml-1 fill-white text-white drop-shadow" />
              </button>
            </div>
          )}

          {/* Floating Top Right: Playlist Toggle & Next Buttons */}
          <div
            className={cn(
              "absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-30 flex items-center gap-1.5 sm:gap-2 transition-opacity duration-300",
              showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowPlaylist(!showPlaylist);
              }}
              className={cn(
                "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border backdrop-blur-md text-white transition-all shadow-md active:scale-95",
                showPlaylist
                  ? "bg-primary/90 hover:bg-primary border-primary/40 text-primary-foreground"
                  : "bg-black/60 hover:bg-black/85 border-white/20"
              )}
              title={showPlaylist ? "Sembunyikan Playlist" : "Tampilkan Playlist"}
              aria-label={showPlaylist ? "Sembunyikan Playlist" : "Tampilkan Playlist"}
            >
              {showPlaylist ? (
                <PanelRightClose className="w-4 h-4" />
              ) : (
                <PanelRightOpen className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Custom Frontend Controls Bar */}
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 z-30 p-2.5 sm:p-4 pt-8 sm:pt-10 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col gap-2 transition-opacity duration-300",
              showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
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

            {/* Controls Buttons, Volume Slider & Time */}
            <div className="flex items-center justify-between text-white text-xs pt-0.5">
              <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap">
                {/* Play / Pause */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 active:scale-90 transition-all"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                </button>

                {/* Next Video */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextVideo();
                  }}
                  className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 active:scale-90 transition-all"
                  aria-label="Next video"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>

                {/* Volume Control with Interactive Slider */}
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
                    className="p-0.5 text-white/90 hover:text-white transition-colors active:scale-90"
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

                  {/* Volume Slider Track with Visual Volume Lines / Ticks */}
                  <div className="relative flex items-center h-4 w-16 sm:w-20 md:w-24 px-1 group/track">

                    {/* Visual Volume Lines (Equalizer-style ascending level bars) */}
                    <div className="relative w-full flex items-end justify-between h-3 pointer-events-none z-0">
                      {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((step, idx) => {
                        const isActive = currentVol >= step;
                        const barHeight = 5 + idx * 0.7; // Bertingkat dari 5px ke ~11.3px
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

                    {/* Interactive Range Input Overlay */}
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

                {/* Cover / Fit Mode Toggle Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCover((prev) => !prev);
                  }}
                  className={cn(
                    "p-1.5 sm:p-2 rounded-full backdrop-blur-sm border active:scale-90 transition-all",
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
                  className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 active:scale-90 transition-all text-white"
                  aria-label="Fullscreen"
                  title="Layar Penuh"
                >
                  <Maximize className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Responsive Animated Playlist Panel */}
        <AnimatePresence initial={false}>
          {showPlaylist && (
            <motion.div
              key="playlist-sidebar"
              initial={
                isDesktop
                  ? { width: 0, opacity: 0 }
                  : { height: 0, opacity: 0 }
              }
              animate={
                isDesktop
                  ? { width: 380, opacity: 1 }
                  : { height: "auto", opacity: 1 }
              }
              exit={
                isDesktop
                  ? { width: 0, opacity: 0 }
                  : { height: 0, opacity: 0 }
              }
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 28,
                mass: 0.8,
              }}
              className="w-full lg:w-[380px] flex flex-col border-t lg:border-t-0 lg:border-l border-border bg-card/95 backdrop-blur-md overflow-hidden shrink-0 shadow-lg"
            >
              {/* Inner wrapper dengan fixed width di desktop agar konten tidak terdistorsi saat sliding */}
              <div className="w-full flex flex-col h-full min-w-0">
                {/* Header Playlist */}
                <div className="p-3 sm:p-4 border-b border-border/80 flex items-center justify-between shrink-0 bg-card/50">
                  <div className="flex items-center gap-2">
                    <ListVideo className="w-4 h-4 text-primary" />
                    <h3 className="text-xs sm:text-sm font-semibold text-foreground">
                      Daftar Putar Video
                    </h3>
                    <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono border border-primary/20 font-medium">
                      {filteredItems.length}
                    </span>
                  </div>
                </div>

                {/* Filter Kategori & Search */}
                <div className="p-3 sm:p-3.5 border-b border-border/70 flex flex-col gap-2.5 bg-muted/20 shrink-0">
                  {/* Category Header */}
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground px-0.5">
                    <span className="flex items-center gap-1 font-medium text-foreground/80">
                      <Filter className="w-3 h-3 text-primary" /> Kategori Video:
                    </span>
                    {selectedCategory !== "Semua" && (
                      <button
                        onClick={() => setSelectedCategory("Semua")}
                        className="text-[10px] text-primary hover:underline font-medium"
                      >
                        Reset Filter
                      </button>
                    )}
                  </div>

                  {/* Kategori Pills - Wrapping ke bawah tanpa slide */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {categories.map((cat) => {
                      const isSelected = selectedCategory === cat;
                      const count =
                        cat === "Semua"
                          ? items.length
                          : items.filter((it) => it.category === cat).length;

                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={cn(
                            "px-2.5 py-1 sm:py-1.5 rounded-full text-[11px] transition-all flex items-center gap-1.5 border active:scale-95",
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary font-medium shadow-sm"
                              : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground border-border/80"
                          )}
                        >
                          <span>{cat}</span>
                          <span
                            className={cn(
                              "text-[9px] px-1.5 py-0.2 rounded-full font-mono",
                              isSelected
                                ? "bg-primary-foreground/20 text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick Search Input */}
                  <div className="relative pt-0.5">
                    <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Cari video..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs pl-8 pr-7 py-1.5 rounded-lg bg-background border border-border/80 placeholder:text-muted-foreground/60 text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground"
                        aria-label="Hapus pencarian"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Scrollable Items List */}
                <div className="flex-1 overflow-y-auto divide-y divide-border/60 max-h-[280px] sm:max-h-[360px] lg:max-h-[460px] p-2 space-y-1 scrollbar-thin">
                  {filteredItems.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground text-xs flex flex-col items-center justify-center gap-2">
                      <ListVideo className="w-7 h-7 text-muted-foreground/50" />
                      <p>Tidak ada video dalam filter ini.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory("Semua");
                          setSearchQuery("");
                        }}
                        className="px-3 py-1 rounded-full text-[11px] bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors"
                      >
                        Tampilkan Semua Video
                      </button>
                    </div>
                  ) : (
                    filteredItems.map((item) => {
                      // Temukan index asli video di array `items`
                      const originalIndex = items.findIndex((it) => it.id === item.id);
                      const isActive = originalIndex === currentIndex;

                      return (
                        <motion.div
                          key={item.id}
                          layout
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectVideo(originalIndex)}
                          className={cn(
                            "group flex gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl cursor-pointer transition-all border",
                            isActive
                              ? "bg-primary/10 border-primary/25 text-foreground shadow-sm"
                              : "border-transparent hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {/* Thumbnail */}
                          <div className="relative w-20 h-14 sm:w-24 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden shrink-0 border border-border/60 bg-muted">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {isActive && (
                              <div className="absolute inset-0 bg-primary/25 flex items-center justify-center">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                                  <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current ml-0.5" />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Metadata & Description */}
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4
                              className={cn(
                                "text-xs font-semibold line-clamp-2 leading-snug",
                                isActive ? "text-primary font-bold" : "text-foreground"
                              )}
                            >
                              {originalIndex + 1}. {item.title}
                            </h4>
                            <p className="text-[10px] sm:text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default VideoPlaylist;

