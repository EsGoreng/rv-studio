"use client";

import { useMemo } from "react";
import InteractiveImageBentoGallery, { ImageItem } from "@/components/ui/bento-gallery";
import { BENTO_GALLERY_ITEMS } from "@/constants/bento-gallery";
import { resolveImageUrl } from "@/sanity/lib/image";

export interface BentoGallerySectionProps {
  title?: string;
  description?: string;
  items?: ImageItem[];
  data?: {
    title?: string;
    description?: string;
    items?: Array<{
      _key?: string;
      title?: string;
      desc?: string;
      image?: any;
      externalSrc?: string;
      span?: string;
    }>;
  } | null;
}

export function BentoGallerySection({
  title: propTitle,
  description: propDescription,
  items: propItems,
  data,
}: BentoGallerySectionProps) {
  const title = data?.title ?? propTitle ?? "Curated Bento Moments";
  const description =
    data?.description ??
    propDescription ??
    "Koleksi sorotan visual terbaik kami. Geser (drag) ke samping untuk menjelajah, dan klik pada gambar untuk tampilan resolusi penuh.";

  const imageItems: ImageItem[] = useMemo(() => {
    if (propItems && propItems.length > 0) return propItems;

    if (data?.items && data.items.length > 0) {
      return data.items.map((item, index) => {
        const fallback = BENTO_GALLERY_ITEMS[index % BENTO_GALLERY_ITEMS.length];
        const url = resolveImageUrl(
          item.image,
          item.externalSrc || fallback?.url
        );

        return {
          id: index + 1,
          title: item.title || fallback?.title || `Moments ${index + 1}`,
          desc: item.desc || fallback?.desc || "",
          url,
          span: item.span || fallback?.span || "md:row-span-1",
        };
      });
    }

    return BENTO_GALLERY_ITEMS;
  }, [data?.items, propItems]);

  return (
    <InteractiveImageBentoGallery
      imageItems={imageItems}
      title={title}
      description={description}
    />
  );
}

export default BentoGallerySection;
