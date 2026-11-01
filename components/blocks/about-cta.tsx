import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CTALink {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
  icon?: "message" | "arrow";
}

const DEFAULT_LINKS: CTALink[] = [
  {
    label: "Konsultasi Proyek",
    href: "#contact",
    variant: "primary",
    icon: "message",
  },
  {
    label: "Portofolio Foto",
    href: "/photography",
    variant: "secondary",
    icon: "arrow",
  },
  {
    label: "Koleksi Video",
    href: "/videography",
    variant: "secondary",
    icon: "arrow",
  },
];

export interface AboutCTAProps {
  heading?: string;
  description?: string;
  links?: CTALink[];
  className?: string;
}

export function AboutCTA({
  heading = "Siap Mengabadikan Momen Bersama Kami?",
  description = "Diskusikan ide kreatif, konsep buku tahunan, atau kebutuhan sesi foto & video Anda bersama tim RV Project. Kami siap mewujudkannya.",
  links = DEFAULT_LINKS,
  className,
}: AboutCTAProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20">
      <section
        className={cn(
          "relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-b from-card/60 to-card/20 p-8 sm:p-12 backdrop-blur-md text-center space-y-6",
          className
        )}
      >
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            {heading}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all",
                link.variant === "primary"
                  ? "bg-foreground text-background hover:opacity-90 shadow-md"
                  : "border border-border/70 bg-card/60 hover:bg-muted text-foreground"
              )}
            >
              {link.icon === "message" && <MessageCircle className="w-4 h-4" />}
              {link.label}
              {link.icon === "arrow" && <ArrowRight className="w-4 h-4" />}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AboutCTA;
