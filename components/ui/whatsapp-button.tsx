"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface WhatsAppButtonProps {
  /**
   * Nomor WhatsApp format internasional tanpa simbol + (misal: 6281234567890).
   * Jika tidak diberikan, tombol tidak akan muncul.
   */
  phoneNumber?: string;
  /**
   * Pesan pre-fill yang akan terisi otomatis di WhatsApp.
   * @default "Halo, saya ingin bertanya tentang layanan RV Project."
   */
  message?: string;
  /**
   * Scroll distance (px) sebelum tombol muncul.
   * @default 300
   */
  threshold?: number;
  /**
   * CSS classes tambahan untuk positioning atau styling.
   */
  className?: string;
  /**
   * Accessible label untuk screen reader.
   * @default "Hubungi kami via WhatsApp"
   */
  ariaLabel?: string;
}

export function WhatsAppButton({
  phoneNumber,
  message = "Halo, saya ingin bertanya tentang layanan RV Project.",
  threshold = 300,
  className,
  ariaLabel = "Hubungi kami via WhatsApp",
}: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  useEffect(() => {
    const handleNavMenu = (e: Event) => {
      setNavMenuOpen((e as CustomEvent<{ open: boolean }>).detail.open);
    };
    window.addEventListener("navmenu", handleNavMenu);
    return () => window.removeEventListener("navmenu", handleNavMenu);
  }, []);

  // Tidak render jika tidak ada nomor
  if (!phoneNumber) return null;

  const encodedMessage = encodeURIComponent(message);
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <AnimatePresence>
      {isVisible && !navMenuOpen && (
        <motion.a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className={cn(
            // Di atas BackToTop: right sama (right-5/md:right-6), bottom lebih tinggi (bottom-36/md:bottom-22)
            "fixed bottom-36 right-5 md:bottom-22 md:right-6 z-40 group flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800/80 bg-neutral-900/85 text-foreground shadow-2xl backdrop-blur-xl transition-all duration-200 hover:bg-[#25D366]/15 hover:border-[#25D366]/60 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/50",
            className
          )}
          aria-label={ariaLabel}
          title={ariaLabel}
        >
          {/* WhatsApp SVG icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-5 w-5 fill-foreground/80 transition-colors duration-200 group-hover:fill-[#25D366]"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
        </motion.a>
      )}
    </AnimatePresence>
  );
}

export default WhatsAppButton;
