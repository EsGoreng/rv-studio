import { useMemo } from "react";
import { VideoPlaylist } from "@/components/ui/video-playlist";
import { SAMPLE_PLAYLIST, PlaylistItem } from "@/constants/video-playlist";
import { resolveImageUrl } from "@/sanity/lib/image";

export interface VideoShowcaseSectionProps {
  title?: string;
  description?: string;
  hideOnStart?: boolean;
  items?: PlaylistItem[];
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
}

export function VideoShowcaseSection({
  title: propTitle,
  description: propDescription,
  hideOnStart = true,
  items: propItems,
  data,
}: VideoShowcaseSectionProps) {
  const title =
    data?.title ?? propTitle ?? "Videography";
  const description =
    data?.description ??
    propDescription ??
    "Layanan produksi visual dan dokumentasi untuk berbagai kebutuhan.";

  const items: PlaylistItem[] = useMemo(() => {
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
            description:
              item.description || fallback?.description || "",
            duration: item.duration || "YouTube",
            thumbnail: thumb,
            videoSrc: item.videoSrc || fallback?.videoSrc || "",
            category: item.category || fallback?.category,
          };
        });
    }

    return SAMPLE_PLAYLIST;
  }, [data?.items, propItems]);

  return (
    <section id="videography" className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 scroll-mt-12">
      <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground">
          {description}
        </p>
      </div>

      <VideoPlaylist
        items={items}
        hideOnStart={hideOnStart}
        nextOverlay={true}
        nextCountdownThreshold={6}
      />
    </section>
  );
}

export default VideoShowcaseSection;
