import { Hero } from "@/components/blocks/hero";
import { VideoShowcaseSection } from "@/components/blocks/video-showcase";
import { GallerySection } from "@/components/blocks/gallery-section";
import { CoverflowSection } from "@/components/blocks/coverflow-section";
import { FAQSection } from "@/components/blocks/faq";
import { ContactSection } from "@/components/blocks/contact";
import BentoGallerySection from "@/components/blocks/bento-gallery-section";

export default function Home() {
  return (
    <>
      <Hero />
      <VideoShowcaseSection />
      <GallerySection />
      <CoverflowSection />
      <FAQSection />
      <ContactSection />
    </>
  );
}

