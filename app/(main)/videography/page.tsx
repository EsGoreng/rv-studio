import { Metadata } from "next";
import { getVideographyPageData } from "@/sanity/lib/queries";
import { VideographyClient } from "@/components/blocks/videography-client";
import { siteConfig } from "@/lib/site";
import { getBreadcrumbSchema, getServiceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Videografi Sinematik & Produksi Video Acara | RV Studio",
  description:
    "Eksplorasi portofolio produksi video sinematik RV Studio: profil sekolah & instansi, aftermovie festival/pensi, short film, dan commercial teaser dengan standar 4K dan color grading profesional.",
  alternates: {
    canonical: "/videography",
  },
  openGraph: {
    title: "Videografi Sinematik & Produksi Video Acara | RV Studio",
    description:
      "Produksi video sinematik berkualitas tinggi untuk sekolah, instansi, dan acara kreatif oleh RV Studio Kuningan.",
    url: `${siteConfig.url}/videography`,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Videography Showcase RV Studio",
      },
    ],
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
