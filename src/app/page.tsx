import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/marketing/Hero";
import Services from "@/components/marketing/Services";
import About from "@/components/marketing/About";
import Ventures from "@/components/marketing/Ventures";
import Contact from "@/components/marketing/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="bg-background min-h-screen">
      <Navbar />

      <div id="hero">
        <Hero />
      </div>

      <div id="services">
        <Services />
      </div>

      <div id="about">
        <About />
      </div>

      <div id="ventures">
        <Ventures />
      </div>

      <div id="contact">
        <div className="pt-24">
          <Contact />
        </div>
      </div>

      <Footer />
    </main>
  );
}
