import { ProjectFilterGallery } from "@/components/ui/project-filter-gallery";
import { GALLERY_ITEMS } from "@/constants/gallery";

interface GallerySectionProps {
  title?: string;
  description?: string;
}

export function GallerySection({
  title = "Project Gallery",
  description = "Eksplorasi portfolio karya dokumentasi visual, portraiture kreatif, dan produksi tahunan kami berdasarkan kategori.",
}: GallerySectionProps) {
  return (
    <section id="gallery" className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 scroll-mt-12">
      <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground">
          {description}
        </p>
      </div>

      <ProjectFilterGallery
        items={GALLERY_ITEMS}
        defaultValue="All"
        aspect="5 / 4"
        gap={12}
        className="w-full"
      />
    </section>
  );
}

export default GallerySection;
