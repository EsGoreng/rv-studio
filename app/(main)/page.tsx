import { Hero } from "@/components/blocks/hero";
import { VideoShowcaseSection } from "@/components/blocks/video-showcase";
import { GallerySection } from "@/components/blocks/gallery-section";
import { CoverflowSection } from "@/components/blocks/coverflow-section";
import { FAQSection } from "@/components/blocks/faq";
import BentoGallerySection from "@/components/blocks/bento-gallery-section";
import { getHomePageData } from "@/sanity/lib/queries";


export default async function Home() {
  const sanityData = await getHomePageData();

  return (
    <>
      <Hero data={sanityData?.hero} />
      <VideoShowcaseSection data={sanityData?.videoShowcase} />
      <GallerySection data={sanityData?.gallery} />
      <CoverflowSection data={sanityData?.coverflow} />
      {/* <BentoGallerySection data={sanityData?.bentoGallery} /> */}
      <FAQSection data={sanityData?.faq} />
    </>
  );
}
