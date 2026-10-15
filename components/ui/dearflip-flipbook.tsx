"use client";

import * as React from "react";
import { Loader2, RefreshCw, ExternalLink, Volume2, VolumeX, Eye, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

// Global polyfill for Promise.try (required by modern PDF.js builds if running in environments without native Promise.try)
if (typeof window !== "undefined") {
  const winPromise = window.Promise as unknown as {
    try?: (fn: (...args: unknown[]) => unknown, ...args: unknown[]) => Promise<unknown>;
  };
  if (typeof winPromise.try !== "function") {
    winPromise.try = function (fn: (...args: unknown[]) => unknown, ...args: unknown[]) {
      return new Promise((resolve) => resolve(fn(...args)));
    };
  }
}

// Global script loading promise to prevent duplicate loading
let dearFlipLoadPromise: Promise<void> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", (e) => reject(e));
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = (err) => reject(err);
    document.body.appendChild(script);
  });
}

function ensureStyle(href: string): void {
  if (typeof document === "undefined") return;
  if (!document.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = href;
    document.head.appendChild(link);
  }
}

export function loadDearFlipLibraries(): Promise<void> {
  if (dearFlipLoadPromise) return dearFlipLoadPromise;

  dearFlipLoadPromise = new Promise(async (resolve, reject) => {
    try {
      if (typeof window === "undefined") {
        resolve();
        return;
      }

      // 1. Ensure CSS files are loaded
      ensureStyle("/dflip/css/dflip.min.css");
      ensureStyle("/dflip/css/themify-icons.min.css");

      // 2. Set global dFlipLocation before dflip script execution
      (window as unknown as { dFlipLocation: string }).dFlipLocation = "/dflip/";

      // 3. Load jQuery first
      const win = window as unknown as {
        jQuery?: unknown;
        $: unknown;
        THREE?: unknown;
        MOCKUP?: unknown;
        pdfjsWorker?: unknown;
        pdfjsLib?: { GlobalWorkerOptions?: { workerSrc?: string } };
        DFLIP?: { defaults?: Record<string, unknown> };
      };

      if (!win.jQuery) {
        await loadScript("/dflip/js/libs/jquery.min.js");
      }

      // 4. Preload Three.js, Mockup.js, PDF.worker, and PDF.js to avoid relative 404 path issues on sub-routes
      if (!win.THREE) {
        await loadScript("/dflip/js/libs/three.min.js");
      }

      if (!win.MOCKUP) {
        await loadScript("/dflip/js/libs/mockup.min.js");
      }

      // Preload worker to expose window.pdfjsWorker.WorkerMessageHandler
      if (!win.pdfjsWorker) {
        await loadScript("/dflip/js/libs/pdf.worker.min.js");
      }

      if (!win.pdfjsLib) {
        await loadScript("/dflip/js/libs/pdf.min.js");
      }

      // Configure PDF.js worker
      if (win.pdfjsLib?.GlobalWorkerOptions) {
        win.pdfjsLib.GlobalWorkerOptions.workerSrc = "/dflip/js/libs/pdf.worker.min.js";
      }

      // 5. Load DearFlip main library
      const winDF = window as unknown as {
        DFLIP?: { defaults?: Record<string, unknown> };
        jQuery?: { fn?: { flipBook?: unknown } };
      };

      if (!winDF.DFLIP || !winDF.jQuery?.fn?.flipBook) {
        await loadScript("/dflip/js/dflip.min.js");
      }

      // 6. Explicitly set absolute asset paths on DFLIP defaults
      if (winDF.DFLIP?.defaults) {
        Object.assign(winDF.DFLIP.defaults, {
          mockupjsSrc: "/dflip/js/libs/mockup.min.js",
          pdfjsSrc: "/dflip/js/libs/pdf.min.js",
          pdfjsCompatibilitySrc: "/dflip/js/libs/compatibility.js",
          threejsSrc: "/dflip/js/libs/three.min.js",
          pdfjsWorkerSrc: "/dflip/js/libs/pdf.worker.min.js",
          soundFile: "/dflip/sound/turn2.mp3",
          imagesLocation: "/dflip/images",
          imageResourcesPath: "/dflip/images/pdfjs/",
          cMapUrl: "/dflip/js/libs/cmaps/",
        });
      }

      resolve();
    } catch (err) {
      console.error("Failed to load DearFlip libraries:", err);
      reject(err);
    }
  });

  return dearFlipLoadPromise;
}

