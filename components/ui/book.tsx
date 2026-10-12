"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const radiusMap = {
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
};

const sizeMap = {
  sm: { width: "180px", spineTranslation: "152px" },
  md: { width: "220px", spineTranslation: "192px" },
  lg: { width: "260px", spineTranslation: "232px" },
};

const colorMap = {
  slate: { from: "from-slate-900", to: "to-slate-700" },
  gray: { from: "from-gray-900", to: "to-gray-700" },
  zinc: { from: "from-zinc-900", to: "to-zinc-700" },
  neutral: { from: "from-neutral-900", to: "to-neutral-700" },
  stone: { from: "from-stone-900", to: "to-stone-700" },
  red: { from: "from-red-900", to: "to-red-700" },
  orange: { from: "from-orange-900", to: "to-orange-700" },
  amber: { from: "from-amber-900", to: "to-amber-700" },
  yellow: { from: "from-yellow-900", to: "to-yellow-700" },
  lime: { from: "from-lime-900", to: "to-lime-700" },
  green: { from: "from-green-900", to: "to-green-700" },
  emerald: { from: "from-emerald-900", to: "to-emerald-700" },
  teal: { from: "from-teal-900", to: "to-teal-700" },
  cyan: { from: "from-cyan-900", to: "to-cyan-700" },
  sky: { from: "from-sky-900", to: "to-sky-700" },
  blue: { from: "from-blue-900", to: "to-blue-700" },
  indigo: { from: "from-indigo-900", to: "to-indigo-700" },
  violet: { from: "from-violet-900", to: "to-violet-700" },
  purple: { from: "from-purple-900", to: "to-purple-700" },
  fuchsia: { from: "from-fuchsia-900", to: "to-fuchsia-700" },
  pink: { from: "from-pink-900", to: "to-pink-700" },
  rose: { from: "from-rose-900", to: "to-rose-700" },
};

export type ModernBookColor = keyof typeof colorMap;

export interface ModernBookCoverProps {
  radius?: "sm" | "md" | "lg";
  size?: "sm" | "md" | "lg" | "full";
  color?: ModernBookColor | (string & {});
  isStatic?: boolean;
  className?: string;
  depth?: number;
  texture?: boolean;
  variant?: string;
  illustration?: ReactNode;
  children?: ReactNode;
}

