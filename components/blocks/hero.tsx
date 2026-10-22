"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HERO_IMAGES } from "@/constants/hero";
import { resolveImageUrl } from "@/sanity/lib/image";

export interface HeroBlockProps {
  speed?: number;
  title?: string;
  subtitle?: string;
  images?: Array<{
    src: string;
    alt?: string;
  }>;
  gallery?: {
    items?: Array<{
      _key?: string;
      title?: string;
      category?: string;
      image?: any;
      externalSrc?: string;
      alt?: string;
    }>;
  } | null;
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
  title: propTitle,
  subtitle: propSubtitle,
  images: propImages,
  gallery,
  data,
}: HeroBlockProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  const title =
    data?.title ??
    propTitle ??
    "Mengabadikan Momen, Menciptakan Kenangan Abadi.";

  const subtitle =
    data?.subtitle ??
    propSubtitle ??
    "RV Project adalah studio visual kreatif yang berdedikasi menghadirkan karya fotografi berkonsep, videografi sinematik, dan buku tahunan sekolah dengan standar visual terbaik.";

  // Prioritize images from sanityData?.showcaseGallery, then data?.images, then fallback
  const slideImages = useMemo(() => {
    if (gallery?.items && gallery.items.length > 0) {
      return gallery.items.map((item, index) => ({
        src: resolveImageUrl(
          item.image,
          item.externalSrc || HERO_IMAGES[index % HERO_IMAGES.length]?.src,
          { width: 1600, height: 720, quality: 85 }
        ),
        alt: item.alt || item.title || `Gallery showcase ${index + 1}`,
      }));
    }

    if (propImages && propImages.length > 0) {
      return propImages;
    }

    if (data?.images && data.images.length > 0) {
      return data.images.map((item, index) => ({
        src: resolveImageUrl(
          item.image,
          item.externalSrc || item.src || HERO_IMAGES[index % HERO_IMAGES.length]?.src,
          { width: 1600, height: 720, quality: 85 }
        ),
        alt: item.alt || `Hero image ${index + 1}`,
      }));
    }

    return HERO_IMAGES;
  }, [gallery?.items, data?.images, propImages]);

  // Auto-slide every 5 seconds (5000ms)
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slideImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slideImages.length]);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.15,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const scaleVariants = {
    visible: (i: number) => ({
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.15,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      opacity: 0,
    },
  };

  const prevIndex =
    slideImages.length > 0
      ? (currentIndex - 1 + slideImages.length) % slideImages.length
      : 0;

  return (
    <section
      className="relative min-h-[85vh] py-14 sm:py-18 md:py-20 px-4 sm:px-6 lg:px-8 bg-background text-foreground overflow-hidden"
      ref={heroRef}
    >
      {/* Ambient background glow & spotlight (monochrome neutral, no red) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 sm:-top-32 z-0 h-[450px] sm:h-[550px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-white/5 to-transparent blur-3xl opacity-60"
      />

      <div className="relative max-w-6xl mx-auto z-10">
        <div className="relative">
          {/* Cutout Hero Image Figure with header nested directly in the shelf notch */}
          <TimelineContent
            as="figure"
            animationNum={3}
            timelineRef={heroRef}
            customVariants={scaleVariants}
            className="relative mb-10 sm:mb-12"
          >
            {/* Brand logo & title - flexible and responsive inside the shelf notch */}
            <div className="absolute top-0 left-0 z-20 pointer-events-auto flex items-center gap-2 sm:gap-3">
              <Image
                src="/logo-rv.png"
                alt="RV Project Logo"
                width={48}
                height={48}
                priority
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain rounded-full shadow-md shrink-0"
              />
              <TimelineContent
                as="span"
                animationNum={0}
                timelineRef={heroRef}
                customVariants={revealVariants}
                className="text-lg sm:text-xl md:text-2xl font-bold tracking-wider text-foreground uppercase whitespace-nowrap drop-shadow-md"
              >
                RV PROJECT
              </TimelineContent>
            </div>

            {/* Hidden SVG defining clipPaths for mobile and desktop */}
            <svg
              width="0"
              height="0"
              className="absolute -z-50 pointer-events-none opacity-0"
              aria-hidden="true"
            >
              <defs>
                {/* Mobile-tailored clipPath: compact logo notch on top-left, full photo height on right */}
                <clipPath
                  id="hero-clip-cutout-mobile"
                  clipPathUnits="objectBoundingBox"
                >
                  <path
                    d="M 0.04 1 L 0.96 1 A 0.04 0.04 0 0 0 1 0.96 L 1 0.04 A 0.04 0.04 0 0 0 0.96 0 L 0.65 0 C 0.61 0 0.59 0.13 0.55 0.13 L 0.04 0.13 A 0.04 0.04 0 0 0 0 0.17 L 0 0.96 A 0.04 0.04 0 0 0 0.04 1 Z"
                  />
                </clipPath>

                {/* Desktop wide clipPath */}
                <clipPath
                  id="hero-clip-cutout"
                  clipPathUnits="objectBoundingBox"
                >
                  <path
                    d="M0.0998072 1H0.422076H0.749756C0.767072 1 0.774207 0.961783 0.77561 0.942675V0.807325C0.777053 0.743631 0.791844 0.731953 0.799059 0.734076H0.969813C0.996268 0.730255 1.00088 0.693206 0.999875 0.675159V0.0700637C0.999875 0.0254777 0.985045 0.00477707 0.977629 0H0.902473C0.854975 0 0.890448 0.138535 0.850165 0.138535H0.0204424C0.00408849 0.142357 0 0.180467 0 0.199045V0.410828C0 0.449045 0.0136283 0.46603 0.0204424 0.469745H0.0523086C0.0696245 0.471019 0.0735527 0.497877 0.0733523 0.511146V0.915605C0.0723903 0.983121 0.090588 1 0.0998072 1Z"
                    fill="#D9D9D9"
                  />
                </clipPath>
              </defs>
            </svg>

            <style>{`
              .hero-cutout-frame {
                clip-path: url(#hero-clip-cutout-mobile);
                -webkit-clip-path: url(#hero-clip-cutout-mobile);
              }
              @media (min-width: 768px) {
                .hero-cutout-frame {
                  clip-path: url(#hero-clip-cutout);
                  -webkit-clip-path: url(#hero-clip-cutout);
                }
              }
            `}</style>

            {/* Image container with responsive CSS clipPath and native object-cover */}
            <div className="relative w-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <div
                className="hero-cutout-frame relative w-full h-[300px] xs:h-[340px] sm:h-[400px] md:h-[450px] lg:h-[490px] overflow-hidden rounded-2xl bg-neutral-900 [clip-path:url(#hero-clip-cutout-mobile)] md:[clip-path:url(#hero-clip-cutout)]"
              >
                {/* Background base image for smooth crossfades */}
                {slideImages.length > 0 && (
                  <img
                    src={slideImages[prevIndex]?.src}
                    alt={slideImages[prevIndex]?.alt || "RV Project"}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                {/* Active fading image transitioning every 5s */}
                <AnimatePresence initial={false}>
                  {slideImages.length > 0 && (
                    <motion.img
                      key={currentIndex}
                      src={slideImages[currentIndex]?.src}
                      alt={slideImages[currentIndex]?.alt || "RV Project"}
                      className="absolute inset-0 w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </TimelineContent>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <h1 className="sm:text-4xl md:text-5xl text-2xl !leading-[115%] font-bold text-foreground mb-6 sm:mb-8 tracking-tight max-w-4xl">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.06}
              staggerFrom="first"
              reverse={true}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 28,
                delay: 0.2,
              }}
            >
              {title}
            </VerticalCutReveal>
          </h1>

          <TimelineContent
            as="div"
            animationNum={4}
            timelineRef={heroRef}
            customVariants={revealVariants}
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-muted-foreground w-full"
          >
            <TimelineContent
              as="div"
              animationNum={5}
              timelineRef={heroRef}
              customVariants={revealVariants}
              className="sm:text-sm text-xs"
            >
              <p className="leading-relaxed text-justify">
                {subtitle}
              </p>
            </TimelineContent>
            <TimelineContent
              as="div"
              animationNum={6}
              timelineRef={heroRef}
              customVariants={revealVariants}
              className="sm:text-sm text-xs"
            >
              <p className="leading-relaxed text-justify">
                Setiap momen memiliki kisahnya sendiri. Dari kebersamaan di bangku sekolah hingga momen selebrasi istimewa, kami menyatukan estetika dan sentuhan visual terbaik untuk kenangan abadi Anda.
              </p>
            </TimelineContent>
            <TimelineContent
              as="div"
              animationNum={7}
              timelineRef={heroRef}
              customVariants={revealVariants}
              className="sm:text-sm text-xs"
            >
              <p className="leading-relaxed text-justify">
                Didukung peralatan sinematografi modern dan tim kreatif yang berdedikasi, kami berkomitmen menghadirkan hasil dokumentasi berkualitas tinggi yang bermakna, autentik, dan dapat dikenang sepanjang masa.
              </p>
            </TimelineContent>
          </TimelineContent>
        </div>
      </div>
    </section>
  );
}

export default Hero;
