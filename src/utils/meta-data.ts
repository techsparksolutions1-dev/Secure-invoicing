import { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

export const defaultMetadata: Metadata = {
  title: "Secure Invoicing | Code Aura - Invoice Generator",
  description:
    "A dynamic and customizable invoice generation system. Supports branded client IDs, unique invoice serials, PDF exports, and scalable formats.",

  applicationName: "Invoice Generator",
  creator: "TechSaws",
  generator: "Next.js",
  keywords: ["Invoice", "invoice-generator", "generator", "secure-invoicing"],

  alternates: {
    canonical: BASE_URL,
  },

  icons: {
    icon: [
      {
        rel: "icon",
        type: "image/png",
        url: "/favicons/logo-512x512.png",
        sizes: "512x512",
      },
      {
        rel: "icon",
        type: "image/png",
        url: "/favicons/logo-192x192.png",
        sizes: "192x192",
      },
      {
        rel: "icon",
        type: "image/png",
        url: "/favicons/logo-96x96.png",
        sizes: "96x96",
      },
      {
        rel: "icon",
        type: "image/png",
        url: "/favicons/logo.png",
        sizes: "834x408",
      },
      { rel: "icon", type: "image/svg+xml", url: "/favicons/logo.svg" },
      { rel: "icon", type: "image/x-icon", url: "/favicons/favicon.ico" },
      {
        rel: "shortcut icon",
        type: "image/x-icon",
        url: "/favicons/favicon.ico",
      },
    ],
    apple: [
      {
        rel: "apple-touch-icon",
        url: "/favicons/apple-icon.png",
        sizes: "180x180",
      },
    ],
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    title: "Secure Invoicing | Code Aura - Invoice Generator",
    description:
      "A dynamic and customizable invoice generation system. Supports branded client IDs, unique invoice serials, PDF exports, and scalable formats.",
    siteName: "Invoice Generator",
    images: [
      {
        url: "/social/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Secure Invoicing | Code Aura - Invoice Generator",
    description:
      "A dynamic and customizable invoice generation system. Supports branded client IDs, unique invoice serials, PDF exports, and scalable formats.",
    images: ["/social/twitter-preview.jpg"],
    creator: "@TechSaws",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
};

export function GetPageMetadata(overrides: Partial<Metadata> = {}): Metadata {
  return {
    ...defaultMetadata,
    ...overrides,
    title: overrides.title ?? defaultMetadata.title,
    description: overrides.description ?? defaultMetadata.description,
    openGraph: {
      ...defaultMetadata.openGraph,
      ...overrides.openGraph,
      title: overrides.title || defaultMetadata.openGraph?.title,
      description:
        overrides.description || defaultMetadata.openGraph?.description,
    },
    twitter: {
      ...defaultMetadata.twitter,
      ...overrides.twitter,
      title: overrides.title || defaultMetadata.twitter?.title,
      description:
        overrides.description || defaultMetadata.twitter?.description,
    },
  };
}
