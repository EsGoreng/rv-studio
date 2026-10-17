export const siteConfig = {
  name: "RV Project",
  shortName: "RV Project",
  legalName: "RV Project Visual Production",
  description:
    "Jasa pembuatan buku tahunan sekolah, foto wisuda, dan produksi video kreatif di Jawa Barat.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://rvproject.id",
  ogImage: "/og-image.png",
  studioBase: "Kuningan, Jawa Barat, Indonesia",
  telephone: "+6282216892403",
  displayPhone: "0822-1689-2403",
  whatsappUrl: "https://wa.me/6282216892403",
  socials: {
    instagram: "https://www.instagram.com/rvproject.77",
  },
  keywords: [
    "Buku Tahunan Sekolah",
    "Yearbook Organizer",
    "RV Project",
    "Vendor Buku Kenangan SMA",
    "Vendor Buku Tahunan Kuningan",
    "Vendor Buku Tahunan Cirebon",
    "Vendor Yearbook Jawa Barat",
    "Fotografi Wisuda",
    "Fotografer Kuningan",
    "Videografi Sinematik",
    "3D Flipbook Yearbook",
    "Visual Production House",
    "Commercial Video Teaser",
    "Dokumentasi Acara Sekolah",
  ],
  author: {
    name: "RV Project Team",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://rvproject.id",
  },
};

export type SiteConfig = typeof siteConfig;
