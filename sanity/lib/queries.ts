import { client } from "./client";

export const HOME_PAGE_QUERY = `{
  "hero": *[_type == "hero"][0]{
    speed,
    images[]{
      _key,
      alt,
      image,
      externalSrc
    }
  },
  "videoShowcase": *[_type == "videoShowcase"][0]{
    items[]{
      _key,
      title,
      description,
      category,
      duration,
      videoSrc,
      thumbnail,
      externalThumbnail
    }
  },
  "gallery": *[_type == "gallery"][0]{
    items[]{
      _key,
      title,
      category,
      image,
      externalSrc,
      alt
    }
  },
  "coverflow": *[_type == "coverflow"][0]{
    slides[]{
      _key,
      title,
      subtitle,
      color,
      image {
        ...,
        asset-> {
          _id,
          url,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
        }
      },
      externalSrc,
      alt,
      meta[]{
        _key,
        label,
        value
      }
    }
  },
  "bentoGallery": *[_type == "bentoGallery"][0]{
    items[]{
      _key,
      title,
      desc,
      image,
      externalSrc,
      span
    }
  },
  "faq": *[_type == "faq"][0]{
    categories[]{
      _key,
      key,
      title,
      items[]{
        _key,
        question,
        answer
      }
    }
  },
  "contact": *[_type == "contact"][0]{
    phoneNumber,
    responseHours,
    studioBase
  }
}`;

export interface HomePageSanityData {
  hero?: {
    title?: string;
    subtitle?: string;
    speed?: number;
    images?: Array<{
      _key?: string;
      alt?: string;
      image?: any;
      externalSrc?: string;
    }>;
  } | null;
  videoShowcase?: {
    title?: string;
    description?: string;
    items?: Array<{
      _key?: string;
      title?: string;
      description?: string;
      category?: string;
      duration?: string;
      videoSrc?: string;
      thumbnail?: any;
      externalThumbnail?: string;
    }>;
  } | null;
  gallery?: {
    title?: string;
    description?: string;
    items?: Array<{
      _key?: string;
      title?: string;
      category?: string;
      image?: any;
      externalSrc?: string;
      alt?: string;
    }>;
  } | null;
  coverflow?: {
    title?: string;
    description?: string;
    slides?: Array<{
      _key?: string;
      title?: string;
      subtitle?: string;
      color?: string;
      image?: any;
      externalSrc?: string;
      alt?: string;
      meta?: Array<{
        _key?: string;
        label?: string;
        value?: string;
      }>;
    }>;
  } | null;
  bentoGallery?: {
    title?: string;
    description?: string;
    items?: Array<{
      _key?: string;
      title?: string;
      desc?: string;
      image?: any;
      externalSrc?: string;
      span?: string;
    }>;
  } | null;
  faq?: {
    title?: string;
    categories?: Array<{
      _key?: string;
      key?: string;
      title?: string;
      items?: Array<{
        _key?: string;
        question?: string;
        answer?: string;
      }>;
    }>;
  } | null;
  contact?: {
    title?: string;
    subtitle?: string;
    phoneNumber?: string;
    responseHours?: string;
    studioBase?: string;
  } | null;
}

/**
 * Fetches all landing page data from Sanity in a single round-trip.
 * If Sanity query fails or is empty, returns null so blocks fallback seamlessly.
 */
export async function getHomePageData(): Promise<HomePageSanityData | null> {
  try {
    const data = await client.fetch<HomePageSanityData>(
      HOME_PAGE_QUERY,
      {},
      {
        next: { revalidate: 30 },
      }
    );
    return data;
  } catch (error) {
    console.warn(
      "Warning: Could not fetch home page data from Sanity. Using fallback dummy data.",
      error
    );
    return null;
  }
}
