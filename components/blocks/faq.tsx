import { FAQ, type FAQItemData } from "@/components/ui/faq-tabs";
import { FAQ_CATEGORIES, FAQ_DATA } from "@/constants/faq";
import { cn } from "@/lib/utils";

export interface FAQBlockProps {
  title?: string;
  categories?: Record<string, string>;
  faqData?: Record<string, FAQItemData[]>;
  className?: string;
}

export function FAQBlock({
  title = "Frequently Asked Questions",
  categories = FAQ_CATEGORIES,
  faqData = FAQ_DATA,
  className,
}: FAQBlockProps) {
  return (
    <div id="faq" className={cn("w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 scroll-mt-12", className)}>
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
