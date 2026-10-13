"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gallery, GalleryGrid, GalleryImage } from "@/components/ui/shared-element-gallery";
import { PHOTOGRAPHY_ITEMS, type PhotographyItem } from "@/constants/photography";
import { resolveImageUrl } from "@/sanity/lib/image";
import { DitheredHeader } from "@/components/ui/dithered-grid";

export interface PhotographyClientProps {
  data?: {
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
  } | null;
}

export function PhotographyClient({ data }: PhotographyClientProps) {
  // Normalize items from Sanity or fall back to curated items
  const allItems: PhotographyItem[] = React.useMemo(() => {
    const rawItems = data?.gallery?.items;
    if (rawItems && rawItems.length > 0) {
      return rawItems.map((item, index) => {
        const fallback = PHOTOGRAPHY_ITEMS[index % PHOTOGRAPHY_ITEMS.length];
        const src = resolveImageUrl(
          item.image,
          item.externalSrc || fallback?.src
        );

        return {
          id: item._key || `photo-${index + 1}`,
          title: item.title || fallback?.title || `Photo ${index + 1}`,
          category: (item.category as PhotographyItem["category"]) || fallback?.category || "Portrait",
          src,
          alt: item.alt || item.title || fallback?.alt || "RV Studio Photography",
        };
      });
    }

    return PHOTOGRAPHY_ITEMS;
  }, [data?.gallery?.items]);

  // Extract unique categories
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    allItems.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ["All", ...Array.from(set)];
  }, [allItems]);

  const [activeCategory, setActiveCategory] = React.useState("All");

  const filteredItems = React.useMemo(() => {
    if (activeCategory === "All") return allItems;
    return allItems.filter((item) => item.category === activeCategory);
  }, [allItems, activeCategory]);

  const title = "Photograph";

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-6 sm:pt-10 pb-20 selection:bg-neutral-800 selection:text-white">
      {/* Background Subtle Gradient Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary/5 via-transparent to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section with Dithered Grid */}
        <DitheredHeader gradientHeight="120%"
          fade="bottom"
          accent="#d4d4d8"
          className="mb-12 sm:mb-16 py-8 sm:py-12 px-4 rounded-3xl border border-border/40 bg-card/30 backdrop-blur-sm"
        >
          <div className="space-y-6 text-center flex flex-col items-center">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                {title}
              </h1>
            </div>

            {/* Category Tabs */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 text-xs sm:text-sm rounded-full font-medium transition-all duration-200 cursor-pointer ${isActive
                      ? "bg-foreground text-background shadow-md scale-[1.02]"
                      : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </DitheredHeader>

        {/* Gallery Content with Shared Element Transition */}
        <Gallery>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <GalleryGrid>
                {filteredItems.map((image) => (
                  <GalleryImage
                    key={image.id}
                    id={image.id}
                    src={image.src}
                    alt={image.alt || image.title}
                    title={image.title}
                    category={image.category}
                  />
                ))}
              </GalleryGrid>
            </motion.div>
          </AnimatePresence>
        </Gallery>
      </div>
    </div>
  );
}

export default PhotographyClient;
