const getBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://rvproject.id";
};

export const siteConfig = {
  name: "RV Project",
  shortName: "RV Project",
  legalName: "RV Project",
  description:
    "Layanan untuk videografi, foto wisuda, dan pembuatan buku tahunan sekolah di Jawa Barat.",
  url: getBaseUrl(),
  ogImage: "/og-image.png",
  studioBase: "Kuningan, Jawa Barat, Indonesia",
  telephone: "+6282216892403",
  displayPhone: "0822-1689-2403",
  whatsappUrl: "https://wa.me/6282216892403",
  socials: {
    instagram: "https://www.instagram.com/rvproject.77",
  },
  keywords: [
    // ─── Core service keywords ───
    "Buku Tahunan Sekolah",
    "Yearbook Organizer",
    "RV Project",
    "Vendor Buku Kenangan SMA",
    "Vendor Buku Kenangan SMP",
    "Fotografi Wisuda",
    "Videografi Sinematik",
    "3D Flipbook Yearbook",
    "Visual Production House",
    "Commercial Video Teaser",
    "Dokumentasi Acara Sekolah",
    "Foto Wisuda Outdoor",
    "Foto Wisuda Studio",
    "Aftermovie Sekolah",
    "Video Profil Sekolah",
    "Desain Buku Tahunan",
    "Cetak Buku Tahunan",
    // ─── Ciayumajakuning ───
    "Vendor Buku Tahunan Kuningan",
    "Vendor Buku Tahunan Cirebon",
    "Vendor Buku Tahunan Majalengka",
    "Vendor Buku Tahunan Indramayu",
    "Fotografer Kuningan",
    "Fotografer Cirebon",
    "Fotografer Majalengka",
    "Videografer Kuningan",
    "Videografer Cirebon",
    "Foto Wisuda Kuningan",
    "Foto Wisuda Cirebon",
    "Foto Wisuda Majalengka",
    // ─── Jawa Barat lainnya ───
    "Vendor Yearbook Jawa Barat",
    "Vendor Buku Tahunan Bandung",
    "Vendor Buku Tahunan Subang",
    "Vendor Buku Tahunan Sumedang",
    "Vendor Buku Tahunan Garut",
    "Vendor Buku Tahunan Tasikmalaya",
    "Vendor Buku Tahunan Ciamis",
    "Vendor Buku Tahunan Karawang",
    "Vendor Buku Tahunan Bekasi",
    "Vendor Buku Tahunan Bogor",
    "Vendor Buku Tahunan Sukabumi",
    "Vendor Buku Tahunan Purwakarta",
    "Fotografer Bandung",
    "Fotografer Tasikmalaya",
    "Foto Wisuda Bandung",
    "Foto Wisuda Bogor",
    "Foto Wisuda Bekasi",
    // ─── Jawa Tengah & sekitar ───
    "Vendor Buku Tahunan Brebes",
    "Vendor Buku Tahunan Tegal",
    "Vendor Buku Tahunan Cilacap",
    "Vendor Buku Tahunan Semarang",
    // ─── Jabodetabek & nasional ───
    "Vendor Buku Tahunan Jakarta",
    "Vendor Buku Tahunan Depok",
    "Vendor Buku Tahunan Tangerang",
    "Yearbook Organizer Indonesia",
    "Jasa Yearbook Indonesia",
    "Jasa Foto Wisuda Indonesia",
  ],
  author: {
    name: "RV Project Team",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://rvproject.id",
  },
};

export type SiteConfig = typeof siteConfig;
