"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Images,
  Film,
  HelpCircle,
  MessageCircle,
  Book,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";
import { cn } from "@/lib/utils";

export type NavItem = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
};

const DEFAULT_NAV_ITEMS: NavItem[] = [
  {
    title: "Home",
    icon: Home,
    href: "/",
  },
  {
    title: "Photography",
    icon: Images,
    href: "/photography",
  },
  {
    title: "Videography",
    icon: Film,
    href: "/videography",
  },
  {
    title: "Yearbook",
    icon: Book,
    href: "/yearbook",
  },
  {
    title: "About",
    icon: HelpCircle,
    href: "/about",
  },
  {
    title: "Contact",
    icon: MessageCircle,
    href: "#contact",
  },
];

export type BottomNavBarProps = {
  items?: NavItem[];
  className?: string;
  dockClassName?: string;
  fixedBottom?: boolean;
};

export function BottomNavBar({
  items = DEFAULT_NAV_ITEMS,
  className,
  dockClassName,
  fixedBottom = true,
}: BottomNavBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close menu on route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close menu on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  const handleClick = (item: NavItem) => {
    if (item.onClick) {
      item.onClick();
      return;
    }
    if (!item.href) return;

    if (item.href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (item.href.startsWith("#")) {
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    router.push(item.href);
  };

  return (
    <div
      className={cn(
        fixedBottom
          ? "fixed bottom-5 right-5 md:bottom-5 md:left-1/2 md:-translate-x-1/2 md:right-auto z-40 max-w-[95vw] pointer-events-auto"
          : "relative mx-auto w-fit",
        className
      )}
    >
      {/* Desktop Apple-Style Dock */}
      <div className="hidden md:block">
        <Dock
          className={cn(
            "items-end pb-3 border border-neutral-800/80 bg-neutral-900/80 shadow-2xl backdrop-blur-xl",
            dockClassName
          )}
        >
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <DockItem
                key={idx}
                className="aspect-square rounded-full bg-neutral-800/80 hover:bg-neutral-700/80 transition-colors cursor-pointer shadow-sm hover:shadow-md"
                onClick={() => handleClick(item)}
              >
                <DockLabel>{item.title}</DockLabel>
                <DockIcon>
                  <Icon className="h-full w-full text-foreground/80 hover:text-foreground transition-colors" />
                </DockIcon>
              </DockItem>
            );
          })}
        </Dock>
      </div>

      {/* Mobile Floating Menu (Bottom-Right, 3 Horizontal Lines -> Expand) */}
      <div ref={menuRef} className="relative flex flex-col items-end md:hidden">
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Blurred Background Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-30 bg-black/60 backdrop-blur-md"
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
              />

              {/* Expanded Menu Popover */}
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.92 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                style={{ transformOrigin: "bottom right" }}
                className="absolute bottom-full right-0 mb-3 z-40 w-56 rounded-2xl border border-neutral-800/80 bg-neutral-900/95 p-2 shadow-2xl backdrop-blur-2xl overflow-hidden"
                role="menu"
                aria-orientation="vertical"
              >
                <div className="flex flex-col gap-1">
                  {items.map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          handleClick(item);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer",
                          isActive
                            ? "bg-foreground/10 text-foreground font-semibold"
                            : "text-foreground/75 hover:text-foreground hover:bg-neutral-800/80 active:scale-[0.98]"
                        )}
                        role="menuitem"
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
                            isActive
                              ? "bg-foreground text-background"
                              : "bg-neutral-800/80 text-foreground/80"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="flex-1">{item.title}</span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 3 Horizontal Lines Button (Menu) */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "relative z-40 flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800/80 bg-neutral-900/85 shadow-2xl backdrop-blur-xl transition-all duration-200 active:scale-95 hover:bg-neutral-800/80 cursor-pointer",
            isOpen && "border-foreground/20 bg-neutral-900"
          )}
          aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          aria-expanded={isOpen}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-center"
              >
                <X className="h-5 w-5 text-foreground" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-center"
              >
                <Menu className="h-5 w-5 text-foreground" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}

export { BottomNavBar as AppleStyleDock };
export default BottomNavBar;
