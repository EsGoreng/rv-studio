import * as React from "react";
import { FAQ, type FAQItemData } from "@/components/ui/faq-tabs";
import { FAQ_CATEGORIES, FAQ_DATA } from "@/constants/faq";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/seo/json-ld";

export interface FAQBlockProps {
  title?: string;
  categories?: Record<string, string>;
  faqData?: Record<string, FAQItemData[]>;
  className?: string;
  data?: {
    title?: string;
    categories?: Array<{
      _key?: string;
      key?: string;
      title?: string;
      items?: Array<{
        _key?: string;
        question?: string;
        answer?: string;
      }>;
    }>;
  } | null;
}

export function FAQBlock({
  title: propTitle,
  categories: propCategories,
  faqData: propFaqData,
  className,
  data,
}: FAQBlockProps) {
  const title = data?.title ?? propTitle ?? "Frequently Asked Questions";

  const { categories, faqData } = React.useMemo(() => {
    if (propCategories && propFaqData) {
      return { categories: propCategories, faqData: propFaqData };
    }

    if (data?.categories && data.categories.length > 0) {
      const parsedCategories: Record<string, string> = {};
      const parsedFaqData: Record<string, FAQItemData[]> = {};

      for (const cat of data.categories) {
        if (!cat.key) continue;
        parsedCategories[cat.key] = cat.title || cat.key;
        parsedFaqData[cat.key] = (cat.items || []).map((item) => ({
          question: item.question || "",
          answer: item.answer || "",
        }));
      }

      if (Object.keys(parsedCategories).length > 0) {
        return {
          categories: parsedCategories,
          faqData: parsedFaqData,
        };
      }
    }

    return {
      categories: FAQ_CATEGORIES,
      faqData: FAQ_DATA,
    };
  }, [data?.categories, propCategories, propFaqData]);

  // Construct FAQPage JSON-LD schema for AEO & Google Rich Results
  const faqSchema = React.useMemo(() => {
    const questions: Array<{
      "@type": string;
      name: string;
      acceptedAnswer: {
        "@type": string;
        text: string;
      };
    }> = [];

    Object.values(faqData).forEach((items) => {
      items.forEach((item) => {
        if (item.question?.trim() && item.answer?.trim()) {
          questions.push({
            "@type": "Question",
            name: item.question.trim(),
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer.trim(),
            },
          });
        }
      });
    });

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: questions,
    };
  }, [faqData]);

  return (
    <div
      id="faq"
      className={cn(
        "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 scroll-mt-12",
        className
      )}
    >
      <JsonLd data={faqSchema} id="faq-structured-data" />
      <FAQ
        title={title}
        categories={categories}
        faqData={faqData}
      />
    </div>
  );
}

export const FAQSection = FAQBlock;
export default FAQBlock;
