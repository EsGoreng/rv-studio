import { Metadata } from "next";
import { getYearbookPageData } from "@/sanity/lib/queries";
import { YearbookClient } from "@/components/blocks/yearbook-client";
import { siteConfig } from "@/lib/site";
import { getBreadcrumbSchema, getServiceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Buku Tahunan Sekolah (Yearbook Organizer) | RV Studio",
  description:
    "Layanan pembuatan buku tahunan sekolah & universitas terlengkap oleh RV Studio. Konsep tema kreatif, sesi photoshoot terarah, cetak hardcover premium, dan bonus digital 3D flipbook interaktif berpassword.",
  alternates: {
    canonical: "/yearbook",
  },
  openGraph: {
    title: "Buku Tahunan Sekolah & Album Kenangan | RV Studio",
    description:
      "Vendor buku tahunan sekolah terpercaya di Kuningan & Jawa Barat. Cetak premium dengan teknologi digital 3D flipbook.",
    url: `${siteConfig.url}/yearbook`,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Yearbook RV Studio",
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
