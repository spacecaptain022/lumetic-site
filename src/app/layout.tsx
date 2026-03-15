import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/layout/Cursor";
import SmoothScroll from "@/components/layout/SmoothScroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Lumetic — Branding Agency",
  description: "We craft brand identities that define culture. Strategy, vision, and design for forward-thinking companies.",
  icons: {
    icon: "/Lumetic logo black no text.png",
    apple: "/Lumetic logo black no text.png",
  },
  openGraph: {
    images: [{ url: "/L Social share 2026.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/L Social share 2026.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${bebas.variable} antialiased`}>
        <noscript>
          <style>{`* { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <Cursor />
        <SmoothScroll>
        {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
