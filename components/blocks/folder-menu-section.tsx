"use client"

import * as React from "react"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DitheredHeader } from "@/components/ui/dithered-grid"
import { AnimatedFolder, type Project } from "@/components/ui/3d-folder"
import { cn } from "@/lib/utils"

export interface ServiceFolderItem {
  id: string
  title: string
  href: string
  badge: string
  description: string
  icon?: "video" | "camera" | "book"
  folderColor?: {
    back: string
    front: string
    tab: string
  }
  projects: Project[]
}

export const DEFAULT_SERVICE_FOLDERS: ServiceFolderItem[] = [
  {
    id: "videography",
    title: "Videography",
    href: "/videography",
    badge: "Cinema & Video",
    description: "Dokumentasi video sinematik, event aftermovie, & visual profile.",
    icon: "video",
    folderColor: {
      back: "oklch(0.68 0.14 50)",
      front: "oklch(0.74 0.16 55)",
      tab: "oklch(0.60 0.12 45)",
    },
    projects: [
      {
        id: "video-1",
        title: "Cinematic Film Set",
        image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80",
        description: "Behind the lens & high-end cine production",
        href: "/videography",
      },
      {
        id: "video-2",
        title: "Event Aftermovie",
        image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=800&auto=format&fit=crop&q=80",
        description: "Dynamic stage & atmospheric festival movement",
        href: "/videography",
      },
      {
        id: "video-3",
        title: "Commercial Studio",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
        description: "Professional camera rigs & studio direction",
        href: "/videography",
      },
    ],
  },
  {
    id: "photography",
    title: "Photography",
    href: "/photography",
    badge: "Photo Studio",
    description: "Sesi foto wisuda, creative portrait, editorial, & group moments.",
    icon: "camera",
    folderColor: {
      back: "oklch(0.64 0.12 245)",
      front: "oklch(0.70 0.14 250)",
      tab: "oklch(0.58 0.10 240)",
    },
    projects: [
      {
        id: "photo-1",
        title: "Student Portraits",
        image: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=800&auto=format&fit=crop&q=80",
        description: "Studio portraits with creative lighting",
        href: "/photography",
      },
      {
        id: "photo-2",
        title: "Editorial Fashion",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
        description: "Modern editorial & lifestyle storytelling",
        href: "/photography",
      },
      {
        id: "photo-3",
        title: "Campus Celebration",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
        description: "Unforgettable senior graduation memories",
        href: "/photography",
      },
    ],
  },
  {
    id: "yearbook",
    title: "Yearbook",
    href: "/yearbook",
    badge: "Buku Tahunan",
    description: "Desain layout tematik, fotografi angkatan, & cetak album tahunan.",
    icon: "book",
    folderColor: {
      back: "oklch(0.60 0.13 145)",
      front: "oklch(0.66 0.15 150)",
      tab: "oklch(0.54 0.11 140)",
    },
    projects: [
      {
        id: "yb-1",
        title: "Heritage Edition",
        image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
        description: "Landscape and campus nature theme",
        href: "/yearbook",
      },
      {
        id: "yb-2",
        title: "Expedition Series",
        image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&auto=format&fit=crop&q=80",
        description: "Outdoor adventure and excursion moments",
        href: "/yearbook",
      },
      {
        id: "yb-3",
        title: "Friendship Moments",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80",
        description: "Cherished school camaraderie and memories",
        href: "/yearbook",
      },
    ],
  },
]

export interface FolderMenuSectionProps {
  title?: string
  description?: string
  services?: ServiceFolderItem[]
  className?: string
  id?: string
}

