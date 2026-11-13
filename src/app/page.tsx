import type { Metadata } from "next";
import Intro from "@/components/intro/Intro";
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
import { HOME_TITLE, OG_IMAGE, SHARE_DESCRIPTION, SHARE_TITLE, SITE_DESCRIPTION, SITE_URL, faqJsonLd } from "@/lib/site-seo";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    url: SITE_URL,
    images: [OG_IMAGE],
  },
};

export default function Home() {
  return (
    <>
      <Intro />
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
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }} />
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
