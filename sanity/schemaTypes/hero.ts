import { defineField, defineType } from "sanity";

export const heroType = defineType({
  name: "hero",
  title: "Hero Section",
  type: "document",
  fields: [
    defineField({
      name: "speed",
      title: "Animation Speed",
      type: "number",
      description: "Scrolling grid animation speed (default: 8)",
      initialValue: 8,
    }),
    defineField({
      name: "images",
      title: "Hero Tilted Grid Images",
      type: "array",
      description: "Images displayed in the 3D tilted grid background",
      of: [
        {
          type: "object",
          fields: [
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
              description: "External image URL if not uploading a file (e.g. Unsplash URL)",
            }),
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              description: "Accessible description of the image",
            }),
          ],
          preview: {
            select: {
              title: "alt",
              media: "image",
              subtitle: "externalSrc",
            },
            prepare({ title, media, subtitle }) {
              return {
                title: title || "Untitled Image",
                subtitle: subtitle || "Uploaded Sanity image",
                media,
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Hero Section",
        subtitle: "Hero Tilted Grid Configuration",
      };
    },
  },
});
