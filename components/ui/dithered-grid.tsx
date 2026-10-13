"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Stochastic dither: vertical noise, thresholded in SVG filter.
// Fades down (dense at top, sparse at bottom) for headers
const DITHER_FADE_BOTTOM =
  "url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27360%27%20height%3D%27240%27%3E%3Cdefs%3E%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%270%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270.04%27%20stop-color%3D%27%23fff%27%2F%3E%3Cstop%20offset%3D%270.96%27%20stop-color%3D%27%23000%27%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%27f%27%20x%3D%270%27%20y%3D%270%27%20width%3D%27100%25%27%20height%3D%27100%25%27%20color-interpolation-filters%3D%27sRGB%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.45%27%20numOctaves%3D%272%27%20seed%3D%277%27%20stitchTiles%3D%27stitch%27%20result%3D%27n%27%2F%3E%3CfeColorMatrix%20in%3D%27n%27%20type%3D%27matrix%27%20values%3D%271%200%200%200%200%201%200%200%200%200%201%200%200%200%200%200%200%200%200%201%27%20result%3D%27ng%27%2F%3E%3CfeComposite%20in%3D%27SourceGraphic%27%20in2%3D%27ng%27%20operator%3D%27arithmetic%27%20k2%3D%270.5%27%20k3%3D%270.5%27%20result%3D%27s%27%2F%3E%3CfeComponentTransfer%20in%3D%27s%27%20result%3D%27t%27%3E%3CfeFuncR%20type%3D%27discrete%27%20tableValues%3D%270%201%27%2F%3E%3C%2FfeComponentTransfer%3E%3CfeColorMatrix%20in%3D%27t%27%20type%3D%27matrix%27%20values%3D%270%200%200%200%201%200%200%200%200%200.5%200%200%200%200%200%201%200%200%200%200%27%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27url%28%23g%29%27%20filter%3D%27url%28%23f%29%27%2F%3E%3C%2Fsvg%3E')";

// Fades up (sparse at top, dense at bottom)
const DITHER_FADE_TOP =
  "url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27360%27%20height%3D%27240%27%3E%3Cdefs%3E%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%270%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270.04%27%20stop-color%3D%27%23000%27%2F%3E%3Cstop%20offset%3D%270.96%27%20stop-color%3D%27%23fff%27%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%27f%27%20x%3D%270%27%20y%3D%270%27%20width%3D%27100%25%27%20height%3D%27100%25%27%20color-interpolation-filters%3D%27sRGB%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.45%27%20numOctaves%3D%272%27%20seed%3D%277%27%20stitchTiles%3D%27stitch%27%20result%3D%27n%27%2F%3E%3CfeColorMatrix%20in%3D%27n%27%20type%3D%27matrix%27%20values%3D%271%200%200%200%200%201%200%200%200%200%201%200%200%200%200%200%200%200%200%201%27%20result%3D%27ng%27%2F%3E%3CfeComposite%20in%3D%27SourceGraphic%27%20in2%3D%27ng%27%20operator%3D%27arithmetic%27%20k2%3D%270.5%27%20k3%3D%270.5%27%20result%3D%27s%27%2F%3E%3CfeComponentTransfer%20in%3D%27s%27%20result%3D%27t%27%3E%3CfeFuncR%20type%3D%27discrete%27%20tableValues%3D%270%201%27%2F%3E%3C%2FfeComponentTransfer%3E%3CfeColorMatrix%20in%3D%27t%27%20type%3D%27matrix%27%20values%3D%270%200%200%200%201%200%200%200%200%200.5%200%200%200%200%200%201%200%200%200%200%27%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27url%28%23g%29%27%20filter%3D%27url%28%23f%29%27%2F%3E%3C%2Fsvg%3E')";

const GRID = "radial-gradient(circle, #000 0.9px, transparent 1.3px)";

const STYLES = `
.dg-field { position: absolute; inset: 0; pointer-events: none; }
.dg-field.dg-lit {
  -webkit-mask-image: radial-gradient(circle 260px at var(--dg-x, 50%) var(--dg-y, 50%), #000 45%, rgb(0 0 0 / .15) 100%);
  mask-image: radial-gradient(circle 260px at var(--dg-x, 50%) var(--dg-y, 50%), #000 45%, rgb(0 0 0 / .15) 100%);
}
.dg-dots {
  position: absolute; top: 0; bottom: 0; left: 0;
  width: calc(100% + 360px);
  background: var(--dg-accent, #d4d4d8);
  -webkit-mask-size: 4px 4px, 360px var(--dg-gradient-height, 100%);
  mask-size: 4px 4px, 360px var(--dg-gradient-height, 100%);
  -webkit-mask-repeat: repeat, repeat-x;
  mask-repeat: repeat, repeat-x;
  -webkit-mask-composite: source-in;
  mask-composite: intersect;
}
.dg-dots.dg-fade-bottom {
  -webkit-mask-image: ${GRID}, ${DITHER_FADE_BOTTOM};
  mask-image: ${GRID}, ${DITHER_FADE_BOTTOM};
  -webkit-mask-position: 0 0, left top;
  mask-position: 0 0, left top;
}
.dg-dots.dg-fade-top {
  -webkit-mask-image: ${GRID}, ${DITHER_FADE_TOP};
  mask-image: ${GRID}, ${DITHER_FADE_TOP};
  -webkit-mask-position: 0 0, left bottom;
  mask-position: 0 0, left bottom;
}
.dg-dots.dg-fade-none {
  -webkit-mask-image: ${GRID};
  mask-image: ${GRID};
  -webkit-mask-position: 0 0;
  mask-position: 0 0;
}
@media (prefers-reduced-motion: no-preference) {
  .dg-dots.dg-animate { animation: dg-drift 40s linear infinite; }
}
@keyframes dg-drift { to { translate: -360px 0; } }
`;

