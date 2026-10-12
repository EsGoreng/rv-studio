import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("RV Studio Content")
    .items([
      S.listItem()
        .title("Hero Section")
        .id("hero")
        .child(S.document().schemaType("hero").documentId("hero")),

      S.listItem()
        .title("Video Showcase Section")
        .id("videoShowcase")
        .child(
          S.document()
            .schemaType("videoShowcase")
            .documentId("videoShowcase")
        ),

      S.listItem()
        .title("Project Gallery Section")
        .id("gallery")
        .child(S.document().schemaType("gallery").documentId("gallery")),

      S.listItem()
        .title("Coverflow 3D Yearbook")
        .id("coverflow")
        .child(S.document().schemaType("coverflow").documentId("coverflow")),

      S.listItem()
        .title("Bento Moments Section")
        .id("bentoGallery")
        .child(
          S.document()
            .schemaType("bentoGallery")
            .documentId("bentoGallery")
        ),

      S.listItem()
        .title("FAQ Section")
        .id("faq")
        .child(S.document().schemaType("faq").documentId("faq")),

      S.listItem()
        .title("Contact Section")
        .id("contact")
        .child(S.document().schemaType("contact").documentId("contact")),

      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) =>
          ![
            "hero",
            "videoShowcase",
            "gallery",
            "coverflow",
            "bentoGallery",
            "faq",
            "contact",
          ].includes(listItem.getId() || "")
      ),
    ]);
