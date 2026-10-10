import type { GalleryItem } from "@/components/ui/project-filter-gallery";

export interface ProjectPhoto {
  id: string;
  title: string;
  category: "Yearbook" | "Photography" | "Videography" | "Corporate";
}

export const GALLERY_PHOTOS: ProjectPhoto[] = [
  {
    id: "photo-1523240795612-9a054b0db644",
    title: "Class of 2024 Celebration",
    category: "Yearbook",
  },
  {
    id: "photo-1511632765486-a01980e01a18",
    title: "Campus Gathering & Fellowship",
    category: "Yearbook",
  },
  {
    id: "photo-1529156069898-49953e39b3ac",
    title: "Graduation Friendship Moments",
    category: "Yearbook",
  },
  {
    id: "photo-1544717302-de2939b7ef71",
    title: "Student Portraits & Studio Session",
    category: "Photography",
  },
  {
    id: "photo-1519741497674-611481863552",
    title: "Editorial Fashion & Lifestyle",
    category: "Photography",
  },
  {
    id: "photo-1492691527719-9d1e07e534b4",
    title: "Outdoor Creative Portraiture",
    category: "Photography",
  },
  {
    id: "photo-1574717024653-61fd2cf4d44d",
    title: "Behind the Lens Production",
    category: "Videography",
  },
  {
    id: "photo-1492724441997-5dc865305da7",
    title: "Cinematic Movement & Stills",
    category: "Videography",
  },
  {
    id: "photo-1516035069371-29a1b244cc32",
    title: "Commercial Film Set & Gear",
    category: "Videography",
  },
  {
    id: "photo-1556761175-5973dc0f32e7",
    title: "Corporate Excellence & Summit",
    category: "Corporate",
  },
  {
    id: "photo-1522071820081-009f0129c71c",
    title: "Agency Creative Brainstorming",
    category: "Corporate",
  },
  {
    id: "photo-1486406146926-c627a92ad1ab",
    title: "Architectural & Landmark Profile",
    category: "Corporate",
  },
];

export const GALLERY_ITEMS: GalleryItem[] = GALLERY_PHOTOS.map(({ id, title, category }) => ({
  src: `https://images.unsplash.com/${id}?w=720&h=576&fit=crop&q=80&auto=format`,
  alt: title,
  title,
  category,
}));