export interface DitheredGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Accent color for the dots, defaults to neutral gray/white #d4d4d8 */
  accent?: string;
  /** Direction of the dither gradient fade, defaults to 'bottom' */
  fade?: "bottom" | "top" | "none";
  /** Whether the grid drifts smoothly horizontally */
  animate?: boolean;
  /** Interactive mouse spotlight effect tracking the cursor */
  interactive?: boolean;
  /** Height of the dither gradient, e.g. 240, "300px", "100%", etc. Defaults to '100%' */
  gradientHeight?: number | string;
}

/**
 * Standalone Dithered Grid component extracted from dithered-footer.
 * Renders the stochastic dither pattern + dot grid mask.
 */
export function DitheredGrid({
  accent = "#d4d4d8",
  fade = "bottom",
  animate = true,
  interactive = true,
  gradientHeight = "100%",
  className,
  style,
  ...props
}: DitheredGridProps) {
  const fieldRef = React.useRef<HTMLDivElement>(null);
  const frameRef = React.useRef(0);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || e.pointerType !== "mouse" || !fieldRef.current) return;
    const el = fieldRef.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      el.style.setProperty("--dg-x", `${x}px`);
      el.style.setProperty("--dg-y", `${y}px`);
      el.classList.add("dg-lit");
    });
  };

  const onPointerLeave = () => {
    cancelAnimationFrame(frameRef.current);
    fieldRef.current?.classList.remove("dg-lit");
  };

  const heightValue =
    typeof gradientHeight === "number" ? `${gradientHeight}px` : gradientHeight;

  return (
    <div
      aria-hidden="true"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn("pointer-events-none relative overflow-hidden", className)}
      style={
        {
          "--dg-accent": accent,
          "--dg-gradient-height": heightValue,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <style>{STYLES}</style>
      <div ref={fieldRef} className="dg-field">
        <div
          className={cn(
            "dg-dots",
            fade === "bottom" && "dg-fade-bottom",
            fade === "top" && "dg-fade-top",
            fade === "none" && "dg-fade-none",
            animate && "dg-animate"
          )}
        />
      </div>
    </div>
  );
}

export interface DitheredHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: string;
  fade?: "bottom" | "top" | "none";
  animate?: boolean;
  interactive?: boolean;
  /** Height of the dither gradient, e.g. 240, "300px", "100%", etc. Defaults to '100%' */
  gradientHeight?: number | string;
  gridClassName?: string;
  children?: React.ReactNode;
}

/**
 * Header wrapper variation that houses the Dithered Grid in the background
 * and places your title, tags, or header children cleanly in front.
 */
export function DitheredHeader({
  accent = "#d4d4d863",
  fade = "bottom",
  animate = false,
  interactive = true,
  gradientHeight = "100%",
  gridClassName,
  className,
  style,
  children,
  ...props
}: DitheredHeaderProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const fieldRef = React.useRef<HTMLDivElement>(null);
  const frameRef = React.useRef(0);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || e.pointerType !== "mouse" || !fieldRef.current) return;
    const el = fieldRef.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      el.style.setProperty("--dg-x", `${x}px`);
      el.style.setProperty("--dg-y", `${y}px`);
      el.classList.add("dg-lit");
    });
  };

  const onPointerLeave = () => {
    cancelAnimationFrame(frameRef.current);
    fieldRef.current?.classList.remove("dg-lit");
  };

  const heightValue =
    typeof gradientHeight === "number" ? `${gradientHeight}px` : gradientHeight;

  return (
    <div
      ref={containerRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn("relative overflow-hidden", className)}
      style={
        {
          "--dg-accent": accent,
          "--dg-gradient-height": heightValue,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <style>{STYLES}</style>

      {/* Grid Pattern Background Layer */}
      <div className={cn("absolute inset-0 pointer-events-none -z-10", gridClassName)}>
        <div ref={fieldRef} className="dg-field">
          <div
            className={cn(
              "dg-dots",
              fade === "bottom" && "dg-fade-bottom",
              fade === "top" && "dg-fade-top",
              fade === "none" && "dg-fade-none",
              animate && "dg-animate"
            )}
          />
        </div>
      </div>

      {/* Header Content */}
      <div className="relative z-10 ">{children}</div>
    </div>
  );
}

export default DitheredGrid;
