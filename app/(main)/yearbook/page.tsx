import { Metadata } from "next";
import { getYearbookPageData } from "@/sanity/lib/queries";
import { YearbookClient } from "@/components/blocks/yearbook-client";
import { siteConfig } from "@/lib/site";
import { getBreadcrumbSchema, getServiceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "RV Project Yearbook",
  description:
    "Pembuatan buku tahunan sekolah mulai dari konsep tema, sesi foto, cetak hardcover, sampai flipbook digital 3D interaktif.",
  alternates: {
    canonical: "/yearbook",
  },
  openGraph: {
    title: "RV Project Yearbook",
    description:
      "Pembuatan buku tahunan sekolah mulai dari konsep tema, sesi foto, cetak hardcover, sampai flipbook digital 3D interaktif.",
    url: `${siteConfig.url}/yearbook`,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "RV Project Yearbook",
      },
    ],
  },
};

export default async function YearbookPage() {
  const data = await getYearbookPageData();

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Beranda", path: "/" },
    { name: "Yearbook", path: "/yearbook" },
  ]);

  const service = getServiceSchema({
    name: "Jasa Pembuatan Buku Tahunan Sekolah (Yearbook Organizer)",
    description:
      "Layanan end-to-end produksi buku tahunan sekolah: photoshoot, concept design, offset printing, dan 3D interactive flipbook.",
    serviceType: "Yearbook Production",
    path: "/yearbook",
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [breadcrumbs, service],
  };

  return (
    <>
      <JsonLd data={structuredData} id="yearbook-schema" />
      <YearbookClient data={data} />
    </>
  );
}
