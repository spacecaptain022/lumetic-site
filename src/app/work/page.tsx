import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import SiteNav from "@/components/layout/SiteNav";
import BlockLink from "@/components/ui/BlockLink";
import WorkIndex from "@/components/work/WorkIndex";
import { SITE_NAME, SITE_URL } from "@/lib/site-seo";

export const metadata: Metadata = {
  title: "Work — Brand Systems & Digital Projects",
  description:
    "Explore Lumetic brand identity systems, web design, motion, and digital work for forward-thinking companies.",
  alternates: { canonical: `${SITE_URL}/work` },
  openGraph: {
    title: `Work | ${SITE_NAME}`,
    description:
      "Explore Lumetic brand identity systems, web design, motion, and digital work for forward-thinking companies.",
    url: `${SITE_URL}/work`,
  },
};

export default function WorkCatalogPage() {
  return (
    <>
      <SiteNav />
      <main id="main" className="bg-paper">
        <WorkIndex />
        <section className="border-t">
          <div className="wrap flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-end md:py-24">
            <div>
              <p className="label">Next step</p>
              <h2 className="h-section mt-4">Ready to start a project?</h2>
            </div>
            <BlockLink href="/#contact">Get in touch</BlockLink>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
