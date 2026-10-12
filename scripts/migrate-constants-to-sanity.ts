import fs from "fs";
import path from "path";
import { HERO_IMAGES } from "../constants/hero";
import { SAMPLE_PLAYLIST } from "../constants/video-playlist";
import { GALLERY_PHOTOS } from "../constants/gallery";
import { COVERFLOW_SLIDES } from "../constants/coverflow";
import { FAQ_CATEGORIES, FAQ_DATA } from "../constants/faq";
import { BENTO_GALLERY_ITEMS } from "../constants/bento-gallery";

/**
 * Migration Script: Transforms data from constants/ folder into deterministic Sanity documents.
 * Generates an NDJSON file ready for import via Sanity CLI:
 *   npx sanity dataset import sanity-migration-export.ndjson <dataset> --replace
 */
export function buildSanityDocuments() {
  const documents = [
    // 1. Hero Section
    {
      _id: "hero",
      _type: "hero",
      title: "RV Project.",
      subtitle:
        "Photography, videography, and yearbook production crafted with high aesthetic fidelity to turn fleeting moments into enduring memories.",
      speed: 8,
      images: HERO_IMAGES.map((img, i) => ({
        _key: `hero-img-${i + 1}`,
        alt: img.alt,
        externalSrc: img.src,
      })),
    },

    // 2. Video Showcase Section
    {
      _id: "videoShowcase",
      _type: "videoShowcase",
      title: "Featured Cinematic Works",
      description:
        "Explore our latest videography, yearbook documentaries, and event highlight productions.",
      items: SAMPLE_PLAYLIST.map((item, i) => ({
        _key: `video-${item.id || i + 1}`,
        title: item.title,
        description: item.description,
        category: item.category || "Profil Instansi",
        duration: item.duration || "YouTube",
        videoSrc: item.videoSrc,
        externalThumbnail: item.thumbnail,
      })),
    },

    // 3. Project Gallery Section
    {
      _id: "gallery",
      _type: "gallery",
      title: "Project Gallery",
      description:
        "Eksplorasi portfolio karya dokumentasi visual, portraiture kreatif, dan produksi tahunan kami berdasarkan kategori.",
      items: GALLERY_PHOTOS.map((photo, i) => ({
        _key: `photo-${i + 1}`,
        title: photo.title,
        category: photo.category,
        externalSrc: `https://images.unsplash.com/${photo.id}?w=720&h=576&fit=crop&q=80&auto=format`,
        alt: photo.title,
      })),
    },

    // 4. Coverflow 3D Yearbook Section
    {
      _id: "coverflow",
      _type: "coverflow",
      title: "Yearbook",
      description:
        "Flip through our 3D coverflow showcase of yearbook prints, monographs, and commemorative albums.",
      slides: COVERFLOW_SLIDES.map((slide, i) => ({
        _key: `slide-${i + 1}`,
        title: slide.title,
        subtitle: slide.subtitle,
        color: slide.color,
        externalSrc: slide.src,
        alt: slide.alt,
        meta: (slide.meta || []).map((m, mIdx) => ({
          _key: `meta-${mIdx + 1}`,
          label: m.label,
          value: m.value,
        })),
      })),
    },

    // 5. Bento Gallery Section
    {
      _id: "bentoGallery",
      _type: "bentoGallery",
      title: "Curated Bento Moments",
      description:
        "Koleksi sorotan visual terbaik kami. Geser (drag) ke samping untuk menjelajah, dan klik pada gambar untuk tampilan resolusi penuh.",
      items: BENTO_GALLERY_ITEMS.map((item) => ({
        _key: `bento-${item.id}`,
        title: item.title,
        desc: item.desc,
        externalSrc: item.url,
        span: item.span,
      })),
    },

    // 6. FAQ Section
    {
      _id: "faq",
      _type: "faq",
      title: "Frequently Asked Questions",
      categories: Object.entries(FAQ_CATEGORIES).map(([key, label], catIdx) => ({
        _key: `faq-cat-${catIdx + 1}`,
        key,
        title: label,
        items: (FAQ_DATA[key] || []).map((faqItem, itemIdx) => ({
          _key: `faq-item-${catIdx + 1}-${itemIdx + 1}`,
          question: faqItem.question,
          answer: faqItem.answer,
        })),
      })),
    },

    // 7. Contact Section
    {
      _id: "contact",
      _type: "contact",
      title: "Contact Via Whatsapp",
      subtitle:
        "Punya rencana project buku tahunan, photoshoot kreatif, atau videography komersial? Ceritakan ide Anda langsung ke tim kami.",
      phoneNumber: "6281234567890",
      responseHours: "Senin - Sabtu (09.00 - 21.00 WIB)",
      studioBase: "Indonesia · On-location & Studio",
    },
  ];

  return documents;
}

export function generateNDJSONFile() {
  const docs = buildSanityDocuments();
  const ndjson = docs.map((doc) => JSON.stringify(doc)).join("\n");
  const outputPath = path.resolve(process.cwd(), "sanity-migration-export.ndjson");
  fs.writeFileSync(outputPath, ndjson, "utf-8");
  console.log(`✅ Successfully generated Sanity NDJSON export: ${outputPath}`);
  console.log(`To import into Sanity, run:`);
  console.log(`npx sanity dataset import sanity-migration-export.ndjson <dataset> --replace`);
}

generateNDJSONFile();
