import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfinitePerspectiveSlider } from "@/components/ui/infinite-perspective-slider";
import { GALLERY_ITEMS, type GalleryItem } from "@/constants/gallery";
import { resolveImageUrl } from "@/sanity/lib/image";
import { DitheredHeader } from "../ui/dithered-grid";

export interface ShowcaseGallerySectionProps {
  title?: string;
  description?: string;
  items?: GalleryItem[];
  data?: {
    items?: Array<{
      _key?: string;
      title?: string;
      category?: string;
      image?: any;
      externalSrc?: string;
      alt?: string;
    }>;
  } | null;
}

export function ShowcaseGallerySection({
  title: propTitle,
  description: propDescription,
  items: propItems,
  data,
}: ShowcaseGallerySectionProps) {
  const title = propTitle ?? "Showcase Gallery";
  const description =
    propDescription ??
    "Sorotan visual interaktif dan dokumentasi terpilih kami.";

  const items: GalleryItem[] = useMemo(() => {
    if (propItems && propItems.length > 0) return propItems;

    if (data?.items && data.items.length > 0) {
      return data.items.map((item, index) => {
        const fallback = GALLERY_ITEMS[index % GALLERY_ITEMS.length];
        const src = resolveImageUrl(
          item.image,
          item.externalSrc || fallback?.src
        );

        return {
          src,
          alt: item.alt || item.title || fallback?.alt || "Showcase image",
          title: item.title || fallback?.title || `Showcase ${index + 1}`,
          category: item.category || fallback?.category || "Photography",
        };
      });
    }

    return GALLERY_ITEMS;
  }, [data?.items, propItems]);

  const sliderImages = useMemo(() => {
    return items.map((item, index) => ({
      number: String(index + 1).padStart(2, "0"),
      src: item.src,
      title: item.title || item.category || `Showcase ${index + 1}`,
      desc: item.category || item.alt || "Photography",
    }));
  }, [items]);

  return (
    <section
      id="showcase-gallery"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 scroll-mt-12 overflow-hidden"
    >
      <DitheredHeader
        gradientHeight="120%"
        fade="bottom"
        accent="#d4d4d8"
        className="flex flex-col items-center text-center py-8 sm:py-12 px-4 rounded-3xl border border-white/10 bg-neutral-950/90 backdrop-blur-sm mb-4 sm:mb-6"
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

      <InfinitePerspectiveSlider
        images={sliderImages}
        cardWidth={320}
        cardGap={24}
        perspective={2200}
        sideFade={true}
        scrollSpeed={1}
        scrollLerp={0.1}
        maxRotation={80}
      />

      <div className="mt-4 sm:mt-6 flex justify-center">
        <Button asChild size="lg" className="group rounded-full px-6 font-medium shadow-sm transition-all hover:shadow-md">
          <Link href="/photography">
            Lihat Semua Foto
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

export default ShowcaseGallerySection;
