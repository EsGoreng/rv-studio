"use client";

import * as React from "react";
import { VideographyHero } from "@/components/blocks/videography-hero";
import { VideographyRow } from "@/components/blocks/videography-row";
import { VideoDetailModal } from "@/components/blocks/video-detail-modal";
import { PlaylistItem, SAMPLE_PLAYLIST } from "@/constants/video-playlist";
import { resolveImageUrl } from "@/sanity/lib/image";

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
  const [modalVideo, setModalVideo] = React.useState<PlaylistItem | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
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
            description: item.description || fallback?.description || "",
            duration: item.duration || "YouTube",
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

  // Group items by category (unique categories only, preserving discovery order)
  const categoryGroups = React.useMemo(() => {
    const map = new Map<string, PlaylistItem[]>();

    allItems.forEach((item) => {
      const cat = item.category?.trim() || "Lainnya";
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat)!.push(item);
    });

    return Array.from(map.entries()).map(([category, items]) => ({
      category,
      items,
    }));
  }, [allItems]);

  const handleOpenDetail = (item: PlaylistItem) => {
    setModalVideo(item);
    setIsModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsModalOpen(false);
    setModalVideo(null);
  };

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-[#E50914] selection:text-white pb-32 sm:pb-36">
      {/* Container constrained to max-w-7xl, matching app/(main)/page.tsx */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10">
        {/* Featured Hero */}
        <VideographyHero
          data={data?.videoShowcase}
          activeVideo={activeHeroVideo}
          onOpenDetail={handleOpenDetail}
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

      {/* Video Detail Modal with YouTube Player */}
      <VideoDetailModal
        video={modalVideo}
        isOpen={isModalOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
}

export default VideographyClient;
