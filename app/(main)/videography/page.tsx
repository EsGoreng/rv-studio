import { getVideographyPageData } from "@/sanity/lib/queries";
import { VideographyClient } from "@/components/blocks/videography-client";

export const metadata = {
  title: "Videography | RV Studio",
  description:
    "Eksplorasi seluruh koleksi karya produksi visual dan videografi dari RV Studio dengan standar sinematik berkualitas tinggi.",
};

export default async function VideographyPage() {
  const data = await getVideographyPageData();

  return <VideographyClient data={data} />;
}