export const ModernBookCover = ({
  radius = "sm",
  size = "md",
  color = "zinc",
  isStatic = false,
  className = "",
  depth,
  texture,
  variant,
  illustration,
  children,
}: ModernBookCoverProps) => {
  const gradient =
    (colorMap as Record<string, { from: string; to: string }>)[color] ||
    colorMap.zinc;

  const isFullSize = size === "full";
  const spineDepth = depth ? depth * 4 : 32; // Realistic 3D book thickness in px

  // If custom hex or color string is provided, apply custom styling
  const customBg =
    color && !colorMap[color as keyof typeof colorMap] ? color : undefined;

  return (
    <div
      className={cn(
        "z-10 group [perspective:1200px] select-none [--shadowColor:rgba(0,0,0,0.35)] dark:[--shadowColor:rgba(0,0,0,0.7)]",
        isFullSize ? "w-full h-full flex justify-center items-center" : "w-min",
        className
      )}
    >
      <div
        style={{
          width: isFullSize ? "100%" : sizeMap[size]?.width || sizeMap.md.width,
          height: isFullSize ? "100%" : undefined,
          transition: "transform 650ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 650ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className={cn(
          "relative [transform-style:preserve-3d] will-change-transform",
          !isFullSize && "aspect-3/4",
          isStatic
            ? "[transform:rotateY(-26deg)_rotateX(3deg)]"
            : "[transform:rotateY(0deg)_rotateX(0deg)] group-hover:[transform:rotateY(-28deg)_rotateX(3deg)_translateZ(10px)]",
          radiusMap[radius]
        )}
      >
        {/* Front Cover (Hardcover with Image) */}
        <div
          className={cn(
            "absolute inset-0 size-full left-0 overflow-hidden text-white flex flex-col justify-end bg-gradient-to-tr [transform-style:preserve-3d]",
            !customBg && gradient.from,
            !customBg && gradient.to,
            radiusMap[radius]
          )}
          style={{
            backgroundColor: customBg,
            transform: `translateZ(${spineDepth / 2}px)`,
            boxShadow: "0 10px 30px -5px var(--shadowColor), 0 2px 6px rgba(0,0,0,0.15)",
          }}
        >
          {illustration && (
            <div className="absolute inset-0 size-full z-0 overflow-hidden pointer-events-none">
              {illustration}
            </div>
          )}

          {/* Realistic Spine Crease / Hinge Shadow along left edge */}
          <div
            className="absolute left-0 top-0 bottom-0 pointer-events-none z-20"
            style={{
              width: "14px",
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.12) 25%, rgba(255,255,255,0.18) 50%, rgba(0,0,0,0.08) 80%, transparent 100%)",
            }}
          />

          {/* Dynamic Lighting / Specular Sheen across front cover on hover */}
          <div
            className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-700 opacity-0 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(115deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 40%, transparent 70%)",
            }}
          />

          {children && (
            <div className="relative z-30 p-4">{children}</div>
          )}
        </div>

        {/* Left Spine (Punggung Buku Kiri) */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none overflow-hidden"
          style={{
            width: `${spineDepth}px`,
            left: `-${spineDepth / 2}px`,
            transform: "rotateY(-90deg)",
            backgroundColor: customBg || "#1e293b",
            background: customBg
              ? `linear-gradient(90deg, rgba(0,0,0,0.3) 0%, ${customBg} 50%, rgba(0,0,0,0.4) 100%)`
              : "linear-gradient(90deg, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0.1) 50%, rgba(0,0,0,0.5) 100%)",
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.4)",
          }}
        />

        {/* Right Page Edge (Lembaran Halaman Kanan) */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "2px",
            bottom: "2px",
            width: `${spineDepth - 3}px`,
            right: `-${(spineDepth - 3) / 2}px`,
            transform: "rotateY(90deg)",
            background:
              "repeating-linear-gradient(90deg, #f8fafc 0px, #f1f5f9 2px, #e2e8f0 3px, #cbd5e1 4px)",
            boxShadow: "inset 0 0 8px rgba(0,0,0,0.25)",
          }}
        />

        {/* Top Page Edge (Lembaran Kertas Atas) */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: "2px",
            right: "2px",
            height: `${spineDepth - 3}px`,
            top: `-${(spineDepth - 3) / 2}px`,
            transform: "rotateX(90deg)",
            background:
              "repeating-linear-gradient(0deg, #f8fafc 0px, #f1f5f9 2px, #e2e8f0 3px, #cbd5e1 4px)",
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.2)",
          }}
        />

        {/* Bottom Page Edge (Lembaran Kertas Bawah) */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: "2px",
            right: "2px",
            height: `${spineDepth - 3}px`,
            bottom: `-${(spineDepth - 3) / 2}px`,
            transform: "rotateX(-90deg)",
            background:
              "repeating-linear-gradient(0deg, #f8fafc 0px, #f1f5f9 2px, #e2e8f0 3px, #cbd5e1 4px)",
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.25)",
          }}
        />

        {/* Back Cover (Sampul Belakang) */}
        <div
          className={cn(
            "absolute inset-0 size-full left-0 overflow-hidden text-white bg-gradient-to-tr",
            !customBg && gradient.from,
            !customBg && gradient.to,
            radiusMap[radius]
          )}
          style={{
            backgroundColor: customBg,
            transform: `translateZ(-${spineDepth / 2}px)`,
            boxShadow: "-12px 12px 35px 5px var(--shadowColor)",
          }}
        />
      </div>
    </div>
  );
};

export interface BookHeaderProps {
  children: ReactNode;
  className?: string;
}

export const BookHeader = ({ children, className = "" }: BookHeaderProps) => (
  <div className={cn("flex gap-2 flex-wrap", className)}>{children}</div>
);

export interface BookTitleProps {
  children: ReactNode;
  className?: string;
}

export const BookTitle = ({ children, className = "" }: BookTitleProps) => (
  <h1 className={cn("font-bold select-none mt-3 mb-1 text-balance", className)}>
    {children}
  </h1>
);

export interface BookDescriptionProps {
  children: ReactNode;
  className?: string;
}

export const BookDescription = ({
  children,
  className = "",
}: BookDescriptionProps) => (
  <p className={cn("opacity-80 select-none text-xs/relaxed", className)}>
    {children}
  </p>
);

// Alias Book to ModernBookCover for backward compatibility
export const Book = ModernBookCover;
export type BookProps = ModernBookCoverProps;

export default ModernBookCover;
