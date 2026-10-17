"use client";

import * as React from "react";
import { VideographyHero } from "@/components/blocks/videography-hero";
import { VideographyRow } from "@/components/blocks/videography-row";
import { PlaylistItem, SAMPLE_PLAYLIST } from "@/constants/video-playlist";
import { resolveImageUrl } from "@/sanity/lib/image";
import { DitheredHeader } from "@/components/ui/dithered-grid";

export interface VideographyClientProps {
  data?: {
    videoShowcase?: {
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
  } | null;
}

export function VideographyClient({ data }: VideographyClientProps) {
  const [selectedHeroVideo, setSelectedHeroVideo] = React.useState<PlaylistItem | null>(null);

  // Normalize all playlist items
  const allItems: PlaylistItem[] = React.useMemo(() => {
    const rawItems = data?.videoShowcase?.items;
    if (rawItems && rawItems.length > 0) {
      return rawItems
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
            description: item.description || "",
            thumbnail: thumb,
            videoSrc: item.videoSrc || fallback?.videoSrc || "",
            category: item.category || fallback?.category || "Produksi",
          };
        });
    }
    return SAMPLE_PLAYLIST;
  }, [data?.videoShowcase?.items]);

  // Currently active video in Hero section
  const activeHeroVideo = selectedHeroVideo || allItems[0];

  const handleSelectHeroVideo = (item: PlaylistItem) => {
    setSelectedHeroVideo(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Group items by category and sort descending by video count (most videos first)
  const categoryGroups = React.useMemo(() => {
    const map = new Map<string, PlaylistItem[]>();

    allItems.forEach((item) => {
      const cat = item.category?.trim() || "Lainnya";
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat)!.push(item);
    });

    return Array.from(map.entries())
      .map(([category, items]) => ({
        category,
        items,
      }))
      .sort((a, b) => b.items.length - a.items.length);
  }, [allItems]);

  const title = "Videograph";

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-[#E50914] selection:text-white pt-6 sm:pt-10 pb-8 sm:pb-16">
      {/* Container constrained to max-w-7xl, matching app/(main)/page.tsx */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-8 space-y-6 sm:space-y-10">
        {/* Page Header with Dithered Grid */}
        <DitheredHeader gradientHeight="120%"
          fade="bottom"
          accent="#d4d4d8"
          className="py-8 sm:py-12 px-4 rounded-3xl border border-white/10 bg-neutral-950/90 backdrop-blur-sm text-center"
        >
          <div className="space-y-3 max-w-3xl mx-auto flex flex-col items-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              {title}
            </h1>
          </div>
        </DitheredHeader>

        {/* Featured Hero */}
        <VideographyHero
          data={data?.videoShowcase}
          activeVideo={activeHeroVideo}
        />

        {/* Main Content Area - Category Rows */}
        <div className="relative z-20 space-y-8 sm:space-y-12">
          {categoryGroups.map((group) => (
            <VideographyRow
              key={group.category}
              title={group.category}
              items={group.items}
              selectedVideoId={activeHeroVideo?.id}
              onSelectVideo={handleSelectHeroVideo}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default VideographyClient;
