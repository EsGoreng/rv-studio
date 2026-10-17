"use client";

import * as React from "react";
import { X, BookOpen, Download } from "lucide-react";
import { DearFlipViewer } from "@/components/ui/dearflip-flipbook";
import type { YearbookItem } from "@/components/blocks/yearbook-client";

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
      <div className="yearbook-modal-content relative w-full h-full max-w-7xl max-h-[96vh] rounded-3xl bg-neutral-950/95 border border-white/15 shadow-2xl flex flex-col overflow-hidden">
        {/* Scoped styles to remove gray accent from chevron navigation buttons */}
        <style>{`
          .yearbook-modal-content .df-ui-prev,
          .yearbook-modal-content .df-ui-next,
          .yearbook-modal-content .df-ui-start,
          .yearbook-modal-content .df-ui-end,
          .yearbook-modal-content .df-ui-alt,
          .yearbook-modal-content .ti-angle-left,
          .yearbook-modal-content .ti-angle-right,
          .yearbook-modal-content .ti-angle-double-left,
          .yearbook-modal-content .ti-angle-double-right {
            background: transparent !important;
            background-color: transparent !important;
            border: none !important;
            border-right: none !important;
            box-shadow: none !important;
            color: #ffffff !important;
            opacity: 0.8 !important;
          }

          .yearbook-modal-content .df-ui-prev:hover,
          .yearbook-modal-content .df-ui-next:hover,
          .yearbook-modal-content .df-ui-start:hover,
          .yearbook-modal-content .df-ui-end:hover,
          .yearbook-modal-content .df-ui-alt:hover,
          .yearbook-modal-content .ti-angle-left:hover,
          .yearbook-modal-content .ti-angle-right:hover,
          .yearbook-modal-content .df-ui-prev.df-active,
          .yearbook-modal-content .df-ui-next.df-active {
            background: transparent !important;
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
            color: #ffffff !important;
            opacity: 1 !important;
          }

          .yearbook-modal-content .df-container > .df-ui-prev,
          .yearbook-modal-content .df-container > .df-ui-next,
          .yearbook-modal-content .df-container.df-floating > .df-ui-prev,
          .yearbook-modal-content .df-container.df-floating > .df-ui-next {
            background: transparent !important;
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
            color: #ffffff !important;
            opacity: 0.75 !important;
          }

          .yearbook-modal-content .df-container > .df-ui-prev:hover,
          .yearbook-modal-content .df-container > .df-ui-next:hover,
          .yearbook-modal-content .df-container.df-floating > .df-ui-prev:hover,
          .yearbook-modal-content .df-container.df-floating > .df-ui-next:hover {
            background: transparent !important;
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
            color: #ffffff !important;
            opacity: 1 !important;
          }
        `}</style>

        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-neutral-900/80 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                  {yearbook.title}
                </h3>
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
          {yearbook.pdfUrl ? (
            <DearFlipViewer
              source={yearbook.pdfUrl}
              bookTitle={yearbook.title}
              height="100%"
              webgl={true}
              sound={true}
              showCustomBar={false}
              className="w-full h-full rounded-none border-none bg-transparent"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-neutral-400" />
              </div>
              <h4 className="text-base font-semibold text-white">
                Berkas PDF Belum Tersedia
              </h4>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-sm">
                Buku kenangan ini belum memiliki berkas PDF yang diunggah di Sanity Studio.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default YearbookPreviewModal;
