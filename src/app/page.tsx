import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import About from "@/components/marketing/About";
import CardScroller from "@/components/marketing/CardScroller";
import Contact from "@/components/marketing/Contact";
import FullWidthCta from "@/components/marketing/FullWidthCta";
import Hero from "@/components/marketing/Hero";
import Services from "@/components/marketing/Services";
import WorkGrid from "@/components/marketing/WorkGrid";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site-seo";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Branding Studio | ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} — Branding Studio`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
};

export default function Home() {
  return (
    <main className="bg-background min-h-screen">
      <Navbar />

      <div id="hero">
        <Hero />
      </div>

      <div id="work">
        <WorkGrid />
      </div>

      <CardScroller />

      <div id="about">
        <About />
      </div>

      <div id="services">
        <Services />
      </div>

      <div id="contact">
        <Contact />
      </div>

      <FullWidthCta />
      <Footer variant="dark" />
    </main>
  );
}
