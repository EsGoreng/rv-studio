"use client";

import * as React from "react";
import { X, ExternalLink, BookOpen, Sparkles, Download } from "lucide-react";
import { DearFlipViewer } from "@/components/ui/dearflip-flipbook";
import type { YearbookItem } from "@/constants/yearbook";

export interface YearbookPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  yearbook: YearbookItem | null;
}

export function YearbookPreviewModal({
  isOpen,
  onClose,
  yearbook,
}: YearbookPreviewModalProps) {
  // Handle ESC key to close modal
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll when modal is active
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !yearbook) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full h-full max-w-7xl max-h-[96vh] rounded-3xl bg-neutral-950/95 border border-white/15 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-neutral-900/80 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/20 shrink-0 shadow-inner"
              style={{
                background: `linear-gradient(135deg, ${yearbook.color || "#1e293b"} 0%, #000 100%)`,
              }}
            >
              <BookOpen className="w-4 h-4 text-white" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                  {yearbook.title}
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/10 text-neutral-300 border border-white/10">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  3D Interactive Flipbook
                </span>
              </div>
              <p className="text-xs text-neutral-400 truncate">
                {yearbook.subtitle || yearbook.institution}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {yearbook.pdfUrl && (
              <a
                href={yearbook.pdfUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-neutral-200 border border-white/10 transition-colors"
                title="Unduh Berkas PDF Asli"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PDF</span>
              </a>
            )}

            {yearbook.pdfUrl && (
              <a
                href={yearbook.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-neutral-200 border border-white/10 transition-colors"
                title="Buka PDF di Tab Baru"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Tab Baru</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors border border-white/10"
              aria-label="Tutup Preview Flipbook"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Flipbook Body */}
        <div className="relative flex-1 w-full h-[calc(100%-65px)] bg-black/60 overflow-hidden">
          <DearFlipViewer
            source={yearbook.pdfUrl || "/dflip/books/intro.pdf"}
            bookTitle={yearbook.title}
            height="100%"
            webgl={true}
            sound={true}
            showCustomBar={false}
            className="w-full h-full rounded-none border-none bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}

export default YearbookPreviewModal;
