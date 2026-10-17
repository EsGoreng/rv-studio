import { defineField, defineType } from "sanity";

export const clientType = defineType({
  name: "client",
  title: "Client & Instansi",
  type: "document",
  fields: [
    defineField({
      name: "items",
      title: "Daftar Instansi / Klien",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Nama Instansi / Klien",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "logo",
              title: "Logo Instansi",
              type: "image",
              options: { hotspot: true },
              description: "Unggah file logo instansi (format PNG / SVG / WebP dengan background transparan disarankan)",
            }),
            defineField({
              name: "externalLogoUrl",
              title: "External Logo URL (Fallback)",
              type: "url",
              description: "URL alternatif berkas logo jika disimpan di CDN / server eksternal",
            }),
          ],
          preview: {
            select: {
              title: "name",
              media: "logo",
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Client & Instansi",
        subtitle: "Daftar logo instansi & partner",
      };
    },
  },
});
