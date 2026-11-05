import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import SiteNav from "@/components/layout/SiteNav";
import About from "@/components/marketing/About";
import Approach from "@/components/marketing/Approach";
import Contact from "@/components/marketing/Contact";
import Faq from "@/components/marketing/Faq";
import Hero from "@/components/marketing/Hero";
import Services from "@/components/marketing/Services";
import Statement from "@/components/marketing/Statement";
import System from "@/components/marketing/System";
import VideoCta from "@/components/marketing/VideoCta";
import Work from "@/components/marketing/Work";
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
    <>
      <SiteNav />
      <main id="main">
        <Hero />
        <div id="studio">
          <Statement />
        </div>
        <div id="work">
          <Work />
        </div>
        <div id="services">
          <Services />
        </div>
        <div id="system">
          <System />
        </div>
        <div id="about">
          <About />
        </div>
        <div id="approach">
          <Approach />
        </div>
        <div id="faq">
          <Faq />
        </div>
        <VideoCta />
        <div id="contact">
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
