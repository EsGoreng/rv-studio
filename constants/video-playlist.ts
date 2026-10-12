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
    title: "Pelajaran Mahal HARVARD: Cara Bangun Mental Disiplin",
    description: "Cara membangun mental disiplin, konsistensi, dan menemukan potensi diri sejati.",
    duration: "YouTube",
    thumbnail: "https://img.youtube.com/vi/Dt8f-oDJjLo/hqdefault.jpg",
    videoSrc: "https://www.youtube.com/embed/Dt8f-oDJjLo",
    category: "Motivation & Education",
  },
  {
    id: "2",
    title: "Sheila Dara dan Kucingnya Lagi - Raditya Dika",
    description: "Obrolan santai dan inspiratif Raditya Dika bersama Sheila Dara seputar kecintaannya merawat kucing rescue.",
    duration: "YouTube",
    thumbnail: "https://img.youtube.com/vi/KQK7hMCazFY/hqdefault.jpg",
    videoSrc: "https://www.youtube.com/embed/KQK7hMCazFY",
    category: "Podcast & Talkshow",
  },
  {
    id: "3",
    title: "Kenapa Pandji Betah di New York - Raditya Dika ft. Pandji",
    description: "Eksplorasi cerita absurd, kehidupan, dan perjalanan karier Pandji Pragiwaksono di New York.",
    duration: "YouTube",
    thumbnail: "https://img.youtube.com/vi/oRWfLs1tISg/hqdefault.jpg",
    videoSrc: "https://www.youtube.com/embed/oRWfLs1tISg",
    category: "Talkshow & Comedy",
  },
  {
    id: "4",
    title: "Educational Chat: Ustadz Felix Siauw ft. Pandji Pragiwaksono",
    description: "Diskusi mendalam mengenai esensi pendidikan, parenting, dan pola pikir tentang masa depan generasi muda.",
    duration: "YouTube",
    thumbnail: "https://img.youtube.com/vi/moMBAbM0W6w/hqdefault.jpg",
    videoSrc: "https://www.youtube.com/embed/moMBAbM0W6w",
    category: "Education & Discussion",
  },
];
