import type { Metadata } from "next";
import CatalogNav from "@/components/catalog/CatalogNav";
import ProjectCatalog from "@/components/catalog/ProjectCatalog";
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
    <main className="min-h-screen bg-background">
      <CatalogNav />
      <ProjectCatalog />
    </main>
  );
}
