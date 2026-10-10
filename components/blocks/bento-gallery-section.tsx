"use client";

import InteractiveImageBentoGallery from "@/components/ui/bento-gallery";
import { BENTO_GALLERY_ITEMS } from "@/constants/bento-gallery";

interface BentoGallerySectionProps {
  title?: string;
  description?: string;
}

export function BentoGallerySection({
  title = "Curated Bento Moments",
  description = "Koleksi sorotan visual terbaik kami. Geser (drag) ke samping untuk menjelajah, dan klik pada gambar untuk tampilan resolusi penuh.",
}: BentoGallerySectionProps) {
  return (
    <InteractiveImageBentoGallery
      imageItems={BENTO_GALLERY_ITEMS}
      title={title}
      description={description}
    />
  );
}

export default BentoGallerySection;
