import { ReactNode } from "react";
import DitheredFooter from "@/components/ui/dithered-footer";
import BottomNavBar from "@/components/bottom-nav-bar";

export default function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
      <BottomNavBar />
      <DitheredFooter brand="RV PROJECT" tagline="Crafting immersive digital & visual experiences." />
    </div>
  );
}


