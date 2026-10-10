"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ==========================================
// Types & Interfaces
// ==========================================
export interface GlassEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  target?: string;
  rounded?: string;
}

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
  target?: string;
  className?: string;
}

// ==========================================
// SVG Filter Component (Singleton / Reusable)
// ==========================================
export const GlassFilter: React.FC<{ filterId?: string }> = ({
  filterId = "glass-distortion",
}) => (
  <svg
    aria-hidden="true"
    className="pointer-events-none absolute -left-[9999px] -top-[9999px] h-0 w-0"
    style={{ position: "absolute", width: 0, height: 0 }}
  >
    <defs>
      <filter
        id={filterId}
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        filterUnits="objectBoundingBox"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.001 0.005"
          numOctaves="1"
          seed="17"
          result="turbulence"
        />
        <feComponentTransfer in="turbulence" result="mapped">
          <feFuncR type="gamma" amplitude={1} exponent={10} offset={0.5} />
          <feFuncG type="gamma" amplitude={0} exponent={1} offset={0} />
          <feFuncB type="gamma" amplitude={0} exponent={1} offset={0.5} />
        </feComponentTransfer>
        <feGaussianBlur in="turbulence" stdDeviation={3} result="softMap" />
        <feSpecularLighting
          in="softMap"
          surfaceScale={5}
          specularConstant={1}
          specularExponent={100}
          lightingColor="white"
          result="specLight"
        >
          <fePointLight x={-200} y={-200} z={300} />
        </feSpecularLighting>
        <feComposite
          in="specLight"
          operator="arithmetic"
          k1={0}
          k2={1}
          k3={1}
          k4={0}
          result="litImage"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="softMap"
          scale={200}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
  </svg>
);

// ==========================================
// Glass Effect Core Wrapper (Liquid Glass)
// ==========================================
export const GlassEffect: React.FC<GlassEffectProps> = ({
  children,
  className = "",
  style = {},
  href,
  target = "_blank",
  rounded = "rounded-3xl",
  ...props
}) => {
  const glassStyle: React.CSSProperties = {
    boxShadow: "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
    transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
    ...style,
  };

  const content = (
    <div
      className={cn(
        "relative flex font-semibold overflow-hidden text-foreground cursor-pointer transition-all duration-700",
        rounded,
        className
      )}
      style={glassStyle}
      {...props}
    >
      {/* SVG Distortion Filter fallback element */}
      <GlassFilter />

      {/* Glass Layer 1: Blur and Distortion */}
      <div
        className={cn(
          "absolute inset-0 z-0 overflow-hidden pointer-events-none",
          rounded
        )}
        style={{
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          filter: "url(#glass-distortion)",
          isolation: "isolate",
        }}
      />

      {/* Glass Layer 2: White Translucent Tint */}
      <div
        className={cn(
          "absolute inset-0 z-10 pointer-events-none bg-white/25 dark:bg-white/10",
          rounded
        )}
      />

      {/* Glass Layer 3: Bevel / Inset border highlight */}
      <div
        className={cn(
          "absolute inset-0 z-20 overflow-hidden pointer-events-none",
          rounded
        )}
        style={{
          boxShadow:
            "inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.3)",
        }}
      />

      {/* Content */}
      <div className="relative z-30 w-full">{children}</div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel="noopener noreferrer"
        className="block no-underline"
      >
        {content}
      </a>
    );
  }

  return content;
};

// ==========================================
// Glass Button Component
// ==========================================
export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  href,
  target,
  className = "",
  onClick,
  ...props
}) => {
  const innerContent = (
    <div
      className="transition-all duration-500 hover:scale-95"
      style={{
        transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
      }}
    >
      {children}
    </div>
  );

  return (
    <GlassEffect
      href={href}
      target={target}
      onClick={onClick as any}
      className={cn(
        "rounded-3xl px-8 py-4 sm:px-10 sm:py-5 hover:px-9 hover:py-5 sm:hover:px-11 sm:hover:py-6 hover:rounded-[2rem] overflow-hidden text-center",
        className
      )}
      {...(props as any)}
    >
      {innerContent}
    </GlassEffect>
  );
};

export const LiquidGlass = GlassEffect;
export default LiquidGlass;
