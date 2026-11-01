import { Camera, Film, BookOpen, Sparkles, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LiquidGlass } from "@/components/ui/liquid-glass";

export interface ServiceItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    icon: Camera,
    title: "Photography",
    description:
      "Sesi foto editorial, potret personal, wisuda, katalog, hingga foto modern.",
  },
  {
    icon: Film,
    title: "Cinematic Videography",
    description:
      "Produksi film pendek, dokumenter, commercial teaser, aftermovie festival, dan profil sinematik.",
  },
  {
    icon: BookOpen,
    title: "Yearbook",
    description:
      "Layanan menyeluruh buku tahunan sekolah dari eksplorasi konsep, photoshoot dan pembuatan design yearbook.",
  },
  {
    icon: Sparkles,
    title: "Creative Direction",
    description:
      "Pengembangan konsep visual, moodboard artistik, kurasi wardrobe, dan tata set styling terkonsep.",
  },
];

export interface AboutStoryProps {
  heading?: string;
  lead?: string;
  body?: string;
  services?: ServiceItem[];
  className?: string;
}

export function AboutStory({
  heading = "Mengabadikan Momen Lewat Foto dan Video Sinematik",
  lead = "RV Project adalah creative visual production house spesialis pembuatan buku tahunan sekolah (yearbook organizer), fotografi wisuda & personal, serta produksi video sinematik komersial. Kami melayani institusi pendidikan dan klien di seluruh Indonesia.",
  body = "Berawal dari dedikasi mendalam pada seni visual, kami mendampingi setiap langkah produksi mulai dari perancangan konsep tema, penyusunan moodboard, pengarahan gaya (art direction), hingga proses cetak fisik premium dan penerbitan digital 3D interactive flipbook.",
  services = DEFAULT_SERVICES,
  className,
}: AboutStoryProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20">
      <LiquidGlass
        asWrapper
        className={cn(
          "rounded-3xl border border-border/40",
          className
        )}
      >
        <section className="p-6 sm:p-10 space-y-8 sm:space-y-10">
          {/* Narrative */}
          <div className="space-y-4 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              {heading}
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
              <p className="text-foreground/90 font-medium">{lead}</p>
              <p>{body}</p>
            </div>
          </div>
        </section>
      </LiquidGlass>
    </div>
  );
}

export default AboutStory;
