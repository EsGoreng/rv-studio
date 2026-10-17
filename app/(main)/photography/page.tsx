import { Metadata } from "next";
import { getPhotographyPageData } from "@/sanity/lib/queries";
import { PhotographyClient } from "@/components/blocks/photography-client";
import { siteConfig } from "@/lib/site";
import { getBreadcrumbSchema, getServiceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "RV Project Photography",
  description:
    "Sesi foto untuk wisuda personal dan rombongan, foto studio, potret editorial, dan dokumentasi acara.",
  alternates: {
    canonical: "/photography",
  },
  openGraph: {
    title: "RV Project Photography",
    description:
      "Sesi foto untuk wisuda personal dan rombongan, foto studio, potret editorial, dan dokumentasi acara.",
    url: `${siteConfig.url}/photography`,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "RV Project Photography",
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
