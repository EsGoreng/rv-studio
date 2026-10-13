import type { CoverflowSlide } from "@/components/ui/coverflow-carousel";

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=720&h=900&fit=crop&q=80&auto=format`;

export interface YearbookItem extends CoverflowSlide {
  id: string;
  institution: string;
  year: string;
  theme: string;
  description: string;
  totalPages: number;
  pdfUrl: string;
  coverFinish: string;
  highlights: string[];
}

export const SAMPLE_YEARBOOKS: YearbookItem[] = [
  {
    id: "adhirajasa-2024",
    title: "Adhirajasa 2024",
    subtitle: "SMA Negeri 1 Jakarta • 70th Diamond Jubilee",
    institution: "SMA Negeri 1 Jakarta",
    year: "2024",
    theme: "Heritage & Modern Resilience",
    description:
      "Karya kenangan monumental perayaan 70 tahun dengan sentuhan hard cover foil emas, layout editorial modern, dan feature shared-memories interaktif.",
    src: UNSPLASH("1544717305-2782549b5136"), // Elegant dark academic book
    alt: "Yearbook Adhirajasa 2024 - SMA Negeri 1 Jakarta",
    color: "#b45309", // Warm Gold Bronze
    pdfUrl: "/dflip/books/intro.pdf",
    totalPages: 168,
    coverFinish: "Hardcover Luxury with Gold Foil & Matte Velvet Lam",
    aspectRatio: 49 / 60,
    highlights: ["Embossed Hardcover", "150gsm Matte Art Paper", "AR Interactive Video", "Classroom Portfolios"],
    meta: [
      { label: "Tahun", value: "2024" },
      { label: "Edisi", value: "Diamond Jubilee" },
      { label: "Halaman", value: "168 Hal" },
      { label: "Format", value: "B5 Hardcover" },
    ],
  },
  {
    id: "arunika-2024",
    title: "Arunika 2024",
    subtitle: "Universitas Indonesia • Fakultas Teknik",
    institution: "Universitas Indonesia",
    year: "2024",
    theme: "The Dawn of Engineering Pioneers",
    description:
      "Dokumentasi perjalanan angkatan teknik dengan visual lanskap kampus sinematik, profil alumni terkurasi, dan infografis perjalanan akademis.",
    src: UNSPLASH("1532012164546-f432f2e3777a"), // Library / Green tones
    alt: "Yearbook Arunika 2024 - Fakultas Teknik UI",
    color: "#14532d", // Forest Emerald
    pdfUrl: "/dflip/books/intro.pdf",
    totalPages: 196,
    coverFinish: "Emerald Cloth Texture with Silver Holographic Stamping",
    aspectRatio: 49 / 60,
    highlights: ["Smyth Sewn Binding", "Full Color Offset Print", "Campus Aerial Photos", "Faculty Retrospective"],
    meta: [
      { label: "Tahun", value: "2024" },
      { label: "Edisi", value: "Faculty Chronicle" },
      { label: "Halaman", value: "196 Hal" },
      { label: "Format", value: "A4 Vertical" },
    ],
  },
  {
    id: "cakrawala-2023",
    title: "Cakrawala 2023",
    subtitle: "SMA Taruna Nusantara • Angkatan XXX",
    institution: "SMA Taruna Nusantara",
    year: "2023",
    theme: "Discipline, Brotherhood & Horizons",
    description:
      "Album angkatan dengan visual kontras tinggi, potret candid kegiatan lapangan militer, dan galeri memoribilia kehidupan asrama yang hangat.",
    src: UNSPLASH("1512820790803-83ca734da794"), // Deep Midnight Blue
    alt: "Yearbook Cakrawala 2023 - SMA Taruna Nusantara",
    color: "#1e3a8a", // Midnight Navy
    pdfUrl: "/dflip/books/intro.pdf",
    totalPages: 152,
    coverFinish: "Midnight Leatherette with Spot UV & Blind Deboss",
    aspectRatio: 49 / 60,
    highlights: ["Leatherette Hardcover", "Waterproof Lamination", "Expedition Photo Gallery", "Squadron Roll-Call"],
    meta: [
      { label: "Tahun", value: "2023" },
      { label: "Edisi", value: "Milestone 30" },
      { label: "Halaman", value: "152 Hal" },
      { label: "Format", value: "Square 25x25cm" },
    ],
  },
  {
    id: "mahakarya-2023",
    title: "Mahakarya 2023",
    subtitle: "Institut Seni Indonesia • Seni Rupa & Desain",
    institution: "Institut Seni Indonesia",
    year: "2023",
    theme: "Avant-Garde & Creative Resonance",
    description:
      "Desain yearbook bergaya art-book galeri seni rupa. Setiap halaman dirancang dengan eksplorasi tipografi ekspresif dan kurasi karya seni orisinal.",
    src: UNSPLASH("1497633762265-9d179a990aa6"), // Crimson Artistic
    alt: "Yearbook Mahakarya 2023 - Institut Seni Indonesia",
    color: "#701a75", // Deep Magenta Crimson
    pdfUrl: "/dflip/books/intro.pdf",
    totalPages: 140,
    coverFinish: "Soft-Touch Matte with Exposed Spine Swiss Binding",
    aspectRatio: 49 / 60,
    highlights: ["Swiss Exposed Spine", "Art Paper 170gsm", "Individual Portfolio spreads", "Metallic Pantones"],
    meta: [
      { label: "Tahun", value: "2023" },
      { label: "Edisi", value: "Art Anthology" },
      { label: "Halaman", value: "140 Hal" },
      { label: "Format", value: "A4 Special Landscape" },
    ],
  },
  {
    id: "lumina-2024",
    title: "Lumina 2024",
    subtitle: "Global International High School • Class of 2024",
    institution: "Global International School",
    year: "2024",
    theme: "Illuminating the Future Global Leaders",
    description:
      "Perpaduan fotografi portrait minimalis kontemporer, kutipan impian siswa, serta ringkasan event tahunan dari MUN hingga turnamen olahraga seni.",
    src: UNSPLASH("1507842229458-5776306166be"), // Warm Neutral Bookshelf
    alt: "Yearbook Lumina 2024 - Global International High School",
    color: "#334155", // Slate Charcoal
    pdfUrl: "/dflip/books/intro.pdf",
    totalPages: 180,
    coverFinish: "Minimalist Hardcover with Rose Gold Hotprint Stamping",
    aspectRatio: 49 / 60,
    highlights: ["Rose Gold Stamping", "Individual Student Quotes", "Sports & Arts Chronicles", "QR Code Video Link"],
    meta: [
      { label: "Tahun", value: "2024" },
      { label: "Edisi", value: "International Edition" },
      { label: "Halaman", value: "180 Hal" },
      { label: "Format", value: "B5 Luxury Hardcover" },
    ],
  },
];
