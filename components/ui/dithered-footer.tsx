"use client";

import React, { useRef, useState, type CSSProperties, type FormEvent, type PointerEvent, type ReactNode } from "react";
import { MessageCircle, Send, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export type FooterLink = { label: string; href: string };
export type FooterColumn = { title: string; links: FooterLink[] };
export type FooterSocial = { label: string; href: string; icon: ReactNode };

export type ContactInfo = {
    title?: string;
    subtitle?: string;
    phoneNumber?: string;
    responseHours?: string;
    studioBase?: string;
};

export type DitheredFooterProps = {
    brand?: string;
    /** Where the wordmark links to. */
    brandHref?: string;
    tagline?: string;
    columns?: FooterColumn[];
    socials?: FooterSocial[];
    legal?: FooterLink[];
    copyright?: string;
    /** Link to your real status page, shown with a green dot. Off unless you pass one. */
    status?: FooterLink | null;
    /** Colour of the dot field. Changed to white/gray neutral. */
    accent?: string;
    /** Contact info from Sanity or configuration */
    contact?: ContactInfo | null;
    /** Optional subscribe callback for newsletter if used */
    onSubscribe?: (email: string) => void | Promise<void>;
};

// Stochastic dither: vertical noise, sparse at the top and dense at the bottom,
// thresholded to on/off in one inline SVG filter. Used as a mask, so the dots
// take whatever accent colour you pass.
const DITHER =
    "url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27360%27%20height%3D%27240%27%3E%3Cdefs%3E%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%270%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270.04%27%20stop-color%3D%27%23000%27%2F%3E%3Cstop%20offset%3D%270.96%27%20stop-color%3D%27%23fff%27%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%27f%27%20x%3D%270%27%20y%3D%270%27%20width%3D%27100%25%27%20height%3D%27100%25%27%20color-interpolation-filters%3D%27sRGB%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.45%27%20numOctaves%3D%272%27%20seed%3D%277%27%20stitchTiles%3D%27stitch%27%20result%3D%27n%27%2F%3E%3CfeColorMatrix%20in%3D%27n%27%20type%3D%27matrix%27%20values%3D%271%200%200%200%200%201%200%200%200%200%201%200%200%200%200%200%200%200%200%201%27%20result%3D%27ng%27%2F%3E%3CfeComposite%20in%3D%27SourceGraphic%27%20in2%3D%27ng%27%20operator%3D%27arithmetic%27%20k2%3D%270.5%27%20k3%3D%270.5%27%20result%3D%27s%27%2F%3E%3CfeComponentTransfer%20in%3D%27s%27%20result%3D%27t%27%3E%3CfeFuncR%20type%3D%27discrete%27%20tableValues%3D%270%201%27%2F%3E%3C%2FfeComponentTransfer%3E%3CfeColorMatrix%20in%3D%27t%27%20type%3D%27matrix%27%20values%3D%270%200%200%200%201%200%200%200%200%200.5%200%200%200%200%200%201%200%200%200%200%27%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27url%28%23g%29%27%20filter%3D%27url%28%23f%29%27%2F%3E%3C%2Fsvg%3E')";

const GRID = "radial-gradient(circle, #000 0.9px, transparent 1.3px)";

// Scoped by the df- prefix. Masks and motion live here rather than in utility
// classes, so the component renders the same on Tailwind v3 and v4.
const STYLES = `
.df-field { position: absolute; inset: 0; }
.df-field.df-lit {
  -webkit-mask-image: radial-gradient(circle 220px at var(--df-x, 50%) var(--df-y, 50%), #000 40%, rgb(0 0 0 / .2) 100%);
  mask-image: radial-gradient(circle 220px at var(--df-x, 50%) var(--df-y, 50%), #000 40%, rgb(0 0 0 / .2) 100%);
}
.df-dots {
  position: absolute; top: 0; bottom: 0; left: 0;
  width: calc(100% + 360px);
  background: var(--df-accent, #d4d4d8);
  -webkit-mask-image: ${GRID}, ${DITHER};
  mask-image: ${GRID}, ${DITHER};
  -webkit-mask-size: 4px 4px, 360px 240px;
  mask-size: 4px 4px, 360px 240px;
  -webkit-mask-repeat: repeat, repeat-x;
  mask-repeat: repeat, repeat-x;
  -webkit-mask-position: 0 0, left bottom;
  mask-position: 0 0, left bottom;
  -webkit-mask-composite: source-in;
  mask-composite: intersect;
}
@media (prefers-reduced-motion: no-preference) {
  .df-dots { animation: df-drift 40s linear infinite; }
  @supports (animation-timeline: view()) {
    .df-band { view-timeline: --df-band; }
    .df-mark { animation: df-rise linear both; animation-timeline: --df-band; animation-range: entry 20% entry 100%; }
  }
}
@keyframes df-drift { to { translate: -360px 0; } }
@keyframes df-rise { from { translate: 0 30%; } }
`;

const icon = (d: string) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d={d} /></svg>
);

