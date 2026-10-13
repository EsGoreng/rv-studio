import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoPlaylist } from "@/components/ui/video-playlist";
import { SAMPLE_PLAYLIST, PlaylistItem } from "@/constants/video-playlist";
import { resolveImageUrl } from "@/sanity/lib/image";
import { DitheredHeader } from "../ui/dithered-grid";

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


      {/* Page Header with Dithered Grid */}
      <DitheredHeader gradientHeight="120%"
        fade="bottom"
        accent="#d4d4d8"
        className="py-8 sm:py-12 px-4 rounded-3xl border border-white/10 bg-neutral-950/90 backdrop-blur-sm text-center flex flex-col items-center text-center mb-10 sm:mb-14"
      >
        <div className="space-y-3 max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground">
            {description}
          </p>
        </div>
      </DitheredHeader>

      <VideoPlaylist
        items={items}
        hideOnStart={hideOnStart}
        nextOverlay={true}
        nextCountdownThreshold={6}
      />

      <div className="mt-8 sm:mt-10 flex justify-center">
        <Button asChild size="lg" className="group rounded-full px-6 font-medium shadow-sm transition-all hover:shadow-md">
          <Link href="/videography">
            Lihat Semua Video
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

export default VideoShowcaseSection;
