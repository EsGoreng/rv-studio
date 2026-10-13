import { Hero } from "@/components/blocks/hero";
import { VideoShowcaseSection } from "@/components/blocks/video-showcase";
import { ShowcaseGallerySection } from "@/components/blocks/showcase-gallery-section";
import { CoverflowSection } from "@/components/blocks/coverflow-section";
import { FAQSection } from "@/components/blocks/faq";
import { getHomePageData } from "@/sanity/lib/queries";

export default async function Home() {
  const sanityData = await getHomePageData();

  return (
    <>
      <Hero data={sanityData?.hero} />
      <VideoShowcaseSection data={sanityData?.videoShowcase} />
      <ShowcaseGallerySection data={sanityData?.showcaseGallery} />
      <CoverflowSection data={sanityData?.coverflow} />
      <FAQSection data={sanityData?.faq} />
    </>
  );
}
