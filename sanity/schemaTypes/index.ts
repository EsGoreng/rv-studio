import { type SchemaTypeDefinition } from "sanity";
import { heroType } from "./hero";
import { videoShowcaseType } from "./video-showcase";
import { showcaseGalleryType } from "./showcase-gallery";
import { galleryType } from "./gallery";
import { coverflowType } from "./coverflow";
import { faqType } from "./faq";
import { contactType } from "./contact";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    heroType,
    videoShowcaseType,
    showcaseGalleryType,
    galleryType,
    coverflowType,
    faqType,
    contactType,
  ],
};
