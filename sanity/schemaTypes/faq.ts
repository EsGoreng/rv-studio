import { defineField, defineType } from "sanity";

export const faqType = defineType({
  name: "faq",
  title: "FAQ Section",
  type: "document",
  fields: [
    defineField({
      name: "categories",
      title: "FAQ Categories & Questions",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "key",
              title: "Category Identifier (Slug / Key)",
              type: "string",
              description:
                'Unique key (e.g. "yearbook", "photography", "videography", "web-dev")',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "title",
              title: "Category Display Title",
              type: "string",
              description: 'e.g. "Yearbook Production", "Creative Photography"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "items",
              title: "Question & Answer List",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "question",
                      title: "Question",
                      type: "string",
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "answer",
                      title: "Answer",
                      type: "text",
                      rows: 4,
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  preview: {
                    select: {
                      title: "question",
                      subtitle: "answer",
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "key",
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "FAQ Section",
        subtitle: "Frequently Asked Questions Configuration",
      };
    },
  },
});