const DEFAULT_SOCIALS: FooterSocial[] = [
    { label: "X", href: "https://x.com", icon: icon("M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z") },
    { label: "GitHub", href: "https://github.com", icon: icon("M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5") },
    { label: "LinkedIn", href: "https://linkedin.com", icon: icon("M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z") },
];

const DEFAULT_COLUMNS: FooterColumn[] = [
    {
        title: "Halaman",
        links: [
            { label: "Videography", href: "/#videography" },
            { label: "Photography", href: "/#gallery" },
            { label: "Yearbook", href: "/#yearbook" },
        ],
    },
];

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/60";
const coarse = "[@media(pointer:coarse)]:inline-flex [@media(pointer:coarse)]:min-h-11 [@media(pointer:coarse)]:items-center";

export default function DitheredFooter({
    brand = "RV Studio",
    brandHref = "/",
    tagline = "Layanan produksi visual, fotografi kreatif, videography sinematik, dan buku tahunan profesional.",
    columns = DEFAULT_COLUMNS,
    socials = DEFAULT_SOCIALS,
    legal = [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
    ],
    copyright,
    status = null,
    accent = "#d4d4d8", // Warna putih/abu-abu neutral
    contact,
}: DitheredFooterProps) {
    const displayCopyright = copyright ?? `© 2025 ${brand}, Inc.`;

    // Contact info and WhatsApp form state
    const phoneNumber = contact?.phoneNumber ?? "6281234567890";
    const contactTitle = contact?.title ?? "Contact Via WhatsApp";
    const contactSubtitle =
        contact?.subtitle ??
        "Punya rencana project buku tahunan, photoshoot kreatif, atau videography komersial? Ceritakan ide Anda langsung ke tim kami.";
    const responseHours = contact?.responseHours ?? "Senin - Sabtu (09.00 - 21.00 WIB)";
    const studioBase = contact?.studioBase ?? "Indonesia · On-location & Studio";

    const [name, setName] = useState("");
    const [service, setService] = useState("Buku Tahunan / Yearbook");
    const [budget, setBudget] = useState("");
    const [message, setMessage] = useState("");

    const field = useRef<HTMLDivElement>(null);
    const frame = useRef(0);

    const handleSendWhatsApp = (e: FormEvent) => {
        e.preventDefault();

        const formattedMessage = [
            `*Halo ${brand}, saya ingin konsultasi project!*`,
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

    // Spotlight: dots under mouse pointer stay at full strength and the rest dim
    const onMove = (e: PointerEvent<HTMLDivElement>) => {
        if (e.pointerType !== "mouse" || !field.current) return;
        const el = field.current;
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
            el.style.setProperty("--df-x", `${x}px`);
            el.style.setProperty("--df-y", `${y}px`);
            el.classList.add("df-lit");
        });
    };
    const onLeave = () => {
        cancelAnimationFrame(frame.current);
        field.current?.classList.remove("df-lit");
    };

    const toTop = () =>
        window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });

    return (
        <footer
            id="contact"
            className="overflow-hidden border-t border-border bg-background text-foreground scroll-mt-12"
            style={{ "--df-accent": accent } as CSSProperties}
        >
            <style>{STYLES}</style>

            <div className="mx-auto max-w-6xl px-6 pb-16 pt-16 sm:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 items-start">
                    {/* Left Column: Brand, Tagline, Navigation, & Contact Info */}
                    <div className="lg:col-span-5 space-y-8">
                        <div>
                            <a href={brandHref} className={`text-2xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-80 ${focus}`}>
                                {brand}
                            </a>
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                {tagline}
                            </p>
                        </div>

                        {/* Navigation / Halaman (Videography, Photography, Yearbook) */}
                        {columns.map((col) => (
                            <nav key={col.title} aria-label={col.title}>
                                <p className="text-xs font-semibold uppercase tracking-wider text-foreground">{col.title}</p>
                                <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                                    {col.links.map((l) => (
                                        <li key={l.label}>
                                            <a
                                                href={l.href}
                                                className={`rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground ${focus} ${coarse}`}
                                            >
                                                {l.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        ))}

                        {/* Contact Quick Details from contact.tsx */}
                        <div className="space-y-4 pt-2 border-t border-border/60">
                            <div className="flex items-start gap-3.5">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground/80 border border-border/80">
                                    <MessageCircle className="size-4" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                        WhatsApp Direct
                                    </p>
                                    <p className="text-sm font-semibold text-foreground mt-0.5">
                                        +{phoneNumber}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground/80 border border-border/80">
                                    <Clock className="size-4" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                        Waktu Respon
                                    </p>
                                    <p className="text-sm font-medium text-foreground mt-0.5">
                                        {responseHours}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground/80 border border-border/80">
                                    <MapPin className="size-4" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                        Studio Base
                                    </p>
                                    <p className="text-sm font-medium text-foreground mt-0.5">
                                        {studioBase}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Social Icons & Back to top */}
                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-1.5">
                                {socials.map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        aria-label={s.label}
                                        className={`grid h-8 w-8 place-items-center rounded-lg border border-border/60 bg-muted/30 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${focus}`}
                                    >
                                        {s.icon}
                                    </a>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={toTop}
                                className={`inline-flex items-center gap-1.5 rounded-sm text-xs text-muted-foreground transition-colors hover:text-foreground cursor-pointer ${focus}`}
                            >
                                Back to top
                                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6" /></svg>
                            </button>
                        </div>

                        {/* Copyright & Legal Links */}
                        <div className="pt-3 border-t border-border/60 text-xs text-muted-foreground">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                                <p>{displayCopyright}</p>
                                {legal.map((l) => (
                                    <a
                                        key={l.label}
                                        href={l.href}
                                        className={`transition-colors hover:text-foreground ${focus}`}
                                    >
                                        {l.label}
                                    </a>
                                ))}
                                {status && (
                                    <a
                                        href={status.href}
                                        className={`inline-flex items-center gap-1.5 transition-colors hover:text-foreground ${focus}`}
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                                        {status.label}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: WhatsApp Interactive Form from contact.tsx */}
                    <div className="lg:col-span-7 space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold tracking-tight text-foreground">
                                {contactTitle}
                            </h3>
                            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                {contactSubtitle}
                            </p>
                        </div>

                        <form onSubmit={handleSendWhatsApp} className="space-y-4">
                            {/* Input Nama Lengkap / Instansi */}
                            <div>
                                <label htmlFor="df-name" className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">
                                    Nama Lengkap / Instansi <span className="text-destructive">*</span>
                                </label>
                                <input
                                    id="df-name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Contoh: Dimas Setiawan (SMA 1 / PT Visual)"
                                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-all"
                                />
                            </div>

                            {/* Pilihan Layanan & Budget */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="df-service" className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">
                                        Pilihan Layanan
                                    </label>
                                    <select
                                        id="df-service"
                                        value={service}
                                        onChange={(e) => setService(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-input bg-transparent text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-all cursor-pointer"
                                    >
                                        <option value="Buku Tahunan / Yearbook" className="bg-background text-foreground">Buku Tahunan / Yearbook</option>
                                        <option value="Creative Photography" className="bg-background text-foreground">Creative Photography</option>
                                        <option value="Videography & Cinematic" className="bg-background text-foreground">Videography & Cinematic</option>
                                        <option value="Corporate & Commercial" className="bg-background text-foreground">Corporate & Commercial</option>
                                        <option value="Lainnya" className="bg-background text-foreground">Layanan Lainnya</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="df-budget" className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">
                                        Estimasi Budget / Jumlah Orang
                                    </label>
                                    <input
                                        id="df-budget"
                                        type="text"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        placeholder="Opsional (misal: ~150 siswa)"
                                        className="w-full px-4 py-2.5 rounded-xl border border-input bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Input Pesan */}
                            <div>
                                <label htmlFor="df-message" className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">
                                    Pesan / Kebutuhan Detail
                                </label>
                                <textarea
                                    id="df-message"
                                    rows={3}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Ceritakan rencana konsep, tanggal kegiatan, atau pertanyaan Anda..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-all resize-none"
                                />
                            </div>

                            {/* Tombol Kirim ke WhatsApp (Putih / Monokrom) */}
                            <button
                                type="submit"
                                className="w-full h-11 sm:h-12 rounded-xl bg-foreground text-background hover:opacity-90 font-medium text-sm sm:text-base shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
                            >
                                <MessageCircle className="size-4 sm:size-5" />
                                <span>Kirim Pesan ke WhatsApp</span>
                                <Send className="size-4 ml-0.5 opacity-80" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Dither dot band with wordmark in white/gray accent */}
            <div aria-hidden="true" className="df-band relative h-60 overflow-hidden" onPointerMove={onMove} onPointerLeave={onLeave}>
                <div ref={field} className="df-field">
                    <div className="df-dots" />
                </div>
                <p className="df-mark pointer-events-none absolute -bottom-[0.05em] left-3 select-none text-[clamp(5rem,21vw,13rem)] font-bold leading-[0.8] tracking-[-0.06em] text-background sm:left-5">
                    {brand}
                </p>
            </div>
        </footer>
    );
}

export { DitheredFooter };
