export interface PlaylistItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  videoSrc: string; // YouTube embed URL, watch URL, or direct video
  category?: string; // Profil Instansi, Graduation Video, Commercial Video, dll.
}

export const SAMPLE_PLAYLIST: PlaylistItem[] = [
  {
    id: "1",
    title: "Profil Instansi - Universitas & Korporat Excellence",
    description: "Company profile sinematik dengan visual narrative profesional & drone shots.",
    duration: "YouTube",
    thumbnail: "https://img.youtube.com/vi/tD4zgAa-PqM/hqdefault.jpg",
    videoSrc: "https://www.youtube.com/embed/tD4zgAa-PqM?si=WL0I_A35pCkjAvXF",
    category: "Profil Instansi",
  },
  {
    id: "2",
    title: "Cinematic Graduation Video & Yearbook Film",
    description: "Dokumentasi memori kelulusan penuh emosi dengan color grading sinematik.",
    duration: "YouTube",
    thumbnail: "https://img.youtube.com/vi/COfSLiujbcg/hqdefault.jpg",
    videoSrc: "https://www.youtube.com/embed/COfSLiujbcg?si=T6VZWggzcXCn7cgE",
    category: "Graduation Video",
  },
  {
    id: "3",
    title: "Commercial Video - Brand Showcase & Product Promo",
    description: "Iklan komersial dinamis beresolusi tinggi dengan ritme visual modern.",
    duration: "YouTube",
    thumbnail: "https://img.youtube.com/vi/jWVNlLLQGc0/hqdefault.jpg",
    videoSrc: "https://www.youtube.com/embed/jWVNlLLQGc0?si=34HdnYjQz_LLdJtL",
    category: "Commercial Video",
  },
  {
    id: "4",
    title: "Profil Instansi - Hospital & Medical Center Journey",
    description: "Eksplorasi fasilitas, teknologi, dan dedikasi pelayanan kesehatan.",
    duration: "YouTube",
    thumbnail: "https://img.youtube.com/vi/tD4zgAa-PqM/hqdefault.jpg",
    videoSrc: "https://www.youtube.com/embed/tD4zgAa-PqM?si=WL0I_A35pCkjAvXF",
    category: "Profil Instansi",
  },
  {
    id: "5",
    title: "High School Aftermovie - Masa Depan Gemilang",
    description: "Sorotan keseruan dan momen persahabatan menjelang hari kelulusan.",
    duration: "YouTube",
    thumbnail: "https://img.youtube.com/vi/COfSLiujbcg/hqdefault.jpg",
    videoSrc: "https://www.youtube.com/embed/COfSLiujbcg?si=T6VZWggzcXCn7cgE",
    category: "Graduation Video",
  },
  {
    id: "6",
    title: "Commercial Video - F&B and Lifestyle Campaign",
    description: "Kampanye visual menggugah selera dengan motion design yang elegan.",
    duration: "YouTube",
    thumbnail: "https://img.youtube.com/vi/jWVNlLLQGc0/hqdefault.jpg",
    videoSrc: "https://www.youtube.com/embed/jWVNlLLQGc0?si=34HdnYjQz_LLdJtL",
    category: "Commercial Video",
  },
];
