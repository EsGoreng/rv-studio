export interface PhotographyItem {
  id: string;
  title: string;
  category: "Yearbook" | "Portrait" | "Editorial" | "Commercial";
  src: string;
  alt?: string;
}

export const PHOTOGRAPHY_ITEMS: PhotographyItem[] = [
  {
    id: "photo-1",
    title: "Ethereal Studio Portrait",
    category: "Portrait",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
    alt: "Ethereal Studio Portrait",
  },
  {
    id: "photo-2",
    title: "Class of 2024 Celebration",
    category: "Yearbook",
    src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&auto=format&fit=crop&q=80",
    alt: "Class of 2024 Celebration",
  },
  {
    id: "photo-3",
    title: "Modern High Fashion",
    category: "Editorial",
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    alt: "Modern High Fashion",
  },
  {
    id: "photo-4",
    title: "Campus Fellowship & Smiles",
    category: "Yearbook",
    src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=900&auto=format&fit=crop&q=80",
    alt: "Campus Fellowship & Smiles",
  },
  {
    id: "photo-5",
    title: "Classic Monochrome Portrait",
    category: "Portrait",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
    alt: "Classic Monochrome Portrait",
  },
  {
    id: "photo-6",
    title: "Sunlit Editorial Lookbook",
    category: "Editorial",
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=80",
    alt: "Sunlit Editorial Lookbook",
  },
  {
    id: "photo-7",
    title: "Graduation Memories & Kinship",
    category: "Yearbook",
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&auto=format&fit=crop&q=80",
    alt: "Graduation Memories & Kinship",
  },
  {
    id: "photo-8",
    title: "Graduation Studio Showcase",
    category: "Portrait",
    src: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=900&auto=format&fit=crop&q=80",
    alt: "Graduation Studio Showcase",
  },
  {
    id: "photo-9",
    title: "Golden Hour Atmosphere",
    category: "Editorial",
    src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=900&auto=format&fit=crop&q=80",
    alt: "Golden Hour Atmosphere",
  },
  {
    id: "photo-10",
    title: "Corporate Summit & Executive",
    category: "Commercial",
    src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&auto=format&fit=crop&q=80",
    alt: "Corporate Summit & Executive",
  },
  {
    id: "photo-11",
    title: "Urban Architectural Symphony",
    category: "Commercial",
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&auto=format&fit=crop&q=80",
    alt: "Urban Architectural Symphony",
  },
  {
    id: "photo-12",
    title: "Studio Character Profile",
    category: "Portrait",
    src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    alt: "Studio Character Profile",
  },
  {
    id: "photo-13",
    title: "Creative Agency Workspace",
    category: "Commercial",
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80",
    alt: "Creative Agency Workspace",
  },
  {
    id: "photo-14",
    title: "Timeless Ceremonial Moment",
    category: "Editorial",
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&auto=format&fit=crop&q=80",
    alt: "Timeless Ceremonial Moment",
  },
  {
    id: "photo-15",
    title: "Commercial Film Set & Gear",
    category: "Commercial",
    src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&auto=format&fit=crop&q=80",
    alt: "Commercial Film Set & Gear",
  },
  {
    id: "photo-16",
    title: "Wilderness Panoramic Stills",
    category: "Editorial",
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&auto=format&fit=crop&q=80",
    alt: "Wilderness Panoramic Stills",
  },
];
