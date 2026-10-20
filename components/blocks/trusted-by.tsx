"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/sanity/lib/image";

export interface ClientItem {
  id: string;
  name: string;
  logo?: any;
  externalLogoUrl?: string;
}

export const DEFAULT_CLIENTS: ClientItem[] = [
  { id: "sman8", name: "SMAN 8 Jakarta" },
  { id: "ui", name: "Universitas Indonesia" },
  { id: "taruna-nusantara", name: "SMA Taruna Nusantara" },
  { id: "labschool", name: "Labschool Kebayoran" },
  { id: "itb", name: "Institut Teknologi Bandung" },
  { id: "kanisius", name: "SMA Kolese Kanisius" },
  { id: "al-azhar", name: "SMA Islam Al-Azhar 1" },
  { id: "ugm", name: "Universitas Gadjah Mada" },
  { id: "penabur", name: "SMAK 1 BPK Penabur" },
  { id: "binus", name: "Binus University" },
  { id: "santa-ursula", name: "SMA Santa Ursula" },
  { id: "sman3-bandung", name: "SMAN 3 Bandung" },
];

function getInitials(name: string): string {
  if (!name) return "RV";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  if (words[0].toLowerCase() === "sma" || words[0].toLowerCase() === "sman") {
    return `${words[0]} ${words[1] || ""}`.trim().slice(0, 6);
  }
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export interface TrustedByProps {
  title?: string;
  items?: ClientItem[];
  className?: string;
  data?: {
    items?: Array<{
      _key?: string;
      name?: string;
      logo?: any;
      externalLogoUrl?: string;
    }>;
  } | null;
}

function LogoItem({ client }: { client: ClientItem }) {
  const logoSrc = resolveImageUrl(client.logo, client.externalLogoUrl, {
    width: 300,
    quality: 80,
  });

  return (
    <div
      className="flex items-center justify-center select-none shrink-0 group/item opacity-75 hover:opacity-100 transition-all duration-300"
      title={client.name}
    >
      {logoSrc ? (
        <div className="h-14 sm:h-16 md:h-20 flex items-center justify-center shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt={client.name}
            className="h-11 sm:h-14 md:h-16 max-w-[170px] sm:max-w-[220px] md:max-w-[260px] w-auto object-contain brightness-90 group-hover/item:brightness-100 group-hover/item:scale-105 transition-all duration-300"
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : (
        <span className="font-bold text-base sm:text-lg md:text-xl tracking-widest text-neutral-400 group-hover/item:text-white uppercase transition-colors px-3 py-1.5">
          {getInitials(client.name)}
        </span>
      )}
    </div>
  );
}

export function TrustedBy({
  title = "Dipercaya oleh",
  items: propItems,
  className,
  data,
}: TrustedByProps) {
  const clients: ClientItem[] = React.useMemo(() => {
    if (propItems && propItems.length > 0) return propItems;

    if (data?.items && data.items.length > 0) {
      return data.items
        .filter((item) => item.name && item.name.trim() !== "")
        .map((item, index) => ({
          id: item._key || `client-${index + 1}`,
          name: item.name || `Klien ${index + 1}`,
          logo: item.logo,
          externalLogoUrl: item.externalLogoUrl,
        }));
    }

    return DEFAULT_CLIENTS;
  }, [data?.items, propItems]);

  return (
    <section
      id="trusted-by"
      className={cn(
        "relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 scroll-mt-12",
        className
      )}
    >
      {/* Section Header */}
      {title && (
        <div className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            {title}
          </h2>
        </div>
      )}

      {/* Static Horizontal Logo List */}
      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 max-w-5xl mx-auto">
        {clients.map((client) => (
          <LogoItem key={client.id} client={client} />
        ))}
      </div>
    </section>
  );
}

export const TrustedBySection = TrustedBy;
export default TrustedBy;
