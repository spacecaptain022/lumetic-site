import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/layout/Cursor";
import CursorLabel from "@/components/layout/CursorLabel";
import SmoothScroll from "@/components/layout/SmoothScroll";
import ScrollProgress from "@/components/layout/ScrollProgress";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  faqJsonLd,
  organizationJsonLd,
  professionalServiceJsonLd,
  websiteJsonLd,
} from "@/lib/site-seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Branding Studio | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [...SITE_KEYWORDS],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Design",
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/Lumetic logo black no text.png",
    apple: "/Lumetic logo black no text.png",
  },
  openGraph: {
    title: `${SITE_NAME} — Branding Studio`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/lumetic-social-share.png",
        width: 1024,
        height: 350,
        alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@LumeticStudio",
    creator: "@LumeticStudio",
    title: `${SITE_NAME} — Branding Studio`,
    description: SITE_DESCRIPTION,
    images: ["/lumetic-social-share.png"],
  },
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    organizationJsonLd(),
    websiteJsonLd(),
    professionalServiceJsonLd(),
    faqJsonLd(),
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
        <noscript>
          <style>{`* { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <ScrollProgress />
        <Cursor />
        <CursorLabel />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
