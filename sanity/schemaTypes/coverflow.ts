import { defineField, defineType } from "sanity";

export const coverflowType = defineType({
  name: "coverflow",
  title: "Coverflow 3D Yearbook Section",
  type: "document",
  fields: [
    defineField({
      name: "slides",
      title: "Coverflow Slides",
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
              name: "subtitle",
              title: "Subtitle",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Book Description",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "color",
              title: "Book Cover Color (Hex)",
              type: "string",
              description: "e.g. #14532d (Forest Green), #b45309 (Gold Bronze)",
              initialValue: "#14532d",
            }),
            defineField({
              name: "image",
              title: "Slide Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "externalSrc",
              title: "External Image URL (Fallback)",
              type: "url",
            }),
            defineField({
              name: "pdfFile",
              title: "PDF File (Flipbook)",
              type: "file",
              description: "Upload file PDF buku kenangan untuk preview 3D Flipbook",
              options: {
                accept: ".pdf,application/pdf",
              },
            }),
            defineField({
              name: "pdfUrl",
              title: "External PDF URL (Fallback)",
              type: "url",
              description: "URL alternatif berkas PDF jika disimpan di server eksternal",
            }),
            defineField({
              name: "password",
              title: "Access Password",
              type: "string",
              description: "Password untuk membuka preview PDF buku kenangan (kosongkan jika tanpa password / publik)",
            }),
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
            defineField({
              name: "meta",
              title: "Metadata Specifications",
              type: "array",
              description: "Specifications like Year, Edition, Pages",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "label",
                      title: "Label",
                      type: "string",
                      description: "e.g. Year, Edition, Pages",
                    }),
                    defineField({
                      name: "value",
                      title: "Value",
                      type: "string",
                      description: "e.g. 2024, Landscape, 120",
                    }),
                  ],
                  preview: {
                    select: {
                      title: "label",
                      subtitle: "value",
                    },
                    prepare({ title, subtitle }) {
                      return {
                        title: `${title || "Label"}: ${subtitle || "Value"}`,
                      };
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "subtitle",
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
        title: "Coverflow Yearbook Section",
        subtitle: "3D Carousel Configuration",
      };
    },
  },
});
