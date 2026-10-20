import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "../env";

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  fit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
}

/**
 * Optimizes external image URLs (such as Unsplash) with query parameters for width, quality, and format.
 */
function optimizeExternalUrl(
  url: string,
  options?: ImageOptimizationOptions
): string {
  if (!url || !options) return url;
  if (url.includes("images.unsplash.com")) {
    try {
      const parsed = new URL(url);
      if (options.width) parsed.searchParams.set("w", String(options.width));
      if (options.height) parsed.searchParams.set("h", String(options.height));
      if (options.quality) parsed.searchParams.set("q", String(options.quality));
      parsed.searchParams.set("auto", "format");
      return parsed.toString();
    } catch {
      return url;
    }
  }
  return url;
}

/**
 * Safely resolves an image from a Sanity image object or external fallback URL,
 * applying size and quality optimizations for browser performance.
 */
export function resolveImageUrl(
  imageSource: any,
  fallbackUrl?: string,
  options?: ImageOptimizationOptions
): string {
  if (imageSource?.asset) {
    try {
      let builderInstance = urlFor(imageSource)
        .auto("format")
        .fit(options?.fit || "max");

      if (options?.width) builderInstance = builderInstance.width(options.width);
      if (options?.height) builderInstance = builderInstance.height(options.height);
      if (options?.quality) builderInstance = builderInstance.quality(options.quality);

      return builderInstance.url();
    } catch {
      // ignore formatting errors and use fallback
    }
  }
  if (typeof imageSource === "string" && imageSource.trim().length > 0) {
    return optimizeExternalUrl(imageSource, options);
  }
  return optimizeExternalUrl(fallbackUrl || "", options);
}

