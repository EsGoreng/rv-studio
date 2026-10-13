import { Metadata } from "next";
import { getYearbookPageData } from "@/sanity/lib/queries";
import { YearbookClient } from "@/components/blocks/yearbook-client";

export const metadata: Metadata = {
  title: "Yearbook | RV Studio",
  description:
    "Koleksi album kenangan sekolah & universitas karya RV Studio. Eksplorasi preview lembaran PDF dengan teknologi 3D Flipbook interaktif dan coverflow realistis.",
};

export default async function YearbookPage() {
  const data = await getYearbookPageData();

  return <YearbookClient data={data} />;
}
