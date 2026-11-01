import { type SchemaTypeDefinition } from "sanity";
import { heroType } from "./hero";
import { videoShowcaseType } from "./video-showcase";
import { galleryType } from "./gallery";
import { coverflowType } from "./coverflow";
import { faqType } from "./faq";
import { contactType } from "./contact";
import { clientType } from "./client";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    heroType,
    videoShowcaseType,
    galleryType,
    coverflowType,
    faqType,
    contactType,
    clientType,
  ],
};