export function FolderMenuSection({
  title = "Layanan Kami",
  description = "Eksplorasi portfolio dan penawaran karya terbaik kami. Klik folder untuk menuju halaman layanan.",
  services = DEFAULT_SERVICE_FOLDERS,
  className,
  id = "services-menu",
}: FolderMenuSectionProps) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [isMobile, setIsMobile] = React.useState(false)
  const [mobileOpenIndex, setMobileOpenIndex] = React.useState<number | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const touchStartRef = React.useRef<number | null>(null)

  const count = services.length

  // Detect mobile vs desktop to control auto-open behavior and responsive spacing
  React.useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)")
    setIsMobile(mql.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])

  // On mobile: beri jeda halus sebelum folder di posisi tengah otomatis terbuka
  React.useEffect(() => {
    if (!isMobile) {
      setMobileOpenIndex(null)
      return
    }

    setMobileOpenIndex(null)
    const timer = setTimeout(() => {
      setMobileOpenIndex(activeIndex)
    }, 650)

    return () => clearTimeout(timer)
  }, [activeIndex, isMobile])

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : count - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev < count - 1 ? prev + 1 : 0))
  }

  // Keyboard navigation for active folder
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return
      }
      if (e.key === "ArrowLeft") {
        handlePrev()
      } else if (e.key === "ArrowRight") {
        handleNext()
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("keydown", handleKeyDown)
      return () => container.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStartRef.current - touchEnd
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext()
      } else {
        handlePrev()
      }
    }
    touchStartRef.current = null
  }

  return (
    <section
      id={id}
      ref={containerRef}
      className={cn(
        "relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden scroll-mt-12",
        className,
      )}
    >
      {/* Header section matching RV Studio design system */}
      <DitheredHeader
        gradientHeight="120%"
        fade="bottom"
        accent="#d4d4d8"
        className="flex flex-col items-center text-center py-8 sm:py-12 px-4 rounded-3xl border border-white/10 bg-neutral-950/90 backdrop-blur-sm mb-10 sm:mb-14"
      >
        <div className="space-y-3 max-w-3xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground">
            {description}
          </p>
        </div>
      </DitheredHeader>

      {/* 3D Coverflow Carousel (Active on all screen sizes) */}
      <div
        className="w-full flex flex-col items-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="relative w-full max-w-5xl flex items-center justify-center min-h-[440px] py-6"
          style={{ perspective: "1200px" }}
        >
          {services.map((service, index) => {
            const offset = index - activeIndex
            const isCenter = offset === 0

            // Normalized distance for looping/positioning
            let normOffset = offset
            if (normOffset > count / 2) normOffset -= count
            if (normOffset < -count / 2) normOffset += count

            const distance = Math.abs(normOffset)
            const rotateY = normOffset * (isMobile ? -20 : -28)
            // Jarak antar folder lebih rapat di mobile agar folder samping terlihat
            const pitch = isMobile ? 180 : 300
            const translateX = normOffset * pitch
            const translateZ = -distance * (isMobile ? 90 : 140)
            const scale = isCenter ? 1 : isMobile ? 0.82 : 0.88
            const opacity = isCenter ? 1 : isMobile ? 0.6 : Math.max(0.35, 1 - distance * 0.45)
            const zIndex = 30 - Math.round(distance * 10)

            // On mobile: beri jeda beberapa saat sebelum folder tengah terbuka otomatis
            // On desktop: folder tertutup default, hanya terbuka saat di-hover
            const isOpenProp = isMobile
              ? mobileOpenIndex === index
              : isCenter
                ? undefined
                : false

            return (
              <div
                key={service.id}
                onClick={() => {
                  if (!isCenter) {
                    setActiveIndex(index)
                  }
                }}
                className={cn(
                  "absolute transition-all duration-500 ease-out cursor-pointer",
                  !isCenter && "hover:opacity-80 hover:scale-90",
                )}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  transformStyle: "preserve-3d",
                  pointerEvents: distance > 1.5 ? "none" : "auto",
                }}
              >
                <AnimatedFolder
                  title={service.title}
                  projects={service.projects}
                  href={isCenter ? service.href : undefined}
                  folderColor={service.folderColor}
                  isOpen={isOpenProp}
                  cardClickAction="none"
                  className={cn(
                    "transition-all duration-300",
                    isCenter ? "opacity-100" : "opacity-70 hover:opacity-90",
                  )}
                />
              </div>
            )
          })}
        </div>

        {/* Carousel Navigation Controls (Left, Dots, Right) */}
        <div className="flex items-center justify-center gap-6 z-30">
          <button
            onClick={handlePrev}
            aria-label="Layanan Sebelumnya"
            className="w-10 h-10 rounded-full border border-border bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-muted transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {services.map((service, idx) => (
              <button
                key={service.id}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Pilih ${service.title}`}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                  idx === activeIndex
                    ? "w-8 bg-foreground"
                    : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60",
                )}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            aria-label="Layanan Selanjutnya"
            className="w-10 h-10 rounded-full border border-border bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-muted transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Active Item Action */}
        <div className="mt-6 flex justify-center z-30">
          <Button asChild size="default" className="rounded-full px-6 font-medium shadow-sm group">
            <Link href={services[activeIndex].href}>
              <span>Lihat Selengkapnya</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default FolderMenuSection
