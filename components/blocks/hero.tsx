"use client";

import { useMemo } from "react";
import Image from "next/image";
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
  const title = (data?.title ?? propTitle ?? "RV Project").replace(/\.+$/, "");
  const subtitle =
    data?.subtitle ??
    propSubtitle ??
    "Mengabadikan momen, menciptakan kenangan.";

  const images: TiltedGridImage[] = useMemo(() => {
    if (propImages && propImages.length > 0) return propImages;
    if (data?.images && data.images.length > 0) {
      return data.images.map((item, index) => ({
        src: resolveImageUrl(
          item.image,
          item.externalSrc || item.src || HERO_IMAGES[index % HERO_IMAGES.length]?.src,
          { width: 640, height: 400, quality: 75 }
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
      curve={50}
      tilt={0}
      axis={64}
      tileHeight={26}
      aspectRatio={16 / 10}
      fade={12}
      autoPlay={true}
      className="relative min-h-[100svh] h-[100dvh] w-full bg-background overflow-hidden"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 sm:-top-32 z-0 h-[350px] sm:h-[450px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-primary/5 to-transparent blur-3xl opacity-80"
      />

      <div className="relative flex h-full flex-col items-center justify-start pt-16 sm:pt-12 md:pt-14 lg:pt-16 text-center px-4 sm:px-6 pointer-events-none z-20">
        <div className="flex flex-col items-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3.5">
          {/* Main Title / Logo */}
          <div className="relative flex flex-col items-center pointer-events-auto">
            <div className="relative group">
              {/* Ambient radial glow behind the badge logo */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-3 sm:-inset-5 rounded-full bg-primary/20 blur-xl opacity-35 dark:opacity-25 transition-opacity"
              />
              <Image
                src="/logo-rv.png"
                alt={title}
                width={240}
                height={240}
                priority
                className="relative z-10 w-32 h-32 xs:w-36 xs:h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_12px_28px_rgba(255,255,255,0.08)] select-none transition-transform duration-300 hover:scale-105 active:scale-95"
              />
            </div>

            <h1 className="mt-2.5 sm:mt-3.5 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground drop-shadow-xs">
              {title}
            </h1>
          </div>

          {/* Subtitle */}
          <p className="max-w-xs sm:max-w-xl md:max-w-2xl text-balance text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed px-2 sm:px-0">
            {subtitle}
          </p>
        </div>
      </div>
    </TiltedGridHero>
  );
}

export default Hero;

