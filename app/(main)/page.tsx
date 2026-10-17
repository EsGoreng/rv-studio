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
  title: "RV Project",
  description:
    "Studio visual di Jawa Barat untuk pembuatan buku tahunan sekolah, foto wisuda, dan produksi video kreatif.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "RV Project",
    description:
      "Studio visual di Jawa Barat untuk pembuatan buku tahunan sekolah, foto wisuda, dan produksi video kreatif.",
    url: siteConfig.url,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "RV Project",
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
