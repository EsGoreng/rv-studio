"use client";

import * as React from "react";
import { BookOpen, Lock, Eye, EyeOff, AlertCircle, X } from "lucide-react";
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
  password?: string;
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
        const themeMeta = slide.meta?.find(
          (m) =>
            m.label?.toLowerCase() === "theme" ||
            m.label?.toLowerCase() === "tema" ||
            m.label?.toLowerCase() === "konsep"
        )?.value;

        return {
          id: slide._key || `yearbook-${index + 1}`,
          title: slide.title || `Yearbook ${index + 1}`,
          subtitle: slide.subtitle || "",
          institution: slide.subtitle || "",
          year: yearMeta || undefined,
          theme: themeMeta || undefined,
          description: slide.description || "",
          src,
          alt: slide.alt || slide.title || "Yearbook Slide",
          color: slide.color || "#14532d",
          pdfUrl: slide.pdfUrl || "",
          password: slide.password || undefined,
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
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);
  const [passwordInput, setPasswordInput] = React.useState("");
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  // Active selected yearbook
  const activeYearbook = yearbooks[activeIndex] || yearbooks[0] || null;

  // Handle ESC key for password modal
  React.useEffect(() => {
    if (!isPasswordModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPasswordModalOpen(false);
        setPasswordError(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPasswordModalOpen]);

  // Open preview check: verify if password is required
  const handleOpenPreview = React.useCallback(() => {
    if (!activeYearbook) return;

    // Check if yearbook has password from Sanity
    if (activeYearbook.password && activeYearbook.password.trim() !== "") {
      setPasswordInput("");
      setPasswordError(null);
      setShowPassword(false);
      setIsPasswordModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  }, [activeYearbook]);

  // Verify entered password
  const handleVerifyPassword = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeYearbook) return;

    if (!activeYearbook.password || activeYearbook.password.trim() === "") {
      setIsPasswordModalOpen(false);
      setIsModalOpen(true);
      return;
    }

    if (passwordInput === activeYearbook.password) {
      setPasswordError(null);
      setIsPasswordModalOpen(false);
      setPasswordInput("");
      setIsModalOpen(true);
    } else {
      setPasswordError("Password salah. Silakan coba lagi.");
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
              Yearbook
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
                onSlideClick={handleOpenPreview}
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
                      onClick={handleOpenPreview}
                      size="lg"
                      className="flex-1 sm:flex-none group rounded-xl px-5 font-medium bg-white text-black hover:bg-neutral-200 shadow-lg shadow-white/5 transition-all"
                    >
                      {activeYearbook.password ? (
                        <Lock className="mr-2 h-4 w-4 text-black group-hover:scale-110 transition-transform" />
                      ) : (
                        <BookOpen className="mr-2 h-4 w-4 text-black group-hover:scale-110 transition-transform" />
                      )}
                      Preview
                    </Button>
                  </div>
                </div>

                {/* Description */}
                {activeYearbook.description?.trim() ? (
                  <p className="mt-4 text-xs sm:text-sm text-neutral-300/90 leading-relaxed">
                    {activeYearbook.description}
                  </p>
                ) : null}

                {/* Specification Grid */}
                {activeYearbook.meta && activeYearbook.meta.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                    {activeYearbook.meta.map((item) => (
                      <div key={item.label} className="space-y-0.5">
                        <span className="text-[10px] sm:text-xs text-neutral-400 block tracking-wider font-medium">
                          {item.label}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-white block truncate">
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
                  Belum Ada Yearbook
                </h3>
                <p className="text-sm text-neutral-400 max-w-md mx-auto">
                  Silakan kelola slide dan unggah file PDF buku kenangan melalui Sanity Studio di menu Yearbook.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Password Verification Modal */}
      {isPasswordModalOpen && activeYearbook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md rounded-3xl bg-neutral-950/95 border border-white/15 p-6 sm:p-7 shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setIsPasswordModalOpen(false);
                setPasswordError(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors border border-white/10"
              aria-label="Tutup Verifikasi Password"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Icon & Title */}
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0 shadow-inner">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1 pr-6">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Akses Terkunci
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Buku kenangan <span className="font-semibold text-neutral-200">{activeYearbook.title}</span> dilindungi kata sandi. Masukkan password untuk membuka preview.
                </p>
              </div>
            </div>

            {/* Password Form */}
            <form onSubmit={handleVerifyPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300 block">
                  Password Akses
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (passwordError) setPasswordError(null);
                    }}
                    placeholder="Masukkan password buku kenangan..."
                    autoFocus
                    className={`w-full px-4 py-3 pr-11 rounded-xl bg-neutral-900/90 text-white placeholder-neutral-500 text-sm outline-none transition-all border ${
                      passwordError
                        ? "border-red-500/80 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-white/15 focus:border-white/40 focus:ring-2 focus:ring-white/15"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-white transition-colors rounded-lg"
                    tabIndex={-1}
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Error validation message */}
                {passwordError && (
                  <div className="flex items-center gap-1.5 text-xs text-red-400 pt-1 animate-in fade-in duration-150">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                    <span>{passwordError}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordError(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-neutral-300 border border-white/10 transition-colors"
                >
                  Batal
                </button>
                <Button
                  type="submit"
                  size="default"
                  className="rounded-xl px-5 text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-all shadow-md"
                >
                  Buka Preview
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

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
