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
      videoSrc,
      thumbnail,
      externalThumbnail
    }
  },
  "showcaseGallery": coalesce(*[_type == "showcaseGallery"][0], *[_type == "gallery"][0]){
    items[]{
      _key,
      title,
      category,
      image,
      externalSrc,
      alt
    }
  },
  "gallery": coalesce(*[_type == "gallery"][0], *[_type == "showcaseGallery"][0]){
    items[]{
      _key,
      title,
      category,
      image,
      "alt": title
    }
  },
  "coverflow": *[_type == "coverflow"][0]{
    slides[]{
      _key,
      title,
      subtitle,
      description,
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
      "pdfUrl": coalesce(pdfFile.asset->url, pdfUrl),
      password,
      alt,
      meta[]{
        _key,
        label,
        value
      }
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
    studioBase
  },
  "trustedBy": *[_type == "client"][0]{
    items[]{
      _key,
      name,
      logo,
      externalLogoUrl
    }
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
      videoSrc?: string;
      thumbnail?: any;
      externalThumbnail?: string;
    }>;
  } | null;
  showcaseGallery?: {
    items?: Array<{
      _key?: string;
      title?: string;
      category?: string;
      image?: any;
      externalSrc?: string;
      alt?: string;
    }>;
  } | null;
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
  coverflow?: {
    title?: string;
    description?: string;
    slides?: Array<{
      _key?: string;
      title?: string;
      subtitle?: string;
      description?: string;
      color?: string;
      pdfUrl?: string;
      password?: string;
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
    studioBase?: string;
  } | null;
  trustedBy?: {
    items?: Array<{
      _key?: string;
      name?: string;
      logo?: any;
      externalLogoUrl?: string;
    }>;
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

export const VIDEOGRAPHY_PAGE_QUERY = `{
  "videoShowcase": *[_type == "videoShowcase"][0]{
    title,
    description,
    items[]{
      _key,
      title,
      description,
      category,
      videoSrc,
      thumbnail,
      externalThumbnail
    }
  }
}`;

export interface VideographyPageSanityData {
  videoShowcase?: HomePageSanityData["videoShowcase"];
}

/**
 * Fetches videography page data from Sanity.
 */
export async function getVideographyPageData(): Promise<VideographyPageSanityData | null> {
  try {
    const data = await client.fetch<VideographyPageSanityData>(
      VIDEOGRAPHY_PAGE_QUERY,
      {},
      { next: { revalidate: 30 } }
    );
    return data;
  } catch (error) {
    console.warn(
      "Warning: Could not fetch videography page data from Sanity. Using fallback.",
      error
    );
    return null;
  }
}

export const PHOTOGRAPHY_PAGE_QUERY = `{
  "gallery": coalesce(*[_type == "gallery"][0], *[_type == "showcaseGallery"][0]){
    items[]{
      _key,
      title,
      category,
      image,
      "alt": title
    }
  }
}`;

export interface PhotographyPageSanityData {
  gallery?: HomePageSanityData["gallery"];
}

/**
 * Fetches photography page data from Sanity.
 */
export async function getPhotographyPageData(): Promise<PhotographyPageSanityData | null> {
  try {
    const data = await client.fetch<PhotographyPageSanityData>(
      PHOTOGRAPHY_PAGE_QUERY,
      {},
      { next: { revalidate: 30 } }
    );
    return data;
  } catch (error) {
    console.warn(
      "Warning: Could not fetch photography page data from Sanity. Using fallback.",
      error
    );
    return null;
  }
}

export const YEARBOOK_PAGE_QUERY = `{
  "coverflow": *[_type == "coverflow"][0]{
    slides[]{
      _key,
      title,
      subtitle,
      description,
      "pdfUrl": coalesce(pdfFile.asset->url, pdfUrl),
      password,
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
  }
}`;

export interface YearbookPageSanityData {
  coverflow?: HomePageSanityData["coverflow"];
}

/**
 * Fetches yearbook page data from Sanity.
 */
export async function getYearbookPageData(): Promise<YearbookPageSanityData | null> {
  try {
    const data = await client.fetch<YearbookPageSanityData>(
      YEARBOOK_PAGE_QUERY,
      {},
      { next: { revalidate: 30 } }
    );
    return data;
  } catch (error) {
    console.warn(
      "Warning: Could not fetch yearbook page data from Sanity. Using fallback.",
      error
    );
    return null;
  }
}

export const CONTACT_QUERY = `*[_type == "contact"][0]{
  title,
  subtitle,
  phoneNumber,
  studioBase
}`;

export interface ContactSanityData {
  title?: string;
  subtitle?: string;
  phoneNumber?: string;
  studioBase?: string;
}

/**
 * Fetches contact information (WhatsApp phone number, studio base) from Sanity.
 */
export async function getContactData(): Promise<ContactSanityData | null> {
  try {
    const data = await client.fetch<ContactSanityData>(
      CONTACT_QUERY,
      {},
      { next: { revalidate: 30 } }
    );
    return data;
  } catch (error) {
    console.warn(
      "Warning: Could not fetch contact data from Sanity. Using fallback.",
      error
    );
    return null;
  }
}

