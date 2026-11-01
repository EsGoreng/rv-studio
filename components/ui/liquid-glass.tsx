"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useCallback, useState, useId } from "react";

const smoothStep = (a: number, b: number, t: number): number => {
  t = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const length = (x: number, y: number): number => {
  return Math.sqrt(x * x + y * y);
};

const roundedRectSDF = (
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): number => {
  const qx = Math.abs(x) - width + radius;
  const qy = Math.abs(y) - height + radius;
  return (
    Math.min(Math.max(qx, qy), 0) +
    length(Math.max(qx, 0), Math.max(qy, 0)) -
    radius
  );
};

interface UV {
  x: number;
  y: number;
}

interface MousePosition {
  x: number;
  y: number;
}

export interface LiquidGlassProps {
  offset?: number;
  className?: string;
  distortWidth?: number;
  distortHeight?: number;
  distortRadius?: number;
  smoothStepEdge?: number;
  distanceOffset?: number;
  /** When true, renders as a static wrapper around children instead of a draggable overlay */
  asWrapper?: boolean;
  children?: React.ReactNode;
}

export const LiquidGlass = ({
  offset = 10,
  className,
  distortWidth = 0.30,
  distortHeight = 0.20,
  distortRadius = 0.60,
  smoothStepEdge = 0.80,
  distanceOffset = 0.15,
  asWrapper = false,
  children,
}: LiquidGlassProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;

    const update = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
        setHeight(containerRef.current.offsetHeight);
      }
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const feImageRef = useRef<SVGFEImageElement | null>(null);
  const feDisplacementMapRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const mouse = useRef<MousePosition>({ x: 0, y: 0 });
  const mouseUsed = useRef(false);
  const rawId = useId();
  // useId() returns a format like ":r0:" — strip colons so it's valid as a CSS/SVG id
  const filterId = useRef(`liquid-glass-${rawId.replace(/:/g, "")}`);

  const updateShader = useCallback(() => {
    if (
      !canvasRef.current ||
      !feImageRef.current ||
      !feDisplacementMapRef.current ||
      width <= 1 ||
      height <= 1
    )
      return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const canvasDPI = 1;
    const w = Math.floor(width * canvasDPI);
    const h = Math.floor(height * canvasDPI);
    if (w <= 0 || h <= 0) return;

    canvas.width = w;
    canvas.height = h;

    const data = new Uint8ClampedArray(w * h * 4);
    let maxScale = 0;
    const rawValues: number[] = [];

    const fragment = (uv: UV) => {
      const ix = uv.x - 0.5;
      const iy = uv.y - 0.5;
      const distanceToEdge = roundedRectSDF(
        ix,
        iy,
        distortWidth,
        distortHeight,
        distortRadius,
      );
      const displacement = smoothStep(
        smoothStepEdge,
        0,
        distanceToEdge - distanceOffset,
      );
      const scaled = smoothStep(0, 1, displacement);
      return { x: ix * scaled + 0.5, y: iy * scaled + 0.5 };
    };

    for (let i = 0; i < w * h; i++) {
      const x = i % w;
      const y = Math.floor(i / w);
      const pos = fragment({ x: x / w, y: y / h });
      const dx = pos.x * w - x;
      const dy = pos.y * h - y;
      maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
      rawValues.push(dx, dy);
    }

    maxScale *= 0.5;

    let dataIndex = 0;
    let rawValueIndex = 0;
    for (let i = 0; i < w * h; i++) {
      const r = rawValues[rawValueIndex++] / maxScale + 0.5;
      const g = rawValues[rawValueIndex++] / maxScale + 0.5;
      data[dataIndex++] = r * 255;
      data[dataIndex++] = g * 255;
      data[dataIndex++] = 0;
      data[dataIndex++] = 255;
    }

    context.putImageData(new ImageData(data, w, h), 0, 0);

    feImageRef.current.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "href",
      canvas.toDataURL(),
    );

    feDisplacementMapRef.current.setAttribute(
      "scale",
      (maxScale / canvasDPI).toString(),
    );
  }, [
    width,
    height,
    distortWidth,
    distortHeight,
    distortRadius,
    smoothStepEdge,
    distanceOffset,
  ]);

  useEffect(() => {
    updateShader();
  }, [updateShader]);

  // Dragging logic — only used when NOT asWrapper
  useEffect(() => {
    if (asWrapper) return;
    const container = containerRef.current;
    if (!container) return;

    let isDragging = false;
    let startX = 0,
      startY = 0,
      initialX = 0,
      initialY = 0;

    const constrainPosition = (x: number, y: number) => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const minX = offset;
      const maxX = viewportWidth - width - offset;
      const minY = offset;
      const maxY = viewportHeight - height - offset;
      return {
        x: Math.max(minX, Math.min(maxX, x)),
        y: Math.max(minY, Math.min(maxY, y)),
      };
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      container.style.cursor = "grabbing";
      startX = e.clientX;
      startY = e.clientY;
      const rect = container.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const constrained = constrainPosition(
          initialX + deltaX,
          initialY + deltaY,
        );
        container.style.left = `${constrained.x}px`;
        container.style.top = `${constrained.y}px`;
        container.style.transform = "none";
      }

      const rect = container.getBoundingClientRect();
      mouse.current.x = (e.clientX - rect.left) / rect.width;
      mouse.current.y = (e.clientY - rect.top) / rect.height;

      if (mouseUsed.current) {
        updateShader();
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      container.style.cursor = "grab";
    };

    const onResize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const constrained = constrainPosition(rect.left, rect.top);
      if (rect.left !== constrained.x || rect.top !== constrained.y) {
        containerRef.current.style.left = `${constrained.x}px`;
        containerRef.current.style.top = `${constrained.y}px`;
        containerRef.current.style.transform = "none";
      }
    };

    container.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    window.addEventListener("resize", onResize);

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", onResize);
    };
  }, [width, height, offset, updateShader, asWrapper]);

  const filterStyle = {
    backdropFilter: `url(#${filterId.current}) blur(2px) contrast(1.05) brightness(1.15) saturate(1.2)`,
    WebkitBackdropFilter: `url(#${filterId.current}) blur(2px) contrast(1.05) brightness(1.15) saturate(1.2)`,
  } as React.CSSProperties;

  const svgEl = (
    <svg
      width="0"
      height="0"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9998,
      }}
    >
      <defs>
        <filter
          id={filterId.current}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
          x="0"
          y="0"
          width={width}
          height={height}
        >
          <feImage
            ref={feImageRef}
            width={width}
            height={height}
            result={`${filterId.current}_map`}
          />
          <feDisplacementMap
            ref={feDisplacementMapRef}
            in="SourceGraphic"
            in2={`${filterId.current}_map`}
            xChannelSelector="R"
            yChannelSelector="G"
            scale="0"
          />
        </filter>
      </defs>
    </svg>
  );

  const canvasEl = (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: "none" }}
    />
  );

  // ── Wrapper mode: static container that wraps children ──────────────────────
  if (asWrapper) {
    return (
      <>
        {svgEl}
        <div
          ref={containerRef}
          style={{
            boxShadow:
              "0 4px 8px rgba(0, 0, 0, 0.25), 0 -10px 25px inset rgba(0, 0, 0, 0.15)",
            ...filterStyle,
          }}
          className={cn(
            "pointer-events-auto overflow-hidden border bg-white/5",
            className,
          )}
        >
          {children}
        </div>
        {canvasEl}
      </>
    );
  }

  // ── Original mode: draggable fixed circle overlay ───────────────────────────
  return (
    <>
      {svgEl}
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow:
            "0 4px 8px rgba(0, 0, 0, 0.25), 0 -10px 25px inset rgba(0, 0, 0, 0.15)",
          ...filterStyle,
        }}
        className={cn(
          "pointer-events-auto flex h-64 w-64 cursor-grab overflow-hidden rounded-full border",
          className,
        )}
      />
      {canvasEl}
    </>
  );
};

export default LiquidGlass;
