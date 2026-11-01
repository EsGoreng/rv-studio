"use client";

import React, { useRef, useEffect, useCallback } from "react";

interface GradientBarsProps {
  numBars?: number;
  gradientFrom?: string;
  gradientTo?: string;
  animationDuration?: number;
  className?: string;
}

/**
 * GradientBars — dirender via Canvas untuk performa optimal dan zero gap.
 * - Single DOM node (canvas) menggantikan puluhan div
 * - requestAnimationFrame untuk animasi GPU-accelerated
 * - prefers-reduced-motion: animasi dinonaktifkan, bar tampil statis
 * - Posisi dikontrol sepenuhnya dari luar via className
 */
const GradientBars: React.FC<GradientBarsProps> = ({
  numBars = 20,
  gradientFrom = "rgb(120, 120, 120)",
  gradientTo = "transparent",
  animationDuration = 2,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  // Simpan dpr dan logical size sebagai ref agar draw selalu pakai nilai terbaru
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  const reducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const calculateHeight = (index: number, total: number): number => {
    const position = index / (total - 1);
    const minHeight = 0.3;
    const maxHeight = 1.0;
    const distanceFromCenter = Math.abs(position - 0.5);
    const heightPercentage = Math.pow(distanceFromCenter * 2, 1.2);
    return minHeight + (maxHeight - minHeight) * heightPercentage;
  };

  const draw = useCallback(
    (canvas: HTMLCanvasElement, elapsed: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { w, h, dpr } = sizeRef.current;
      if (w === 0 || h === 0) return;

      // canvas.width/height adalah pixel fisik (w * dpr)
      ctx.clearRect(0, 0, w * dpr, h * dpr);

      const barWidth = (w * dpr) / numBars;
      const period = animationDuration * 1000;

      for (let i = 0; i < numBars; i++) {
        const baseScale = calculateHeight(i, numBars);
        const phaseOffset = (i / numBars) * Math.PI * 2;
        const t = reducedMotion
          ? 0
          : Math.sin((elapsed / period) * Math.PI * 2 + phaseOffset);
        const scale = baseScale * (0.85 + t * 0.15);

        const barH = h * dpr * scale;
        const x = i * barWidth;
        const y = h * dpr - barH;

        const grad = ctx.createLinearGradient(x, h * dpr, x, y);
        grad.addColorStop(0, gradientFrom);
        grad.addColorStop(
          1,
          gradientTo === "transparent" ? "rgba(0,0,0,0)" : gradientTo
        );

        ctx.fillStyle = grad;
        // +1 menutup celah subpixel antar bar
        ctx.fillRect(x, y, barWidth + 1, barH);
      }
    },
    [numBars, gradientFrom, gradientTo, animationDuration, reducedMotion]
  );

  const syncSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = rect.width;
    const h = rect.height;

    if (w === 0 || h === 0) return;

    // Set dimensi fisik canvas — ini me-reset context secara otomatis
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    sizeRef.current = { w, h, dpr };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Jalankan setelah paint pertama agar getBoundingClientRect akurat
    const init = () => {
      syncSize();
      startTimeRef.current = 0;

      const animate = (ts: number) => {
        if (!startTimeRef.current) startTimeRef.current = ts;
        const elapsed = ts - startTimeRef.current;
        draw(canvas, elapsed);
        if (!reducedMotion) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    };

    // Beri browser satu frame untuk menghitung layout fixed/inset-0
    const frameId = requestAnimationFrame(init);

    const ro = new ResizeObserver(() => {
      syncSize();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(frameId);
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [draw, syncSize, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
};

interface GradientBarsBackgroundProps {
  numBars?: number;
  gradientFrom?: string;
  gradientTo?: string;
  animationDuration?: number;
  backgroundColor?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * GradientBarsBackground — wrapper section dengan bars sebagai sticky background.
 * Cocok untuk membungkus section individual.
 */
export default function GradientBarsBackground({
  numBars = 20,
  gradientFrom = "rgb(120, 120, 120)",
  gradientTo = "transparent",
  animationDuration = 2,
  backgroundColor = "rgb(10, 10, 10)",
  children,
  className = "",
}: GradientBarsBackgroundProps) {
  return (
    <section
      className={`relative w-full overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      <GradientBars
        numBars={numBars}
        gradientFrom={gradientFrom}
        gradientTo={gradientTo}
        animationDuration={animationDuration}
        className="sticky top-0 z-0 w-full h-screen"
      />
      {children && (
        <div
          className="relative z-10 w-full"
          style={{ marginTop: "-100vh" }}
        >
          {children}
        </div>
      )}
    </section>
  );
}

export { GradientBarsBackground, GradientBars };
