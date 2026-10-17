import { siteConfig } from "@/lib/site";

/**
 * Generates the Organization & LocalBusiness schema for RV Project.
 * Complies with schema.org standards for AI extraction & Knowledge Graph representation.
 */
export function getOrganizationSchema() {
  const fullLogoUrl = siteConfig.url.startsWith("http")
    ? `${siteConfig.url}${siteConfig.ogImage}`
    : `https://rvproject.id${siteConfig.ogImage}`;

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    alternateName: ["RV Project"],
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      "@id": `${siteConfig.url}/#logo`,
      url: fullLogoUrl,
      caption: siteConfig.name,
    },
    image: fullLogoUrl,
    description: siteConfig.description,
    telephone: siteConfig.telephone,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kuningan",
      addressRegion: "Jawa Barat",
      addressCountry: "ID",
    },
    areaServed: [
      { "@type": "City", name: "Kuningan" },
      { "@type": "City", name: "Cirebon" },
      { "@type": "City", name: "Majalengka" },
      { "@type": "City", name: "Indramayu" },
      { "@type": "AdministrativeArea", name: "Jawa Barat" },
      { "@type": "Country", name: "Indonesia" },
    ],
    sameAs: [siteConfig.socials.instagram],
    knowsAbout: [
      "School Yearbook Production",
      "Buku Kenangan Sekolah",
      "Cinematic Videography",
      "Portrait and Graduation Photography",
      "Creative Direction",
      "3D Digital Flipbook",
    ],
  };
}

/**
 * Generates WebSite schema with search and language hints.
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    inLanguage: "id-ID",
  };
}

/**
 * Generates BreadcrumbList schema.
 */
export function getBreadcrumbSchema(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

/**
 * Generates Service schema for specific offerings.
 */
export function getServiceSchema({
  name,
  description,
  serviceType,
  path,
}: {
  name: string;
  description: string;
  serviceType: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    provider: {
      "@id": `${siteConfig.url}/#organization`,
    },
    areaServed: {
      "@type": "Country",
      name: "Indonesia",
    },
    url: `${siteConfig.url}${path}`,
  };
}