export interface DearFlipViewerProps {
  source: string;
  bookTitle?: string;
  height?: string | number;
  webgl?: boolean;
  sound?: boolean;
  className?: string;
  onReady?: () => void;
  showCustomBar?: boolean;
}

export function DearFlipViewer({
  source,
  bookTitle = "Yearbook RV Studio",
  height = "600px",
  webgl = true,
  sound = true,
  className,
  onReady,
  showCustomBar = false,
}: DearFlipViewerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const flipBookInstanceRef = React.useRef<{
    dispose?: () => void;
    next?: () => void;
    prev?: () => void;
    zoom?: (delta: number) => void;
    setPageMode?: (isSingle: boolean) => void;
  } | null>(null);

  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);
  const [is3DMode, setIs3DMode] = React.useState(webgl);
  const [isSoundOn, setIsSoundOn] = React.useState(sound);

  // Initialize or re-initialize the flipbook
  React.useEffect(() => {
    let isCancelled = false;

    const initBook = async () => {
      setIsLoading(true);
      setLoadError(null);

      // Clean up previous instance before creating a new one
      if (flipBookInstanceRef.current?.dispose) {
        try {
          flipBookInstanceRef.current.dispose();
        } catch (e) {
          console.warn("Cleanup error in previous flipbook:", e);
        }
        flipBookInstanceRef.current = null;
      }

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }

      try {
        await loadDearFlipLibraries();

        if (isCancelled || !containerRef.current) return;

        const win = window as unknown as {
          jQuery: (el: HTMLElement) => {
            flipBook: (
              src: string,
              opts: Record<string, unknown>
            ) => {
              dispose?: () => void;
              next?: () => void;
              prev?: () => void;
              zoom?: (delta: number) => void;
              setPageMode?: (isSingle: boolean) => void;
            };
          };
        };

        if (!win.jQuery) {
          throw new Error("jQuery library could not be loaded for DearFlip.");
        }

        // Create mount target
        const bookDiv = document.createElement("div");
        bookDiv.className = "_df_book";
        bookDiv.style.width = "100%";
        bookDiv.style.height = "100%";
        containerRef.current.appendChild(bookDiv);

        const options: Record<string, unknown> = {
          source,
          bookTitle,
          webgl: is3DMode,
          webglShadow: true,
          soundEnable: isSoundOn,
          height: "100%",
          backgroundColor: "transparent",
          hard: "cover",
          scrollWheel: true,
          autoPlay: false,
          enableDownload: true,
          duration: 750,
          disableRange: true,
          disableAutoFetch: false,
          mockupjsSrc: "/dflip/js/libs/mockup.min.js",
          pdfjsSrc: "/dflip/js/libs/pdf.min.js",
          pdfjsCompatibilitySrc: "/dflip/js/libs/compatibility.js",
          threejsSrc: "/dflip/js/libs/three.min.js",
          pdfjsWorkerSrc: "/dflip/js/libs/pdf.worker.min.js",
          soundFile: "/dflip/sound/turn2.mp3",
          imagesLocation: "/dflip/images",
          imageResourcesPath: "/dflip/images/pdfjs/",
          cMapUrl: "/dflip/js/libs/cmaps/",
          allControls:
            "altPrev,pageNumber,altNext,play,outline,thumbnail,zoomIn,zoomOut,fullScreen,download,more,pageMode,startPage,endPage,sound",
          moreControls: "download,pageMode,startPage,endPage,sound",
          onReady: () => {
            if (!isCancelled) {
              setIsLoading(false);
              onReady?.();
            }
          },
        };

        const instance = win.jQuery(bookDiv).flipBook(source, options);
        flipBookInstanceRef.current = instance;

        // Fallback timer to clear loading overlay in case onReady takes time
        const fallbackTimer = setTimeout(() => {
          if (!isCancelled) setIsLoading(false);
        }, 1800);

        return () => clearTimeout(fallbackTimer);
      } catch (err) {
        if (!isCancelled) {
          console.error("Failed to render DearFlip flipbook:", err);
          setLoadError(
            err instanceof Error ? err.message : "Tidak dapat memuat komponen 3D Flipbook"
          );
          setIsLoading(false);
        }
      }
    };

    initBook();

    return () => {
      isCancelled = true;
      if (flipBookInstanceRef.current?.dispose) {
        try {
          flipBookInstanceRef.current.dispose();
        } catch {
          // ignore
        }
        flipBookInstanceRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [source, is3DMode, isSoundOn, retryCount, bookTitle, onReady]);

  return (
    <div
      className={cn(
        "relative w-full rounded-2xl bg-neutral-950/80 border border-white/10 overflow-hidden shadow-2xl backdrop-blur-sm flex flex-col",
        className
      )}
      style={{ minHeight: typeof height === "number" ? `${height}px` : height }}
    >
      {/* Top Helper Bar if enabled */}
      {showCustomBar && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-neutral-900/60 text-xs text-neutral-300">
          <div className="flex items-center gap-2 truncate">
            <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-medium truncate">{bookTitle}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIs3DMode((prev) => !prev)}
              className={cn(
                "px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors flex items-center gap-1",
                is3DMode
                  ? "bg-white/10 text-white border-white/20"
                  : "bg-transparent text-neutral-400 border-white/5 hover:text-white"
              )}
              title={is3DMode ? "Mode 3D Aktif (WebGL)" : "Mode 2D Aktif (HTML)"}
            >
              <Eye className="w-3 h-3" />
              <span>{is3DMode ? "3D Flip" : "2D Flip"}</span>
            </button>

            <button
              onClick={() => setIsSoundOn((prev) => !prev)}
              className={cn(
                "p-1.5 rounded-md text-neutral-400 hover:text-white border border-white/5 transition-colors",
                isSoundOn && "text-white bg-white/10 border-white/20"
              )}
              title={isSoundOn ? "Suara Kertas Aktif" : "Suara Kertas Mati"}
            >
              {isSoundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* Main Flipbook Canvas Container */}
      <div className="relative flex-1 w-full h-full min-h-[460px]">
        <div
          ref={containerRef}
          className="dearflip-wrapper w-full h-full select-none"
          style={{ height: "100%", width: "100%" }}
        />

        {/* Loading Overlay */}
        {isLoading && !loadError && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-neutral-950/85 backdrop-blur-md text-white px-4 text-center">
            <div className="relative mb-4">
              <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/15 flex items-center justify-center shadow-lg">
                <Loader2 className="w-7 h-7 text-white animate-spin" />
              </div>
            </div>
            <h4 className="text-sm font-semibold tracking-wide text-neutral-200">
              Menyiapkan 3D Flipbook...
            </h4>
            <p className="mt-1 text-xs text-neutral-400 max-w-xs">
              Memproses rendering halaman PDF realistis dengan efek lembaran kertas
            </p>
          </div>
        )}

        {/* Error Fallback */}
        {loadError && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-neutral-950/95 text-white p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3">
              <BookOpen className="w-6 h-6 text-red-400" />
            </div>
            <h4 className="text-sm font-semibold text-neutral-200">
              Gagal Memuat Preview Flipbook
            </h4>
            <p className="mt-1 text-xs text-neutral-400 max-w-sm mb-4">
              {loadError}. Pastikan browser mendukung WebGL atau buka dokumen secara langsung.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setRetryCount((c) => c + 1)}
                className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white flex items-center gap-1.5 border border-white/10 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Coba Lagi
              </button>
              <a
                href={source}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-xs font-medium text-white flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Buka PDF Langsung
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DearFlipViewer;
