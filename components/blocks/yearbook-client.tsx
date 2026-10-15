"use client";

import * as React from "react";
import { BookOpen } from "lucide-react";
import { CoverflowCarousel, type CoverflowSlide } from "@/components/ui/coverflow-carousel";
import { DitheredHeader } from "@/components/ui/dithered-grid";
import { Button } from "@/components/ui/button";
import { YearbookPreviewModal } from "@/components/blocks/yearbook-preview-modal";
import { resolveImageUrl } from "@/sanity/lib/image";
import type { YearbookPageSanityData } from "@/sanity/lib/queries";

export interface YearbookItem extends CoverflowSlide {
  id: string;
  institution?: string;
  year?: string;
  theme?: string;
  description?: string;
  totalPages?: number;
  pdfUrl?: string;
  coverFinish?: string;
  highlights?: string[];
}

export interface YearbookClientProps {
  data?: YearbookPageSanityData | null;
}

export function YearbookClient({ data }: YearbookClientProps) {
  // Normalize yearbook items from Sanity
  const yearbooks: YearbookItem[] = React.useMemo(() => {
    const rawSlides = data?.coverflow?.slides;
    if (rawSlides && rawSlides.length > 0) {
      return rawSlides.map((slide, index) => {
        const src = resolveImageUrl(
          slide.image,
          slide.externalSrc || ""
        );
        const dimensions = slide.image?.asset?.metadata?.dimensions;
        const yearMeta = slide.meta?.find(
          (m) =>
            m.label?.toLowerCase() === "year" ||
            m.label?.toLowerCase() === "tahun"
        )?.value;
        const pagesMeta = slide.meta?.find(
          (m) =>
            m.label?.toLowerCase() === "pages" ||
            m.label?.toLowerCase() === "halaman"
        )?.value;

        return {
          id: slide._key || `yearbook-${index + 1}`,
          title: slide.title || `Yearbook ${index + 1}`,
          subtitle: slide.subtitle || "",
          institution: slide.subtitle || "",
          year: yearMeta || "2024",
          theme: "Yearbook Archive",
          description:
            slide.description ||
            "Dokumentasi album kenangan eksklusif karya RV Studio dengan tata letak sinematik dan finishing premium.",
          src,
          alt: slide.alt || slide.title || "Yearbook Slide",
          color: slide.color || "#14532d",
          pdfUrl: slide.pdfUrl || "",
          totalPages: pagesMeta ? parseInt(pagesMeta, 10) || undefined : undefined,
          aspectRatio: dimensions?.aspectRatio || 49 / 60,
          meta:
            slide.meta && slide.meta.length > 0
              ? slide.meta.map((m) => ({
                  label: m.label || "",
                  value: m.value || "",
                }))
              : [],
        };
      });
    }

    return [];
  }, [data?.coverflow?.slides]);

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Active selected yearbook
  const activeYearbook = yearbooks[activeIndex] || yearbooks[0] || null;

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-[#E50914] selection:text-white pt-6 sm:pt-10 pb-12 sm:pb-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-16">
        {/* 1. Header with Dithered Grid */}
        <DitheredHeader
          gradientHeight="120%"
          fade="bottom"
          accent="#d4d4d8"
          className="flex flex-col items-center text-center py-8 sm:py-14 px-4 rounded-3xl border border-white/10 bg-neutral-950/90 backdrop-blur-sm shadow-2xl"
        >
          <div className="space-y-4 max-w-3xl mx-auto flex flex-col items-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              Yearbook Collection
            </h1>
          </div>
        </DitheredHeader>

        {/* 2. Coverflow Carousel Section */}
        <section className="relative w-full rounded-3xl border border-white/10 bg-neutral-950/60 p-4 sm:p-8 backdrop-blur-sm overflow-hidden">
          {yearbooks.length > 0 && activeYearbook ? (
            <div className="relative z-10 flex flex-col items-center">
              {/* 3D Coverflow Carousel */}
              <CoverflowCarousel
                slides={yearbooks}
                activeIndex={activeIndex}
                onActiveChange={setActiveIndex}
                onSlideClick={() => setIsModalOpen(true)}
                cardWidth="clamp(190px, 24vw, 300px)"
                rotate={42}
                depth={0.65}
                sideFade={10}
                showCaption={false}
                showPagination={true}
                showNavigation={true}
                className="py-2 sm:py-6"
              />

              {/* Active Book Details Card */}
              <div className="mt-8 sm:mt-10 w-full max-w-3xl rounded-2xl border border-white/10 bg-neutral-900/70 p-5 sm:p-7 backdrop-blur-md shadow-xl transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      {activeYearbook.title}
                    </h2>

                    {activeYearbook.subtitle && (
                      <p className="text-sm font-medium text-neutral-300">
                        {activeYearbook.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Primary CTA Buttons */}
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      size="lg"
                      className="flex-1 sm:flex-none group rounded-xl px-5 font-medium bg-white text-black hover:bg-neutral-200 shadow-lg shadow-white/5 transition-all"
                    >
                      <BookOpen className="mr-2 h-4 w-4 text-black group-hover:scale-110 transition-transform" />
                      Preview
                    </Button>
                  </div>
                </div>

                {/* Description */}
                {activeYearbook.description && (
                  <p className="mt-4 text-xs sm:text-sm text-neutral-300/90 leading-relaxed">
                    {activeYearbook.description}
                  </p>
                )}

                {/* Specification Grid */}
                {activeYearbook.meta && activeYearbook.meta.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {activeYearbook.meta.map((item) => (
                      <div key={item.label} className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-[10px] text-neutral-400 block uppercase font-medium">
                          {item.label}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-white mt-0.5 block truncate">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                <BookOpen className="w-8 h-8 text-neutral-400" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold text-white">
                  Belum Ada Koleksi Buku Kenangan
                </h3>
                <p className="text-sm text-neutral-400 max-w-md mx-auto">
                  Silakan kelola slide dan unggah file PDF buku kenangan melalui Sanity Studio di menu Yearbook.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* 3D Flipbook Fullscreen Lightbox Modal */}
      <YearbookPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        yearbook={activeYearbook}
      />
    </div>
  );
}

export default YearbookClient;
