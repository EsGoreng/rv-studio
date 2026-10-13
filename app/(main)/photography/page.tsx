import { Metadata } from "next";
import { getPhotographyPageData } from "@/sanity/lib/queries";
import { PhotographyClient } from "@/components/blocks/photography-client";

export const metadata: Metadata = {
  title: "Photography | RV Studio",
  description:
    "Koleksi visual photography & curated spaces karya RV Studio. Eksplorasi foto resolusi tinggi dengan transisi shared-element yang memukau.",
};

export default async function PhotographyPage() {
  const data = await getPhotographyPageData();

  return <PhotographyClient data={data} />;
}
