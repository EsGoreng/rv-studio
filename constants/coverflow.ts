import type { CoverflowSlide } from "@/components/ui/coverflow-carousel";

const R2 = "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/stock-images";
const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=640&h=640&fit=crop&q=70&auto=format`;

export const COVERFLOW_SLIDES: CoverflowSlide[] = [
  {
    src: UNSPLASH("1470071459604-3b5ec3a7fe05"),
    alt: "Fog rolling through a forested valley at first light",
    title: "Low Country Heritage",
    subtitle: "Nature & Campus Scenery",
    color: "#14532d", // Forest Green
    meta: [
      { label: "Year", value: "2022" },
      { label: "Edition", value: "Landscape" },
      { label: "Pages", value: "130" },
    ],
  },
  {
    src: UNSPLASH("1470071459604-3b5ec3a7fe05"),
    alt: "Fog rolling through a forested valley at first light",
    title: "Low Country Heritage",
    subtitle: "Nature & Campus Scenery",
    color: "#14532d", // Forest Green
    meta: [
      { label: "Year", value: "2022" },
      { label: "Edition", value: "Landscape" },
      { label: "Pages", value: "130" },
    ],
  },
  {
    src: UNSPLASH("1470071459604-3b5ec3a7fe05"),
    alt: "Fog rolling through a forested valley at first light",
    title: "Low Country Heritage",
    subtitle: "Nature & Campus Scenery",
    color: "#14532d", // Forest Green
    meta: [
      { label: "Year", value: "2022" },
      { label: "Edition", value: "Landscape" },
      { label: "Pages", value: "130" },
    ],
  },
  {
    src: UNSPLASH("1500534314209-a25ddb2bd429"),
    alt: "Sunlit dune ridge under a hard blue sky",
    title: "Dry Season Expedition",
    subtitle: "Adventure & Field Trips",
    color: "#b45309", // Warm Gold Bronze
    meta: [
      { label: "Year", value: "2021" },
      { label: "Edition", value: "Outdoors" },
      { label: "Pages", value: "104" },
    ],
  },
  {
    src: UNSPLASH("1500534314209-a25ddb2bd429"),
    alt: "Sunlit dune ridge under a hard blue sky",
    title: "Dry Season Expedition",
    subtitle: "Adventure & Field Trips",
    color: "#b45309", // Warm Gold Bronze
    meta: [
      { label: "Year", value: "2021" },
      { label: "Edition", value: "Outdoors" },
      { label: "Pages", value: "104" },
    ],
  },
];
