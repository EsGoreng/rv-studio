import { ReactNode } from "react";
import DitheredFooter from "@/components/ui/dithered-footer";
import BottomNavBar from "@/components/bottom-nav-bar";
import BackToTop from "@/components/ui/back-to-top";
import WhatsAppButton from "@/components/ui/whatsapp-button";
import { getContactData } from "@/sanity/lib/queries";
import AnimatedGradient from "@/components/ui/animated-gradient";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const contact = await getContactData();

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Global background: fixed, behind everything */}
      <div className="fixed inset-0 -z-10">
        <AnimatedGradient
          config={{
            preset: "custom",
            // Aurora: dark base dengan glow abu terang yang mengalir vertikal
            color1: "#080808",  // hitam pekat – langit malam
            color2: "#5a5a5a",  // abu medium – cahaya aurora
            color3: "#0e0e0e",  // hampir hitam – background gelap
            rotation: -10,
            proportion: 38,
            scale: 0.55,
            speed: 8,
            distortion: 3,
            swirl: 55,
            swirlIterations: 8,
            softness: 100,      // sangat lembut = efek glow aurora
            offset: -400,
            shape: "Edge",      // Edge membuat pita horizontal seperti aurora
            shapeSize: 55,
          }}
          noise={{ opacity: 0.08, scale: 1.2 }}
        />
      </div>
      <main className="flex-1">{children}</main>
      <BottomNavBar />
      <WhatsAppButton phoneNumber={contact?.phoneNumber} />
      <BackToTop />
      <DitheredFooter
        brand="RV PROJECT"
        tagline="Mengabadikan momen, menciptakan kenangan abadi."
        contact={contact}
      />
    </div>
  );
}


