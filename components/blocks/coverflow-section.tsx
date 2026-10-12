"use client";

import * as React from "react";
import { BookOpen, RefreshCw, AlertCircle } from "lucide-react";
import { CoverflowCarousel, CoverflowSlide } from "@/components/ui/coverflow-carousel";
import { Book } from "@/components/ui/book";
import { COVERFLOW_SLIDES } from "@/constants/coverflow";
import { resolveImageUrl } from "@/sanity/lib/image";

export interface CoverflowSectionProps {
  title?: string;
  description?: string;
  slides?: CoverflowSlide[];
  data?: {
    title?: string;
    description?: string;
    slides?: Array<{
      _key?: string;
      title?: string;
      subtitle?: string;
      color?: string;
      image?: any;
      externalSrc?: string;
      alt?: string;
      meta?: Array<{
        _key?: string;
        label?: string;
        value?: string;
      }>;
    }>;
  } | null;
}

// Fallback grid component displayed if the 3D WebGL/carousel fails or has empty slides
function CoverflowFallbackGrid({
  slides,
  onRetry,
}: {
  slides: CoverflowSlide[];
  onRetry?: () => void;
}) {
  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border/80 text-xs text-muted-foreground mb-8">
        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
        <span>Mode tampilan statis aktif</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-2 font-medium text-foreground hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Coba Ulang
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 w-full max-w-5xl px-4">
        {slides.slice(0, 4).map((slide, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="w-full aspect-[49/60]">
              <Book
                color={slide.color || "#1e293b"}
                depth={5}
                illustration={
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-muted/40 text-center">
                    <BookOpen className="w-6 h-6 text-white/80 mb-2" />
                    <span className="text-xs font-medium text-white/90 line-clamp-1">
                      {slide.title}
                    </span>
                  </div>
                }
              >
                <div className="p-2 text-left">
                  <p className="text-[10px] font-semibold text-white/90 truncate">
                    {slide.title}
                  </p>
                  <p className="text-[9px] text-white/60 truncate">
                    {slide.subtitle}
                  </p>
                </div>
              </Book>
            </div>
            <div className="mt-3 text-center">
              <h4 className="text-xs font-semibold text-foreground truncate max-w-[160px]">
                {slide.title}
              </h4>
              <p className="text-[11px] text-muted-foreground">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Error Boundary to catch unexpected rendering crashes in carousel children
interface ErrorBoundaryState {
  hasError: boolean;
}

class CarouselErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("CoverflowCarousel Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function CoverflowSection({
  title: propTitle,
  description: propDescription,
  slides: propSlides,
  data,
}: CoverflowSectionProps) {
  const [retryKey, setRetryKey] = React.useState(0);

  const title = data?.title ?? propTitle ?? "Yearbook";
  const description =
    data?.description ??
    propDescription ??
    "Yearbook yang dirancang untuk mengabadikan cerita dan perjalananmu.";

  const slides: CoverflowSlide[] = React.useMemo(() => {
    if (propSlides && propSlides.length > 0) return propSlides;

    if (data?.slides && data.slides.length > 0) {
      return data.slides.map((slide, index) => {
        const fallback = COVERFLOW_SLIDES[index % COVERFLOW_SLIDES.length];
        const src = resolveImageUrl(
          slide.image,
          slide.externalSrc || fallback?.src
        );

        const dimensions = slide.image?.asset?.metadata?.dimensions;

        return {
          src,
          alt: slide.alt || slide.title || fallback?.alt || "Yearbook Slide",
          title: slide.title || fallback?.title || "Yearbook",
          subtitle: slide.subtitle || fallback?.subtitle || "",
          color: slide.color || fallback?.color || "#14532d",
          aspectRatio: dimensions?.aspectRatio,
          width: dimensions?.width,
          height: dimensions?.height,
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

    return COVERFLOW_SLIDES;
  }, [data?.slides, propSlides]);

  const hasValidSlides = Array.isArray(slides) && slides.length > 0;

  return (
    <section id="yearbook" className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden scroll-mt-12">
      <div className="flex flex-col items-center text-center mb-6 sm:mb-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground">
          {description}
        </p>
      </div>

      {!hasValidSlides ? (
        <CoverflowFallbackGrid slides={[]} />
      ) : (
        <CarouselErrorBoundary
          key={retryKey}
          fallback={
            <CoverflowFallbackGrid
              slides={slides}
              onRetry={() => setRetryKey((k) => k + 1)}
            />
          }
        >
          <CoverflowCarousel
            slides={slides}
            showCaption={true}
            showPagination={true}
            showNavigation={true}
            cardWidth="clamp(180px, 24vw, 290px)"
            sideFade={12}
            className="py-4"
          />
        </CarouselErrorBoundary>
      )}
    </section>
  );
}

export default CoverflowSection;
