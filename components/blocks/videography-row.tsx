"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { SAMPLE_PLAYLIST, PlaylistItem } from "@/constants/video-playlist";
import { resolveImageUrl } from "@/sanity/lib/image";

export interface VideographyRowProps {
  title: string;
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
  items?: PlaylistItem[];
  onSelectVideo?: (item: PlaylistItem) => void;
  selectedVideoId?: string;
  badgeLabel?: string;
}

export function VideographyRow({
  title,
  data,
  items: propItems,
  onSelectVideo,
  selectedVideoId,
  badgeLabel,
}: VideographyRowProps) {
  const items: PlaylistItem[] = React.useMemo(() => {
    if (propItems && propItems.length > 0) return propItems;
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
  }, [data?.items, propItems]);

  const rowRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScroll = () => {
    const el = rowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  React.useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [items.length]);

  const scroll = (dir: "left" | "right") => {
    const el = rowRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <section className="relative w-full group/section">
      {/* Row Title */}
      <div className="flex items-center justify-between mb-2.5 sm:mb-3">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
          {title}
        </h2>
      </div>

      {/* Scrollable Container with Arrows */}
      <div className="relative group/row">
        {/* Left Arrow Button (Desktop) */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll("left")}
            className="hidden sm:flex absolute -left-4 sm:-left-6 lg:-left-8 top-3 bottom-3 z-20 w-8 md:w-10 items-center justify-center bg-black/75 hover:bg-black/95 text-white backdrop-blur-xs transition-all opacity-0 group-hover/row:opacity-100 rounded-r-md cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 drop-shadow" />
          </button>
        )}

        {/* Right Arrow Button (Desktop) */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll("right")}
            className="hidden sm:flex absolute -right-4 sm:-right-6 lg:-right-8 top-3 bottom-3 z-20 w-8 md:w-10 items-center justify-center bg-black/75 hover:bg-black/95 text-white backdrop-blur-xs transition-all opacity-0 group-hover/row:opacity-100 rounded-l-md cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 drop-shadow" />
          </button>
        )}

        {/* Horizontal Cards Scroll Track */}
        <div
          ref={rowRef}
          className="flex gap-2.5 sm:gap-3 md:gap-4 overflow-x-auto scrollbar-none scroll-smooth -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-3 snap-x snap-mandatory"
        >
          {items.map((item, idx) => (
            <VideoCard
              key={item.id}
              item={item}
              index={idx}
              badgeLabel={badgeLabel}
              isSelected={selectedVideoId === item.id}
              onClick={() => onSelectVideo?.(item)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Individual Video Card with Clean Scale-on-Hover ────────────── */
function VideoCard({
  item,
  index,
  badgeLabel,
  isSelected,
  onClick,
}: {
  item: PlaylistItem;
  index: number;
  badgeLabel?: string;
  isSelected?: boolean;
  onClick?: () => void;
}) {
  const showBadge = index % 2 === 0;

  return (
    <div
      style={{ scrollSnapAlign: "start" }}
      onClick={onClick}
      className={cn(
        "relative flex-none w-[150px] xs:w-[180px] sm:w-[220px] md:w-[260px] lg:w-[285px] rounded-md group/card cursor-pointer select-none transition-transform duration-300 ease-out hover:scale-105 hover:z-20 active:scale-95 origin-center"
      )}
    >
      {/* Thumbnail Container */}
      <div
        className={cn(
          "relative aspect-video rounded-md overflow-hidden bg-neutral-900 border transition-all duration-300 shadow-md group-hover/card:shadow-xl",
          isSelected
            ? "border-white ring-2 ring-white/90 shadow-white/10"
            : "border-neutral-800 group-hover/card:border-neutral-500"
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
          loading={index > 4 ? "lazy" : "eager"}
        />

        {/* Play Icon Hint on Hover */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 text-black flex items-center justify-center shadow-lg transition-transform group-hover/card:scale-110">
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-black ml-0.5" />
          </div>
        </div>

        {/* Badge Label (Optional) */}
        {showBadge && badgeLabel && (
          <div className="absolute bottom-1.5 left-1.5 z-10 bg-[#E50914] text-white text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-[2px] shadow-md">
            {badgeLabel}
          </div>
        )}

        {/* Duration Chip on Top-Right (hanya tampil jika bukan YouTube) */}
        {item.duration && item.duration.toLowerCase() !== "youtube" && (
          <div className="absolute top-1.5 right-1.5 z-10 bg-black/70 backdrop-blur-xs text-neutral-300 text-[9px] font-mono px-1.5 py-0.5 rounded">
            {item.duration}
          </div>
        )}
      </div>

      {/* Video Title */}
      <div className="mt-1.5 sm:mt-2 px-0.5">
        <h4
          className={cn(
            "text-xs sm:text-sm font-semibold line-clamp-1 leading-tight transition-colors",
            isSelected ? "text-white font-bold" : "text-neutral-200 group-hover/card:text-white"
          )}
        >
          {item.title}
        </h4>
      </div>
    </div>
  );
}

export default VideographyRow;
