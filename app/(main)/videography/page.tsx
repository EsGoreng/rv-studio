import { Metadata } from "next";
import { getVideographyPageData } from "@/sanity/lib/queries";
import { VideographyClient } from "@/components/blocks/videography-client";
import { siteConfig } from "@/lib/site";
import { getBreadcrumbSchema, getServiceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "RV Project Videography",
  description:
    "Produksi video untuk profil sekolah, aftermovie acara, film pendek, dan video promosi.",
  alternates: {
    canonical: "/videography",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: siteConfig.name,
    title: "RV Project Videography",
    description:
      "Produksi video untuk profil sekolah, aftermovie acara, film pendek, dan video promosi.",
    url: `${siteConfig.url}/videography`,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "RV Project Videography",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RV Project Videography",
    description:
      "Produksi video untuk profil sekolah, aftermovie acara, film pendek, dan video promosi.",
    images: [siteConfig.ogImage],
  },
};

export default async function VideographyPage() {
  const data = await getVideographyPageData();

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Beranda", path: "/" },
    { name: "Videography", path: "/videography" },
  ]);

  const service = getServiceSchema({
    name: "Jasa Videografi Sinematik & Dokumentasi Video",
    description:
      "Produksi video sinematik untuk aftermovie event, company & school profile, dokumenter, dan teaser promosi.",
    serviceType: "Cinematic Videography Production",
    path: "/videography",
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [breadcrumbs, service],
  };

  return (
    <>
      <JsonLd data={structuredData} id="videography-schema" />
      <VideographyClient data={data} />
    </>
  );
}
