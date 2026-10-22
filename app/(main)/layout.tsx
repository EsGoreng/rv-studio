import { ReactNode } from "react";
import DitheredFooter from "@/components/ui/dithered-footer";
import BottomNavBar from "@/components/bottom-nav-bar";
import BackToTop from "@/components/ui/back-to-top";
import { getContactData } from "@/sanity/lib/queries";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const contact = await getContactData();

  return (
    <div className="relative min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
      <BottomNavBar />
      <BackToTop />
      <DitheredFooter
        brand="RV PROJECT"
        tagline="Mengabadikan momen, menciptakan kenangan abadi."
        contact={contact}
      />
    </div>
  );
}


