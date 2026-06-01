import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/marketing/Hero";
import WorkGrid from "@/components/marketing/WorkGrid";
import CardScroller from "@/components/marketing/CardScroller";
import About from "@/components/marketing/About";
import Services from "@/components/marketing/Services";
import Contact from "@/components/marketing/Contact";
import FullWidthCta from "@/components/marketing/FullWidthCta";
import Footer from "@/components/layout/Footer";

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
