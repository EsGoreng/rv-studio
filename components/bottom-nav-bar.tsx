"use client";

import React from "react";
import {
  Home,
  Images,
  Film,
  HelpCircle,
  MessageCircle,
  Mail,
} from "lucide-react";
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
    href: "#",
  },
  {
    title: "Gallery",
    icon: Images,
    href: "#gallery",
  },
  {
    title: "Showcase",
    icon: Film,
    href: "#videography",
  },

  {
    title: "FAQ",
    icon: HelpCircle,
    href: "#faq",
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

    window.location.href = item.href;
  };

  return (
    <div
      className={cn(
        fixedBottom
          ? "fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] pointer-events-auto"
          : "relative mx-auto w-fit",
        className
      )}
    >
      <Dock
        className={cn(
          "items-end pb-3 border border-border/50 bg-background/80 shadow-2xl backdrop-blur-xl dark:bg-neutral-900/80 dark:border-neutral-800/80",
          dockClassName
        )}
      >
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <DockItem
              key={idx}
              className="aspect-square rounded-full bg-muted/80 hover:bg-muted dark:bg-neutral-800/80 dark:hover:bg-neutral-700/80 transition-colors cursor-pointer shadow-sm hover:shadow-md"
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
  );
}

export { BottomNavBar as AppleStyleDock };
export default BottomNavBar;
