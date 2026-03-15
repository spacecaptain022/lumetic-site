import Navbar from "@/components/layout/Navbar";
import About from "@/components/marketing/About";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "About — Lumetic",
  description: "We make brands that lead. A brand identity studio working with founders and companies who treat design as a competitive advantage.",
};

export default function AboutPage() {
  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <div className="pt-24">
        <About />
      </div>
      <Footer />
    </main>
  );
}
