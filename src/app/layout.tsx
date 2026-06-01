import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/layout/Cursor";
import CursorLabel from "@/components/layout/CursorLabel";
import SmoothScroll from "@/components/layout/SmoothScroll";
import ScrollProgress from "@/components/layout/ScrollProgress";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lumetic.io"),
  title: "Lumetic",
  description: "Clarity over noise.",
  icons: {
    icon: "/Lumetic logo black no text.png",
    apple: "/Lumetic logo black no text.png",
  },
  openGraph: {
    title: "Lumetic",
    description: "Clarity over noise.",
    url: "https://lumetic.io",
    siteName: "Lumetic",
    type: "website",
    images: [{ url: "/lumetic-social-share.png", width: 1024, height: 350, alt: "Lumetic — Clarity over noise." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumetic",
    description: "Clarity over noise.",
    images: ["/lumetic-social-share.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Lumetic",
  url: "https://lumetic.io",
  logo: "https://lumetic.io/Lumetic logo black no text.png",
  description: "Clarity over noise.",
  sameAs: ["https://x.com/LumeticStudio"],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
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
