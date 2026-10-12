"use client";

import { useMemo } from "react";
import { TiltedGridHero, TiltedGridImage } from "@/components/ui/tilted-grid-hero";
import { HERO_IMAGES } from "@/constants/hero";
import { resolveImageUrl } from "@/sanity/lib/image";

export interface HeroBlockProps {
  speed?: number;
  title?: string;
  subtitle?: string;
  images?: TiltedGridImage[];
  data?: {
    title?: string;
    subtitle?: string;
    speed?: number;
    images?: Array<{
      alt?: string;
      image?: any;
      externalSrc?: string;
      src?: string;
    }>;
  } | null;
}

export function Hero({
  speed: propSpeed,
  title: propTitle,
  subtitle: propSubtitle,
  images: propImages,
  data,
}: HeroBlockProps) {
  const speed = data?.speed ?? propSpeed ?? 8;
  const title = data?.title ?? propTitle ?? "RV Project.";
  const subtitle =
    data?.subtitle ??
    propSubtitle ??
    "Photography, videography, and yearbook production crafted with high aesthetic fidelity to turn fleeting moments into enduring memories.";

  const images: TiltedGridImage[] = useMemo(() => {
    if (propImages && propImages.length > 0) return propImages;
    if (data?.images && data.images.length > 0) {
      return data.images.map((item, index) => ({
        src: resolveImageUrl(
          item.image,
          item.externalSrc || item.src || HERO_IMAGES[index % HERO_IMAGES.length]?.src
        ),
        alt: item.alt || `Hero image ${index + 1}`,
      }));
    }
    return HERO_IMAGES;
  }, [data?.images, propImages]);

  return (
    <TiltedGridHero
      images={images}
      speed={speed}
      curve={48}
      tilt={0}
      axis={56}
      tileHeight={30}
      aspectRatio={16 / 10}
      fade={12}
      autoPlay={true}
      className="relative min-h-[100svh] h-[100dvh] w-full bg-background overflow-hidden mt-16"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-32 z-0 h-[450px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-primary/5 to-transparent blur-3xl opacity-80"
      />

      <div className="relative flex h-full flex-col items-center justify-start pt-16 sm:pt-20 md:pt-24 text-center px-4 sm:px-6 pointer-events-none">
        <div className="flex flex-col items-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
          {/* Main Title */}
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-7xl/none drop-shadow-xs">
            {title}
            <br />
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-balance text-sm sm:text-base md:text-lg text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </div>
    </TiltedGridHero>
  );
}

export default Hero;
