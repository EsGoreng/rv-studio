import { Metadata } from "next";
import { Hero } from "@/components/blocks/hero";
import { TrustedBySection } from "@/components/blocks/trusted-by";
import { FolderMenuSection } from "@/components/blocks/folder-menu-section";
import { AboutHeader } from "@/components/blocks/about-header";
import { AboutStory } from "@/components/blocks/about-story";
import { AboutCTA } from "@/components/blocks/about-cta";
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
      <Hero data={sanityData?.hero} />
      {/* <AboutHeader /> */}
      <AboutStory />
      <TrustedBySection data={sanityData?.trustedBy} />
      <FolderMenuSection data={sanityData} />
      <FAQSection data={sanityData?.faq} />
    </>
  );
}
