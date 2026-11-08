import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter, Instrument_Sans } from "next/font/google";
import "./globals.css";
import ProjectDock from "@/components/dock/ProjectDock";
import SmoothScroll from "@/components/layout/SmoothScroll";
import {
  SHARE_DESCRIPTION,
  SHARE_TITLE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  OG_IMAGE,
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
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SHARE_TITLE} | ${SITE_TAGLINE}`,
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
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    site: "@LumeticStudio",
    creator: "@LumeticStudio",
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    images: [OG_IMAGE.url],
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${instrumentSans.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
        <noscript>
          <style>{`* { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <SmoothScroll>
          {children}
          <ProjectDock />
        </SmoothScroll>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
