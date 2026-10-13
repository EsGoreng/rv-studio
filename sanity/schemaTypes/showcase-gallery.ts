import { defineField, defineType } from "sanity";

export const showcaseGalleryType = defineType({
  name: "showcaseGallery",
  title: "Showcase Gallery Section (3D Perspective Slider)",
  type: "document",
  fields: [
    defineField({
      name: "items",
      title: "Showcase Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Photo Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "category",
              title: "Category / Tag",
              type: "string",
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "externalSrc",
              title: "External Image URL (Fallback)",
              type: "url",
            }),
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "category",
              media: "image",
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Showcase Gallery Section",
        subtitle: "3D Perspective Slider Items",
      };
    },
  },
});
