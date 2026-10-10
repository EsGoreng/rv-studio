"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface GalleryItem {
  src: string;
  alt?: string;
  title?: string;
  category?: string;
}

export interface ProjectFilterGalleryProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  items: GalleryItem[];
  columns?: number;
  /** CSS aspect-ratio of each photo, e.g. "5 / 4". */
  aspect?: string;
  gap?: number;
  /** Selected category, or "All". Leave undefined to let the gallery manage it. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Step through the categories on its own until someone interacts. */
  autoplay?: boolean;
  /** Milliseconds between categories in autoplay. */
  interval?: number;
  /** Milliseconds for a photo to bloom/animate from grayscale into full vibrancy. */
  bloomDuration?: number;
  /** React 19 passes `ref` as a regular prop. */
  ref?: React.Ref<HTMLDivElement>;
}

const IDLE_MS = 6000;
const READY_FALLBACK_MS = 1500;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ProjectFilterGallery({
  items,
  columns = 4,
  aspect = "5 / 4",
  gap = 12,
  value: controlledValue,
  defaultValue = "All",
  onValueChange,
  autoplay = false,
  interval = 3500,
  bloomDuration = 600,
  ref,
  className,
  ...rest
}: ProjectFilterGalleryProps) {
  const [internalValue, setInternalValue] = React.useState<string>(defaultValue);
  const value = controlledValue ?? internalValue;
  const [showAll, setShowAll] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [hovered, setHovered] = React.useState<{ index: number; x: number; y: number } | null>(null);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const pausedUntil = React.useRef(0);
  const valueRef = React.useRef(value);
  valueRef.current = value;
  const chipRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const categoryOf = React.useCallback(
    (item: GalleryItem): string => item.category || "General",
    [],
  );

  // Group counts by category
  const counts = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) {
      const cat = categoryOf(item);
      map.set(cat, (map.get(cat) ?? 0) + 1);
    }
    return map;
  }, [items, categoryOf]);

  const categories = React.useMemo(() => Array.from(counts.keys()), [counts]);
  const choices: string[] = React.useMemo(() => ["All", ...categories], [categories]);

  const choose = React.useCallback(
    (next: string, fromUser: boolean) => {
      if (fromUser) pausedUntil.current = Date.now() + IDLE_MS;
      if (controlledValue === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [controlledValue, onValueChange],
  );

  React.useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => setReducedMotion(motion.matches);
    onMotion();
    motion.addEventListener("change", onMotion);
    return () => motion.removeEventListener("change", onMotion);
  }, []);

  // Preload visible images
  React.useEffect(() => {
    let done = false;
    const markReady = () => {
      if (!done) setReady(true);
      done = true;
    };
    const first = valueRef.current;
    const awaited = items.filter(
      (item) => first === "All" || categoryOf(item).toLowerCase() === first.toLowerCase(),
    );
    const gate = awaited.length > 0 ? awaited : items;
    let loaded = 0;
    const images = items.map((item) => {
      const image = new Image();
      image.decoding = "async";
      if (gate.includes(item)) {
        image.onload = image.onerror = () => {
          loaded += 1;
          if (loaded >= gate.length) markReady();
        };
      }
      image.src = item.src;
      return image;
    });
    if (gate.length === 0) markReady();
    const fallback = window.setTimeout(markReady, READY_FALLBACK_MS);
    return () => {
      done = true;
      window.clearTimeout(fallback);
      for (const image of images) image.onload = image.onerror = null;
    };
  }, [items, categoryOf]);

  // Autoplay through categories if enabled
  React.useEffect(() => {
    if (!autoplay || reducedMotion || !ready || categories.length === 0) return;
    const sequence: string[] = ["All", ...categories];
    const timer = window.setInterval(() => {
      if (Date.now() < pausedUntil.current) return;
      const at = sequence.indexOf(valueRef.current);
      choose(sequence[(at + 1) % sequence.length]!, false);
    }, interval);
    return () => window.clearInterval(timer);
  }, [autoplay, reducedMotion, ready, categories, interval, choose]);

  const onChipKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const at = Math.max(0, choices.indexOf(value));
    const next = (at + (event.key === "ArrowRight" ? 1 : -1) + choices.length) % choices.length;
    choose(choices[next]!, true);
    chipRefs.current[next]?.focus();
  };

  const matchRank = new Map<number, number>();
  items.forEach((item, index) => {
    const matches =
      value === "All" || categoryOf(item).toLowerCase() === value.toLowerCase();
    if (matches) matchRank.set(index, matchRank.size);
  });

  const shown =
    value === "All"
      ? items.length
      : (counts.get(value) ??
         Array.from(counts.entries()).find(([k]) => k.toLowerCase() === value.toLowerCase())?.[1] ??
         0);

  const status =
    value === "All"
      ? `Semua ${shown} dokumentasi project`
      : `${shown} ${shown === 1 ? "project" : "projects"} kategori ${value}`;

  return (
    <div
      ref={ref}
      data-slot="project-filter-gallery"
      data-value={value}
      data-ready={ready || undefined}
      className={cx("w-full text-foreground", className)}
      {...rest}
    >
      {/* Category Filter Chips & Status */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div
          role="radiogroup"
          aria-label="Filter project berdasarkan kategori"
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap"
          onKeyDown={onChipKey}
        >
          {choices.map((choice, i) => {
            const selected = value.toLowerCase() === choice.toLowerCase();
            const count =
              choice === "All"
                ? items.length
                : (counts.get(choice) ??
                   Array.from(counts.entries()).find(
                     ([k]) => k.toLowerCase() === choice.toLowerCase(),
                   )?.[1] ??
                   0);

            return (
              <button
                key={choice}
                ref={(node) => {
                  chipRefs.current[i] = node;
                }}
                type="button"
                role="radio"
                aria-checked={selected}
                tabIndex={selected ? 0 : -1}
                data-chip={choice}
                onClick={() => choose(choice, true)}
                className={cx(
                  "group relative inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 sm:px-4 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  selected
                    ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "border-border/80 bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                <span>{choice === "All" ? "Semua" : choice}</span>
                <span
                  className={cx(
                    "tabular-nums text-[11px] px-1.5 py-0.5 rounded-full transition-colors",
                    selected
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <p data-status aria-live="polite" className="text-xs sm:text-sm text-muted-foreground font-medium shrink-0">
          {status}
        </p>
      </div>

      {/* Gallery Container (Horizontal scroll on mobile, grid on desktop) */}
      <div
        role="list"
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 pb-3 sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 sm:overflow-visible sm:snap-none"
        style={{ gap }}
      >
        {items.map((item, index) => {
          const category = categoryOf(item);
          const rank = matchRank.get(index);
          const matches = rank !== undefined;
          const isHovered = hovered?.index === index;
          const colored = ready && (matches || isHovered);
          const dimmed = ready && !matches && !isHovered;
          const originX = isHovered ? hovered.x : 50;
          const originY = isHovered ? hovered.y : 50;
          const delay =
            colored && !isHovered && rank !== undefined
              ? Math.min(rank * 60, 360)
              : 0;

          return (
            <div
              key={`${item.src}-${index}`}
              role="listitem"
              className={cx(
                "min-w-0 w-[82vw] max-w-[320px] shrink-0 snap-center sm:w-auto sm:max-w-none sm:shrink",
                !showAll && index >= 6 && "hidden",
              )}
            >
              <button
                type="button"
                data-photo={index}
                data-category={category}
                data-colored={colored || undefined}
                aria-label={`${item.title ?? item.alt ?? `Project ${index + 1}`}, ${category}. Tampilkan kategori ${category}`}
                onClick={() => choose(category, true)}
                onPointerEnter={(event) => {
                  if (event.pointerType === "touch") return;
                  const rect = event.currentTarget.getBoundingClientRect();
                  setHovered({
                    index,
                    x: ((event.clientX - rect.left) / rect.width) * 100,
                    y: ((event.clientY - rect.top) / rect.height) * 100,
                  });
                }}
                onPointerLeave={() =>
                  setHovered((current) => (current?.index === index ? null : current))
                }
                onFocus={() => setHovered({ index, x: 50, y: 50 })}
                onBlur={() =>
                  setHovered((current) => (current?.index === index ? null : current))
                }
                className={cx(
                  "group relative block w-full overflow-hidden rounded-2xl bg-muted text-left outline-none cursor-pointer",
                  "transition-all duration-500 ease-out",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  dimmed && "opacity-35 scale-[0.98] grayscale hover:opacity-90 hover:scale-100 hover:grayscale-0",
                  !dimmed && "shadow-xs hover:shadow-lg hover:-translate-y-0.5",
                )}
                style={{
                  aspectRatio: aspect,
                }}
              >
                {/* Base Image (dimmed or monochrome preview) */}
                <img
                  src={item.src}
                  alt={item.alt ?? item.title ?? ""}
                  draggable={false}
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ filter: "grayscale(0.85) contrast(1.05)" }}
                />

                {/* Blooming colored layer with circular clip-path transition */}
                <img
                  src={item.src}
                  alt=""
                  aria-hidden
                  data-bloom
                  draggable={false}
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{
                    clipPath: `circle(${colored ? 150 : 0}% at ${originX}% ${originY}%)`,
                    transition: reducedMotion
                      ? "none"
                      : colored
                        ? `clip-path ${bloomDuration}ms cubic-bezier(0.22, 0.8, 0.2, 1) ${delay}ms, transform 700ms ease-out`
                        : `clip-path ${Math.round(bloomDuration * 0.5)}ms cubic-bezier(0.4, 0, 1, 1), transform 700ms ease-out`,
                  }}
                />

                {/* Category Badge */}
                <div className="absolute left-3 top-3 z-10">
                  <span
                    className={cx(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide backdrop-blur-md shadow-xs border transition-all duration-300",
                      colored
                        ? "bg-background/85 text-foreground border-border/60"
                        : "bg-black/50 text-white/80 border-white/10 opacity-70",
                    )}
                  >
                    {category}
                  </span>
                </div>

                {/* Title & Overlay gradient */}
                {item.title && (
                  <div
                    className={cx(
                      "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3.5 pb-3 pt-10 text-white transition-opacity duration-300",
                      colored ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                    )}
                  >
                    <p className="text-xs sm:text-sm font-semibold tracking-tight line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-white/75 mt-0.5 font-normal">
                      {category}
                    </p>
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Show More / Show Less Button */}
      {items.length > 6 && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 hover:bg-muted px-6 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:border-border cursor-pointer shadow-xs hover:shadow-sm"
          >
            <span>{showAll ? "Tampilkan Lebih Sedikit" : "Show More"}</span>
            {showAll ? (
              <ChevronUp className="size-4 transition-transform group-hover:-translate-y-0.5" />
            ) : (
              <ChevronDown className="size-4 transition-transform group-hover:translate-y-0.5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default ProjectFilterGallery;
