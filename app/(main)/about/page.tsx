import { Metadata } from "next";
import Link from "next/link";
import {
  Camera,
  Film,
  BookOpen,
  Sparkles,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { DitheredHeader } from "@/components/ui/dithered-grid";

export const metadata: Metadata = {
  title: "About Us | RV Studio",
  description:
    "Kenali RV Studio lebih dekat — Creative visual production house yang berfokus pada fotografi, videografi sinematik, dan produksi buku tahunan kreatif.",
};

// Core services data
const SERVICES = [
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

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground pt-6 sm:pt-10 pb-28 sm:pb-36 selection:bg-neutral-800 selection:text-white">
      {/* Background Subtle Gradient Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary/5 via-transparent to-transparent -z-10" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* ─── 1. Header with Signature Dithered Grid ──────────────────────── */}
        <DitheredHeader
          gradientHeight="120%"
          fade="bottom"
          accent="#d4d4d8"
          className="py-10 sm:py-16 px-6 rounded-3xl border border-border/40 bg-card/30 backdrop-blur-sm text-center"
        >
          <div className="space-y-4 max-w-3xl mx-auto flex flex-col items-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              About RV Project
            </h1>
          </div>
        </DitheredHeader>

        {/* ─── 2. Story & Services Section ──────────────────────────────────── */}
        <section className="rounded-3xl border border-border/40 bg-card/20 p-6 sm:p-10 backdrop-blur-sm space-y-8 sm:space-y-10">
          {/* Narrative Content */}
          <div className="space-y-4 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Mengabadikan Momen Lewat Foto dan Video
            </h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed text-sm sm:text-base">
              <p>
                RV Studio berawal dari minat kami terhadap fotografi, videografi, dan desain visual. Kami menyediakan layanan dokumentasi wisuda, kegiatan sekolah, hingga berbagai acara personal dengan hasil yang profesional, menarik, dan sesuai kebutuhan klien.
              </p>
            </div>
          </div>

          {/* Simplified Core Services / Pillars */}
          <div className="pt-6 sm:pt-8 border-t border-border/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {SERVICES.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-border/40 bg-card/30 p-5 sm:p-6 backdrop-blur-sm space-y-3 hover:border-border/80 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-muted/80 flex items-center justify-center border border-border/50 group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-semibold tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 3. Call To Action ────────────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-b from-card/60 to-card/20 p-8 sm:p-12 backdrop-blur-md text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Siap Mengabadikan Momen Bersama Kami?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Diskusikan ide kreatif, konsep buku tahunan, atau kebutuhan sesi foto
              & video Anda bersama tim RV Studio. Kami siap mewujudkannya.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-foreground text-background hover:opacity-90 transition-opacity shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              Konsultasi Proyek
            </Link>

            <Link
              href="/photography"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border border-border/70 bg-card/60 hover:bg-muted text-foreground transition-colors"
            >
              Portofolio Foto
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/videography"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border border-border/70 bg-card/60 hover:bg-muted text-foreground transition-colors"
            >
              Koleksi Video
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}