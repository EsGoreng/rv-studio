import { defineField, defineType } from "sanity";

export const contactType = defineType({
  name: "contact",
  title: "Contact Section",
  type: "document",
  fields: [
    defineField({
      name: "phoneNumber",
      title: "WhatsApp Phone Number",
      type: "string",
      description: "Format internasional tanpa simbol + (misal: 6281234567890)",
      initialValue: "6281234567890",
    }),
    defineField({
      name: "studioBase",
      title: "Studio Base / Location",
      type: "string",
      initialValue: "Indonesia · On-location & Studio",
    }),
  ],
  preview: {
    select: {
      subtitle: "phoneNumber",
    },
    prepare({ subtitle }) {
      return {
        title: "Contact Section",
        subtitle: subtitle ? `WA: +${subtitle}` : "Contact Configuration",
      };
    },
  },
});
