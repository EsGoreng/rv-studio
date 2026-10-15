import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("RV Content")
    .items([
      S.listItem()
        .title("Hero")
        .id("hero")
        .child(S.document().schemaType("hero").documentId("hero")),

      S.listItem()
        .title("Video")
        .id("videoShowcase")
        .child(
          S.document()
            .schemaType("videoShowcase")
            .documentId("videoShowcase")
        ),

      S.listItem()
        .title("Showcase Gallery ")
        .id("showcaseGallery")
        .child(
          S.document()
            .schemaType("showcaseGallery")
            .documentId("showcaseGallery")
        ),

      S.listItem()
        .title("Gallery ")
        .id("gallery")
        .child(S.document().schemaType("gallery").documentId("gallery")),

      S.listItem()
        .title("Yearbook")
        .id("coverflow")
        .child(S.document().schemaType("coverflow").documentId("coverflow")),

      S.listItem()
        .title("FAQ")
        .id("faq")
        .child(S.document().schemaType("faq").documentId("faq")),

      S.listItem()
        .title("Contact")
        .id("contact")
        .child(S.document().schemaType("contact").documentId("contact")),

      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) =>
          ![
            "hero",
            "videoShowcase",
            "showcaseGallery",
            "gallery",
            "coverflow",
            "faq",
            "contact",
          ].includes(listItem.getId() || "")
      ),
    ]);
