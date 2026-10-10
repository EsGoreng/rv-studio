"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FAQItemData {
  question: string;
  answer: string;
}

export interface FAQProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  categories: Record<string, string>;
  faqData: Record<string, FAQItemData[]>;
  className?: string;
}

// Main reusable FAQ component
export const FAQ = ({
  title = "FAQs",
  categories = {},
  faqData = {},
  className,
  ...props
}: FAQProps) => {
  const categoryKeys = Object.keys(categories);
  const [selectedCategory, setSelectedCategory] = useState(categoryKeys[0] || "");

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-background px-4 py-12 text-foreground",
        className
      )}
      {...props}
    >
      <FAQHeader title={title} />
      <FAQTabs
        categories={categories}
        selected={selectedCategory}
        setSelected={setSelectedCategory}
      />
      <FAQList
        faqData={faqData}
        selected={selectedCategory}
      />
    </section>
  );
};

interface FAQHeaderProps {
  title: string;
}

const FAQHeader = ({ title }: FAQHeaderProps) => (
  <div className="relative z-10 flex flex-col items-center justify-center text-center">
    <h2 className="mb-8 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
      {title}
    </h2>
  </div>
);

interface FAQTabsProps {
  categories: Record<string, string>;
  selected: string;
  setSelected: (key: string) => void;
}

const FAQTabs = ({ categories, selected, setSelected }: FAQTabsProps) => (
  <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
    {Object.entries(categories).map(([key, label]) => {
      const isSelected = selected === key;
      return (
        <button
          key={key}
          type="button"
          onClick={() => setSelected(key)}
          className={cn(
            "relative cursor-pointer overflow-hidden whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-300",
            isSelected
              ? "border-primary text-primary-foreground shadow-sm"
              : "border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
          )}
        >
          <span className="relative z-10">{label}</span>
          <AnimatePresence>
            {isSelected && (
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.4, ease: "backIn" }}
                className="absolute inset-0 z-0 bg-gradient-to-r from-primary to-primary/85"
              />
            )}
          </AnimatePresence>
        </button>
      );
    })}
  </div>
);

interface FAQListProps {
  faqData: Record<string, FAQItemData[]>;
  selected: string;
}

const FAQList = ({ faqData, selected }: FAQListProps) => (
  <div className="mx-auto mt-10 sm:mt-12 max-w-3xl">
    <AnimatePresence mode="wait">
      {Object.entries(faqData).map(([category, questions]) => {
        if (selected === category) {
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="space-y-4"
            >
              {questions.map((faq, index) => (
                <FAQItem key={`${category}-${index}`} {...faq} />
              ))}
            </motion.div>
          );
        }
        return null;
      })}
    </AnimatePresence>
  </div>
);

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      animate={isOpen ? "open" : "closed"}
      className={cn(
        "rounded-xl border transition-all duration-200",
        isOpen ? "border-primary/25 bg-muted/40 shadow-sm" : "border-border bg-card hover:border-border/80"
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center justify-between gap-4 p-4 sm:p-5 text-left"
      >
        <span
          className={cn(
            "text-base sm:text-lg font-medium transition-colors",
            isOpen ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {question}
        </span>
        <motion.span
          variants={{
            open: { rotate: "45deg" },
            closed: { rotate: "0deg" },
          }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <Plus
            className={cn(
              "h-5 w-5 transition-colors",
              isOpen ? "text-foreground" : "text-muted-foreground"
            )}
          />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : "0px",
          marginBottom: isOpen ? "16px" : "0px",
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden px-4 sm:px-5"
      >
        <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
          {answer}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default FAQ;
