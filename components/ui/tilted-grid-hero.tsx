"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Camera distance factor for cylindrical perspective - lower value produces stronger wide-angle / dramatic distortion
const CAMERA = 1.35;

function arc(bend: number) {
  return (CAMERA - 1 + Math.cos(bend)) / (2 * CAMERA * Math.sin(bend));
}

export type TiltedGridImage = {
  src: string;
  alt?: string;
  title?: string;
};

export type TiltedGridHeroProps = {
  images: TiltedGridImage[];
  speed?: number; // auto-scroll speed factor (default: 8)
  tileHeight?: number; // percentage of hero height (default: 32)
  aspectRatio?: number; // default: 16/10
  gap?: number; // percentage gap between tiles (default: 8)
  axis?: number; // vertical center percentage (default: 56)
  curve?: number; // cylinder curvature degrees (default: 48)
  tilt?: number; // 3D tilt inclination degrees around X/Z axis for extra distortion (default: -12)
  fade?: number; // edge fade percentage (default: 12)
  autoPlay?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export function TiltedGridHero({
  images,
  speed = 8,
  tileHeight = 32,
  aspectRatio = 16 / 10,
  gap = 4,
  axis = 56,
  curve = 48,
  tilt = 0,
  fade = 12,
  autoPlay = true,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & TiltedGridHeroProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);

  // Responsive layout state
  const [size, setSize] = React.useState({ width: 1200, height: 700 });
  const [isHovered, setIsHovered] = React.useState(false);

  // Rotation angle state in degrees
  const angleRef = React.useRef(0);
  const isHoveredRef = React.useRef(false);
  isHoveredRef.current = isHovered;

  // Responsive adjustments: On mobile screens, give tiles larger relative width and height so they aren't tiny
  const isMobile = size.width < 640;
  const isTablet = size.width < 1024;
  const effectiveMaxWidth = isMobile ? 66 : isTablet ? 55 : 46;
  const effectiveTileHeight = isMobile ? Math.max(tileHeight, 28) : tileHeight;
  // Well-proportioned vertical placement across viewports
  const effectiveAxis = isMobile ? 58 : isTablet ? 54 : axis;

  // Geometry calculations
  const bend = (Math.min(75, Math.max(12, curve)) * Math.PI) / 180;
  const radius = size.width * arc(bend);
  const tileH = Math.min(
    (effectiveTileHeight / 100) * size.height,
    ((effectiveMaxWidth / 100) * size.width) / aspectRatio
  );
  const tileW = tileH * aspectRatio;
  const degPerRad = 180 / Math.PI;
  const unit = Math.max(4, degPerRad * (tileH / Math.max(radius, 1)));
  const pitch = Math.max(10, (aspectRatio + gap / 100) * unit);
  const limit = Math.max(25, curve + (aspectRatio * unit) / 2);

  // Ensure enough items to create a full continuous circle without empty gaps
  const displayItems = React.useMemo(() => {
    if (!images.length) return [];
    let list = [...images];
    while (list.length * pitch < 360) {
      list = [...list, ...images];
    }
    return list;
  }, [images, pitch]);

  const totalArc = displayItems.length * pitch;

  // Measure container size
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        setSize({ width, height });
      }
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Preload images
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    displayItems.slice(0, 12).forEach(({ src }) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [displayItems]);

  // Main continuous 60fps/120fps rolling animation loop
  React.useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      // Auto-scroll continuously (gentle pause on hover)
      if (autoPlay && !isHoveredRef.current) {
        angleRef.current -= speed * dt;
      }

      // Normalize angle within [0, totalArc)
      if (totalArc > 0) {
        angleRef.current = ((angleRef.current % totalArc) + totalArc) % totalArc;
      }

      // Update card transforms directly via DOM for 60fps smooth performance
      if (trackRef.current) {
        const cardEls = trackRef.current.children;
        for (let i = 0; i < cardEls.length; i++) {
          const card = cardEls[i] as HTMLElement;
          let cardAngle = ((angleRef.current + i * pitch) % totalArc + totalArc) % totalArc;
          if (cardAngle > totalArc / 2) {
            cardAngle -= totalArc;
          }

          // Culling off-screen cards
          if (Math.abs(cardAngle) > limit + pitch * 0.8) {
            card.style.opacity = "0";
            card.style.pointerEvents = "none";
            continue;
          }

          // Distance from center for smooth fade at edges
          const absAngle = Math.abs(cardAngle);
          const edgeFadeStart = limit * 0.65;
          let opacity = 1;
          if (absAngle > edgeFadeStart) {
            opacity = Math.max(0, 1 - (absAngle - edgeFadeStart) / (limit - edgeFadeStart));
          }

          const zIndex = Math.round(100 - absAngle);
          const radStr = `${radius.toFixed(1)}px`;
          const angleStr = `${cardAngle.toFixed(3)}deg`;

          card.style.transform = `translate3d(0, 0, ${radStr}) rotateY(${angleStr}) translate3d(0, 0, -${radStr})`;
          card.style.opacity = opacity.toFixed(3);
          card.style.zIndex = `${zIndex}`;
          card.style.pointerEvents = opacity > 0.3 ? "auto" : "none";
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [pitch, totalArc, speed, radius, limit, autoPlay]);

  const mask = `linear-gradient(90deg, transparent 0%, #000 ${fade}%, #000 ${100 - fade}%, transparent 100%)`;

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden select-none", className)}
      {...props}
    >
      {/* 3D Cylindrical Carousel Viewport */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          perspective: `${(radius * CAMERA).toFixed(1)}px`,
          perspectiveOrigin: `50% ${effectiveAxis}%`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      >
        {/* Track holding all cylindrical cards with 3D tilt */}
        <div
          ref={trackRef}
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transform: tilt !== 0 ? `rotateX(${tilt}deg) rotateZ(${(tilt * 0.25).toFixed(2)}deg)` : undefined,
          }}
        >
          {displayItems.map((img, i) => (
            <div
              key={`${i}-${img.src}`}
              className="absolute left-1/2 top-0 -translate-x-1/2 will-change-transform pointer-events-auto"
              style={{
                top: `calc(${effectiveAxis}% - ${tileH / 2}px)`,
                width: `${tileW.toFixed(1)}px`,
                height: `${tileH.toFixed(1)}px`,
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <div className="group relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10 dark:border-white/15 bg-card/90 transition-transform ">
                <img
                  src={img.src}
                  alt={img.alt || "Studio portfolio"}
                  draggable={false}
                  loading="eager"
                  className="w-full h-full object-cover select-none pointer-events-none rounded-xl sm:rounded-2xl transition-transform "
                />
                {/* Subtle cinematic gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none rounded-xl sm:rounded-2xl" />

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Foreground Content (Title, subtitle) */}
      {children}
    </div>
  );
}

export default TiltedGridHero;
