import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfinitePerspectiveSlider } from "@/components/ui/infinite-perspective-slider";
import { GALLERY_ITEMS } from "@/constants/gallery";
import { resolveImageUrl } from "@/sanity/lib/image";
import type { GalleryItem } from "@/components/ui/project-filter-gallery";

export interface ShowcaseGallerySectionProps {
  title?: string;
  description?: string;
  items?: GalleryItem[];
  data?: {
    title?: string;
    description?: string;
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
  const title = data?.title ?? propTitle ?? "Showcase Gallery";
  const description =
    data?.description ??
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
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 scroll-mt-12 overflow-hidden"
    >
      <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground">
          {description}
        </p>
      </div>

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

      <div className="mt-8 sm:mt-10 flex justify-center">
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
