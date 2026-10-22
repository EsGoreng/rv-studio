"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const STYLES = `
.dg-field {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.dg-field.dg-lit::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle 280px at var(--dg-x, 50%) var(--dg-y, 50%),
    rgba(255, 255, 255, 0.08) 0%,
    transparent 70%
  );
  pointer-events: none;
  transition: opacity 0.25s ease;
}
.dg-dots {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: var(--dg-accent, #d4d4d8);
  pointer-events: none;
}
.dg-dots.dg-fade-bottom {
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 0.05) 50%,
    transparent var(--dg-gradient-height, 100%)
  );
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 0.05) 50%,
    transparent var(--dg-gradient-height, 100%)
  );
}
.dg-dots.dg-fade-top {
  -webkit-mask-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 0.05) 50%,
    transparent var(--dg-gradient-height, 100%)
  );
  mask-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 0.05) 50%,
    transparent var(--dg-gradient-height, 100%)
  );
}
.dg-dots.dg-fade-none {
  -webkit-mask-image: radial-gradient(
    ellipse at 50% 0%,
    rgba(0, 0, 0, 0.15) 0%,
    transparent var(--dg-gradient-height, 100%)
  );
  mask-image: radial-gradient(
    ellipse at 50% 0%,
    rgba(0, 0, 0, 0.15) 0%,
    transparent var(--dg-gradient-height, 100%)
  );
}
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
