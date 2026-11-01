import { DitheredHeader } from "@/components/ui/dithered-grid";
import { cn } from "@/lib/utils";

export interface AboutHeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function AboutHeader({
  title = "About RV Project",
  subtitle = "Rumah produksi visual kreatif yang menggabungkan estetika modern dan narasi visual autentik.",
  className,
}: AboutHeaderProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <DitheredHeader
        gradientHeight="120%"
        fade="bottom"
        accent="#d4d4d8"
        liquidGlass
        className={cn(
          "py-10 sm:py-16 px-6 rounded-3xl border border-border/40 text-center",
          className
        )}
      >
        <div className="space-y-4 max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
            {subtitle}
          </p>
        </div>
      </DitheredHeader>
    </div>
  );
}

export default AboutHeader;
