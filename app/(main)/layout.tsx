import { ReactNode } from "react";
import BottomNavBar from "@/components/bottom-nav-bar";

export default function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
      {/* <BottomNavBar stickyBottom defaultIndex={0} /> */}
    </div>
  );
}
