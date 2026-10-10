"use client";

import * as React from "react";
import { MessageCircle, Send, Phone, Mail, MapPin, Sparkles, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ContactBlockProps {
  phoneNumber?: string; // Format international without + or symbols (e.g. 6281234567890)
  title?: string;
  subtitle?: string;
  className?: string;
}

export function ContactBlock({
  phoneNumber = "6281234567890", // Default nomor WhatsApp RV Studio
  title = "Contact Via Whatsapp",
  subtitle = "Punya rencana project buku tahunan, photoshoot kreatif, atau videography komersial? Ceritakan ide Anda langsung ke tim kami.",
  className,
}: ContactBlockProps) {
  const [name, setName] = React.useState("");
  const [service, setService] = React.useState("Buku Tahunan / Yearbook");
  const [budget, setBudget] = React.useState("");
  const [message, setMessage] = React.useState("");

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedMessage = [
      `*Halo RV Studio, saya ingin konsultasi project!*`,
      ``,
      `*Nama:* ${name.trim() || "-"}`,
      `*Layanan:* ${service}`,
      budget.trim() ? `*Estimasi Budget / Kebutuhan:* ${budget.trim()}` : null,
      ``,
      `*Pesan / Detail Project:*`,
      `${message.trim() || "Halo, saya tertarik dengan portfolio RV Studio dan ingin info pricelist/detail lebih lanjut."}`,
    ]
      .filter(Boolean)
      .join("\n");

    const waUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(formattedMessage)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="contact"
      className={cn(
        "relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 scroll-mt-12",
        className
      )}
    >

      {/* Header */}
      <div className="relative text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-3.5 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Info Card / Left Column */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl shadow-lg space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              Konsultasi Cepat & Ramah
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Tim kami siap mendiskusikan konsep visual, estimasi jadwal pemotretan, hingga penawaran paket harga khusus untuk sekolah, kampus, maupun korporat.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <MessageCircle className="size-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  WhatsApp Direct
                </p>
                <p className="text-sm font-semibold text-foreground mt-0.5">
                  +{phoneNumber}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <Clock className="size-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Waktu Respon
                </p>
                <p className="text-sm font-semibold text-foreground mt-0.5">
                  Senin - Sabtu (09.00 - 21.00 WIB)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <MapPin className="size-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Studio Base
                </p>
                <p className="text-sm font-semibold text-foreground mt-0.5">
                  Indonesia &middot; On-location & Studio
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/60">
            <p className="text-xs text-muted-foreground">
              Formulir di samping akan otomatis menyusun format pesan rapi dan membuka aplikasi WhatsApp Anda.
            </p>
          </div>
        </div>

        {/* WhatsApp Form / Right Column */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-xl">
          <form onSubmit={handleSendWhatsApp} className="space-y-5">
            {/* Input Nama */}
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">
                Nama Lengkap / Instansi <span className="text-destructive">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Dimas Setiawan (SMA 1 / PT Visual)"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background/90 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Pilihan Layanan & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="service" className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">
                  Pilihan Layanan
                </label>
                <select
                  id="service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background/90 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="Buku Tahunan / Yearbook">Buku Tahunan / Yearbook</option>
                  <option value="Creative Photography">Creative Photography</option>
                  <option value="Videography & Cinematic">Videography & Cinematic</option>
                  <option value="Corporate & Commercial">Corporate & Commercial</option>
                  <option value="Lainnya">Layanan Lainnya</option>
                </select>
              </div>

              <div>
                <label htmlFor="budget" className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">
                  Estimasi Budget / Jumlah Orang
                </label>
                <input
                  id="budget"
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Opsional (misal: ~150 siswa)"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background/90 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Input Pesan */}
            <div>
              <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">
                Pesan / Kebutuhan Detail
              </label>
              <textarea
                id="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ceritakan rencana konsep, tanggal kegiatan, atau pertanyaan Anda..."
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background/90 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Tombol Kirim ke WhatsApp */}
            <Button
              type="submit"
              size="lg"
              className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm sm:text-base shadow-lg shadow-emerald-600/25 transition-all duration-200 cursor-pointer active:scale-[0.99] gap-2.5"
            >
              <MessageCircle className="size-5 transition-transform group-hover:scale-110" />
              <span>Kirim Pesan ke WhatsApp</span>
              <Send className="size-4 ml-1 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

export const ContactSection = ContactBlock;
export default ContactBlock;
