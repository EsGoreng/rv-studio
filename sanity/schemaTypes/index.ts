import { type SchemaTypeDefinition } from "sanity";
import { heroType } from "./hero";
import { videoShowcaseType } from "./video-showcase";
import { galleryType } from "./gallery";
import { coverflowType } from "./coverflow";
import { faqType } from "./faq";
import { bentoGalleryType } from "./bento-gallery";
import { contactType } from "./contact";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    heroType,
    videoShowcaseType,
    galleryType,
    coverflowType,
    bentoGalleryType,
    faqType,
    contactType,
  ],
};
