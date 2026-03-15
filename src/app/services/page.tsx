import Navbar from "@/components/layout/Navbar";
import Services from "@/components/marketing/Services";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Services — Lumetic",
  description: "Brand identity, web design, and motion — everything your brand needs to lead.",
};

export default function ServicesPage() {
  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <div className="pt-24">
        <Services />
      </div>
      <Footer />
    </main>
  );
}
