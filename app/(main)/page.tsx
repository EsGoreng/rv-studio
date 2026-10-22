import { Metadata } from "next";
import { Hero } from "@/components/blocks/hero";
import { TrustedBySection } from "@/components/blocks/trusted-by";
import { VideoShowcaseSection } from "@/components/blocks/video-showcase";
import { ShowcaseGallerySection } from "@/components/blocks/showcase-gallery-section";
import { CoverflowSection } from "@/components/blocks/coverflow-section";
import { FolderMenuSection } from "@/components/blocks/folder-menu-section";
import { FAQSection } from "@/components/blocks/faq";
import { getHomePageData } from "@/sanity/lib/queries";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "RV Project",
  description:
    "Layanan Jasa Videografi, Fotografi, dan Buku Tahunan Sekolah.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: siteConfig.name,
    title: "RV Project",
    description:
      "Layanan Jasa Videografi, Fotografi, dan Buku Tahunan Sekolah.",
    url: siteConfig.url,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "RV Project",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RV Project",
    description:
      "Layanan untuk pembuatan buku tahunan sekolah, foto wisuda, dan lainnya di Jawa Barat.",
    images: [siteConfig.ogImage],
  },
};

export default async function Home() {
  const sanityData = await getHomePageData();

  return (
    <>
      <Hero data={sanityData?.hero} gallery={sanityData?.showcaseGallery} />
      <TrustedBySection data={sanityData?.trustedBy} />
      <FolderMenuSection />
      {/* <VideoShowcaseSection data={sanityData?.videoShowcase} />
      <ShowcaseGallerySection data={sanityData?.showcaseGallery} />
      <CoverflowSection data={sanityData?.coverflow} /> */}
      <FAQSection data={sanityData?.faq} />
    </>
  );
}
