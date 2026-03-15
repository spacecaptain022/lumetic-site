import Navbar from "@/components/layout/Navbar";
import Contact from "@/components/marketing/Contact";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Contact — Lumetic",
  description: "Start a project with Lumetic. Let's build something great together.",
};

export default function ContactPage() {
  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <div className="pt-24">
        <Contact />
      </div>
      <Footer />
    </main>
  );
}
