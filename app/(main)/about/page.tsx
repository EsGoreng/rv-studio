import { Metadata } from "next";
import Link from "next/link";
import {
  Camera,
  Film,
  BookOpen,
  Sparkles,
  Target,
  HeartHandshake,
  Award,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Users,
  Compass,
} from "lucide-react";
import { DitheredHeader } from "@/components/ui/dithered-grid";

export const metadata: Metadata = {
  title: "About Us | RV Studio",
  description:
    "Kenali RV Studio lebih dekat — Creative visual production house yang berfokus pada fotografi, videografi sinematik, dan produksi buku tahunan kreatif.",
};

// Dummy statistics data
const STATS = [
  { label: "Tahun Berkarya", value: "5+", sublabel: "Est. 2021" },
  { label: "Proyek Selesai", value: "350+", sublabel: "Foto & Video" },
  { label: "Sekolah & Kampus", value: "75+", sublabel: "Partner Buku Tahunan" },
  { label: "Tingkat Kepuasan", value: "99%", sublabel: "Klien & Komunitas" },
];

// Dummy core services data
const SERVICES = [
  {
    icon: Camera,
    title: "Photography",
    description:
      "Sesi foto editorial, potret personal, wisuda, katalog, hingga foto grup dengan penataan cahaya studio dan estetika visual modern.",
    tags: ["Portrait", "Graduation", "Studio Session", "Editorial"],
  },
  {
    icon: Film,
    title: "Cinematic Videography",
    description:
      "Produksi film pendek, dokumenter, teaser komersial, aftermovie festival, dan profil sekolah dengan standar sinematik berkualitas tinggi.",
    tags: ["Aftermovie", "Documentary", "Commercial", "Color Grading"],
  },
  {
    icon: BookOpen,
    title: "Yearbook Production",
    description:
      "Layanan menyeluruh buku tahunan sekolah mulai dari penentuan tema, photoshoot terkonsep, desain layout editorial, hingga cetak hardcopy premium.",
    tags: ["Konsep Tema", "Editorial Layout", "Hardcover", "Creative Booth"],
  },
  {
    icon: Sparkles,
    title: "Creative Direction & Styling",
    description:
      "Pengembangan konsep visual, moodboard, kurasi wardrobe & lokasi, serta tata artistik yang dirancang khusus untuk memperkuat karakter visual Anda.",
    tags: ["Moodboard", "Art Direction", "Set Styling", "Visual Branding"],
  },
];

// Dummy studio values
const VALUES = [
  {
    icon: Target,
    title: "Cinematic Vision",
    description:
      "Kami memperlakukan setiap karya bukan sekadar dokumentasi biasa, melainkan cerita visual yang memiliki kedalaman rasa, komposisi artistik, dan nilai estetika tinggi.",
  },
  {
    icon: HeartHandshake,
    title: "Authentic Connection",
    description:
      "Suasana yang hangat dan bersahabat adalah kunci. Kami memastikan setiap momen tertangkap dengan ekspresi alami, tulus, dan nyaman bagi siapa pun di depan lensa.",
  },
  {
    icon: Award,
    title: "Detail & Craftsmanship",
    description:
      "Perhatian ekstra mulai dari riset konsep, manajemen pencahayaan, pemilihan lensa, hingga tahap color grading dan kontrol kualitas hasil akhir.",
  },
];

// Dummy team members
const TEAM_MEMBERS = [
  {
    name: "Rian Verdian",
    role: "Founder & Creative Director",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    bio: "Mengarahkan visi estetika dan storytelling visual RV Studio sejak awal perjalanan.",
  },
  {
    name: "Nadia Putri",
    role: "Lead Photographer & Art Stylist",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    bio: "Spesialis pencahayaan portraiture alami dan pengarah konsep gaya kontemporer.",
  },
  {
    name: "Dimas Arya",
    role: "Lead Cinematographer & Colorist",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    bio: "Fokus pada pergerakan kamera dinamis dan grading warna bernuansa sinematik.",
  },
  {
    name: "Sarah Clarissa",
    role: "Yearbook Art Director & Production",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    bio: "Mengelola kurasi desain editorial buku tahunan dari konsep hingga cetak sempurna.",
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

        {/* ─── 3. Story Section ────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center rounded-3xl border border-border/40 bg-card/20 p-6 sm:p-10 backdrop-blur-sm">
          {/* Visual Showcase Side */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-neutral-900 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80"
                alt="RV Studio Visual Production Gear & Atmosphere"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-white/70">
                  Behind the scenes
                </span>
                <p className="text-sm sm:text-base font-medium">
                  Crafted with passion, driven by cinematic storytelling.
                </p>
              </div>
            </div>
          </div>

          {/* Narrative Content Side */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                Cerita & Visi Kami
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Menghidupkan Cerita Lewat Sudut Pandang Sinematik
              </h2>
            </div>

            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              RV Studio lahir dari kecintaan mendalam terhadap seni visual dan
              kekuatan narasi. Kami percaya bahwa setiap perayaan wisuda,
              kebersamaan masa sekolah, maupun momen personal memiliki kehangatan
              tersendiri yang layak diabadikan dengan penghormatan estetika
              tertinggi.
            </p>

            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              Dengan perpaduan teknologi kamera mutakhir, tata cahaya studio yang
              presisi, dan pendekatan kolaboratif, kami hadir untuk memastikan
              setiap klien merasakan pengalaman yang menyenangkan serta
              menghasilkan karya yang tetap relevan hingga puluhan tahun ke depan.
            </p>

            {/* Checklist Highlights */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Eksplorasi konsep kreatif tanpa batas",
                "Grading warna sinematik & detail tajam",
                "Pendekatan personal & suasana santai",
                "Produksi buku tahunan terintegrasi",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-foreground/90">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 4. What We Do (Services / Pillars) ──────────────────────────── */}
        <section className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Layanan Utama
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Fokus Produksi Visual RV Studio
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Solusi komprehensif dari perencanaan konsep kreatif hingga eksekusi
              dan penyelesaian akhir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-border/40 bg-card/30 p-6 sm:p-8 backdrop-blur-sm hover:border-border/80 transition-all duration-300 hover:shadow-lg flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-muted/80 flex items-center justify-center border border-border/50 group-hover:scale-105 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-foreground" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-6 flex flex-wrap gap-2">
                    {service.tags.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-muted/60 text-muted-foreground border border-border/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 5. Core Values ──────────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Filosofi & Nilai
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Prinsip yang Mengarahkan Setiap Frame
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/40 bg-card/30 p-6 sm:p-7 backdrop-blur-sm space-y-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center border border-border/40">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <h3 className="text-lg font-bold">{val.title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 7. Call To Action ────────────────────────────────────────────── */}
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