import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectFilterGallery, GalleryItem } from "@/components/ui/project-filter-gallery";
import { GALLERY_ITEMS } from "@/constants/gallery";
import { resolveImageUrl } from "@/sanity/lib/image";

export interface GallerySectionProps {
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

export function GallerySection({
  title: propTitle,
  description: propDescription,
  items: propItems,
  data,
}: GallerySectionProps) {
  const title = data?.title ?? propTitle ?? "Photography";
  const description =
    data?.description ??
    propDescription ??
    "Layanan fotografi untuk berbagai kebutuhan dan momen.";

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
          alt: item.alt || item.title || fallback?.alt || "Gallery image",
          title: item.title || fallback?.title || "",
          category: item.category || fallback?.category || "Photography",
        };
      });
    }

    return GALLERY_ITEMS;
  }, [data?.items, propItems]);

  return (
    <section
      id="gallery"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 scroll-mt-12"
    >
      <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground">
          {description}
        </p>
      </div>

      <ProjectFilterGallery
        items={items}
        defaultValue="All"
        aspect="5 / 4"
        gap={12}
        className="w-full"
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

export default GallerySection;
