import { defineField, defineType } from "sanity";

export const galleryType = defineType({
  name: "gallery",
  title: "Project Gallery Section",
  type: "document",
  fields: [
    defineField({
      name: "items",
      title: "Gallery Items",
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
              title: "Category",
              type: "string",
              options: {
                list: [
                  { title: "Yearbook", value: "Yearbook" },
                  { title: "Photography", value: "Photography" },
                  { title: "Videography", value: "Videography" },
                  { title: "Corporate", value: "Corporate" },
                ],
              },
              validation: (rule) => rule.required(),
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
        title: "Project Gallery Section",
        subtitle: "Gallery Items Configuration",
      };
    },
  },
});
