import { Metadata } from "next";
import { Hero } from "@/components/blocks/hero";
import { TrustedBySection } from "@/components/blocks/trusted-by";
import { VideoShowcaseSection } from "@/components/blocks/video-showcase";
import { ShowcaseGallerySection } from "@/components/blocks/showcase-gallery-section";
import { CoverflowSection } from "@/components/blocks/coverflow-section";
import { FAQSection } from "@/components/blocks/faq";
import { getHomePageData } from "@/sanity/lib/queries";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "RV Studio — Creative Visual Production & Yearbook House",
  description:
    "Creative visual production house spesialis pembuatan buku tahunan sekolah (yearbook organizer), fotografi wisuda, dan videografi sinematik berbasis di Kuningan, Jawa Barat.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "RV Studio — Creative Visual Production & Yearbook House",
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "RV Studio Portfolio & Showcase",
      },
    ],
  },
};

export default async function Home() {
  const sanityData = await getHomePageData();

  return (
    <>
      <Hero data={sanityData?.hero} />
      <VideoShowcaseSection data={sanityData?.videoShowcase} />
      <ShowcaseGallerySection data={sanityData?.showcaseGallery} />
      <CoverflowSection data={sanityData?.coverflow} />
      <TrustedBySection data={sanityData?.trustedBy} />
      <FAQSection data={sanityData?.faq} />
    </>
  );
}
