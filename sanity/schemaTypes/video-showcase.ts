import { defineField, defineType } from "sanity";

export const videoShowcaseType = defineType({
  name: "videoShowcase",
  title: "Video Showcase Section",
  type: "document",
  fields: [
    defineField({
      name: "items",
      title: "Playlist Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Video Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "category",
              title: "Category",
              type: "string",
              options: {
                list: [
                  { title: "Profil Instansi", value: "Profil Instansi" },
                  { title: "Graduation Video", value: "Graduation Video" },
                  { title: "Commercial Video", value: "Commercial Video" },
                  { title: "Aftermovie", value: "Aftermovie" },
                  { title: "Other", value: "Other" },
                ],
              },
            }),
            defineField({
              name: "duration",
              title: "Duration Label",
              type: "string",
              description: 'e.g. "YouTube", "3:45"',
              initialValue: "YouTube",
            }),
            defineField({
              name: "videoSrc",
              title: "Video Embed URL",
              type: "url",
              description: "YouTube embed URL (e.g. https://www.youtube.com/embed/...)",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "thumbnail",
              title: "Thumbnail Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "externalThumbnail",
              title: "External Thumbnail URL (Fallback)",
              type: "url",
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "category",
              media: "thumbnail",
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Video Showcase Section",
        subtitle: "Video Playlist Configuration",
      };
    },
  },
});
