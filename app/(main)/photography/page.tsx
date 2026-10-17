import { Metadata } from "next";
import { getPhotographyPageData } from "@/sanity/lib/queries";
import { PhotographyClient } from "@/components/blocks/photography-client";
import { siteConfig } from "@/lib/site";
import { getBreadcrumbSchema, getServiceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Fotografi Wisuda, Studio & Editorial Kreatif | RV Studio",
  description:
    "Koleksi fotografi beresolusi tinggi karya RV Studio: sesi foto wisuda personal & grup, potret editorial, katalog brand, dan dokumentasi momen spesial dengan arahan seni visual terbaik.",
  alternates: {
    canonical: "/photography",
  },
  openGraph: {
    title: "Fotografi Wisuda, Studio & Editorial Kreatif | RV Studio",
    description:
      "Sesi foto kreatif, portrait, wisuda, dan editorial berkualitas tinggi oleh RV Studio.",
    url: `${siteConfig.url}/photography`,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Photography Showcase RV Studio",
      },
    ],
  },
};

export default async function PhotographyPage() {
  const data = await getPhotographyPageData();

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Beranda", path: "/" },
    { name: "Photography", path: "/photography" },
  ]);

  const service = getServiceSchema({
    name: "Jasa Fotografi Profesional & Wisuda",
    description:
      "Layanan sesi fotografi studio dan outdoor untuk wisuda, potret personal, katalog komersial, dan fashion editorial.",
    serviceType: "Professional Photography",
    path: "/photography",
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [breadcrumbs, service],
  };

  return (
    <>
      <JsonLd data={structuredData} id="photography-schema" />
      <PhotographyClient data={data} />
    </>
  );
}
