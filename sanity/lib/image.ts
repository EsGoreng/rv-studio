import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "../env";

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};

/**
 * Safely resolves an image from a Sanity image object or external fallback URL.
 */
export function resolveImageUrl(
  imageSource: any,
  fallbackUrl?: string
): string {
  if (imageSource?.asset) {
    try {
      return urlFor(imageSource).auto("format").fit("max").url();
    } catch {
      // ignore formatting errors and use fallback
    }
  }
  if (typeof imageSource === "string" && imageSource.trim().length > 0) {
    return imageSource;
  }
  return fallbackUrl || "";
}
