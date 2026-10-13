import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const netflixSans = localFont({
  src: [
    {
      path: "./fonts/NetflixSans-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/NetflixSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/NetflixSans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/NetflixSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-netflix-sans",
});

export const metadata: Metadata = {
  title: "RV Studio",
  description: "RV Studio Portfolio and Showcase",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${netflixSans.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
