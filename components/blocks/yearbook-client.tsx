"use client";

import * as React from "react";
import {
  BookOpen,
  Sparkles,
  Maximize2,
  Download,
  CheckCircle2,
  ArrowRight,
  Layers,
  ChevronDown,
} from "lucide-react";
import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";
import { DitheredHeader } from "@/components/ui/dithered-grid";
import { Button } from "@/components/ui/button";
import { DearFlipViewer } from "@/components/ui/dearflip-flipbook";
import { YearbookPreviewModal } from "@/components/blocks/yearbook-preview-modal";
import { SAMPLE_YEARBOOKS, YearbookItem } from "@/constants/yearbook";
import { resolveImageUrl } from "@/sanity/lib/image";
import type { YearbookPageSanityData } from "@/sanity/lib/queries";

export interface YearbookClientProps {
  data?: YearbookPageSanityData | null;
}

export function YearbookClient({ data }: YearbookClientProps) {
  // Normalize yearbook items from Sanity or fallback to SAMPLE_YEARBOOKS
  const yearbooks: YearbookItem[] = React.useMemo(() => {
    const rawSlides = data?.coverflow?.slides;
    if (rawSlides && rawSlides.length > 0) {
      return rawSlides.map((slide, index) => {
        const fallback = SAMPLE_YEARBOOKS[index % SAMPLE_YEARBOOKS.length];
        const src = resolveImageUrl(
          slide.image,
          slide.externalSrc || fallback?.src
        );
        const dimensions = slide.image?.asset?.metadata?.dimensions;

        return {
          id: slide._key || fallback?.id || `yearbook-${index + 1}`,
          title: slide.title || fallback?.title || `Yearbook ${index + 1}`,
          subtitle: slide.subtitle || fallback?.subtitle || "",
          institution: fallback?.institution || "Institusi Pendidikan",
          year:
            slide.meta?.find((m) => m.label?.toLowerCase() === "year" || m.label?.toLowerCase() === "tahun")?.value ||
            fallback?.year ||
            "2024",
          theme: fallback?.theme || "Editorial Memories",
          description:
            (slide as unknown as { description?: string })?.description ||
            fallback?.description ||
            "Dokumentasi album kenangan eksklusif karya RV Studio dengan tata letak sinematik dan finishing premium.",
          src,
          alt: slide.alt || slide.title || fallback?.alt || "Yearbook Slide",
          color: slide.color || fallback?.color || "#14532d",
          pdfUrl:
            (slide as unknown as { pdfUrl?: string })?.pdfUrl ||
            fallback?.pdfUrl ||
            "/dflip/books/intro.pdf",
          totalPages:
            parseInt(
              slide.meta?.find((m) => m.label?.toLowerCase() === "pages" || m.label?.toLowerCase() === "halaman")?.value || "150",
              10
            ) || fallback?.totalPages || 150,
          coverFinish: fallback?.coverFinish || "Hardcover Luxury with Matte Lam",
          aspectRatio: dimensions?.aspectRatio || 49 / 60,
          highlights: fallback?.highlights || [
            "Hardcover Binding",
            "150gsm Art Paper",
            "3D Interactive Flipbook",
          ],
          meta:
            slide.meta && slide.meta.length > 0
              ? slide.meta.map((m) => ({
                label: m.label || "",
                value: m.value || "",
              }))
              : fallback?.meta || [],
        };
      });
    }

    return SAMPLE_YEARBOOKS;
  }, [data?.coverflow?.slides]);

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Active selected yearbook
  const activeYearbook = yearbooks[activeIndex] || yearbooks[0];

  const handleScrollToLivePreview = () => {
    const el = document.getElementById("live-flipbook-preview");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: activeYearbook.color }}
                    />
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      {activeYearbook.institution || activeYearbook.year}
                    </span>
                  </div>

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
                    Preview 3D Flipbook
                  </Button>
                </div>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-neutral-300/90 leading-relaxed">
                {activeYearbook.description}
              </p>

              {/* Specification Grid */}
              <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {activeYearbook.meta?.map((item) => (
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
            </div>
          </div>
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
