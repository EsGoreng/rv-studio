import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteConfig } from "@/lib/site";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
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
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "RV Project",
    template: "%s",
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/logo-rv.png" },
      { url: "/logo-rv.png", sizes: "32x32", type: "image/png" },
      { url: "/logo-rv.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/logo-rv.png",
    apple: [
      { url: "/logo-rv.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "RV Project",
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "RV Project",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RV Project",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rootSchema = {
    "@context": "https://schema.org",
    "@graph": [getOrganizationSchema(), getWebSiteSchema()],
  };

  return (
    <html
      lang="id"
      className={`${netflixSans.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={rootSchema} id="root-structured-data" />
        {children}
      </body>
    </html>
  );
}
