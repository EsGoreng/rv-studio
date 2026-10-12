import { defineField, defineType } from "sanity";

export const bentoGalleryType = defineType({
  name: "bentoGallery",
  title: "Bento Gallery Section",
  type: "document",
  fields: [
    defineField({
      name: "items",
      title: "Bento Gallery Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "desc",
              title: "Description",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "image",
              title: "Image File",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "externalSrc",
              title: "External Image URL (Fallback)",
              type: "url",
            }),
            defineField({
              name: "span",
              title: "Grid Span Layout",
              type: "string",
              options: {
                list: [
                  { title: "Large (2 Col, 2 Row)", value: "md:col-span-2 md:row-span-2" },
                  { title: "Tall (1 Col, 2 Row)", value: "md:row-span-2" },
                  { title: "Wide (2 Col, 1 Row)", value: "md:col-span-2 md:row-span-1" },
                  { title: "Standard (1 Col, 1 Row)", value: "md:row-span-1" },
                ],
              },
              initialValue: "md:row-span-1",
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "desc",
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
        title: "Bento Gallery Section",
        subtitle: "Interactive Bento Grid Configuration",
      };
    },
  },
});
