import type { Metadata } from "next";
import CatalogNav from "@/components/catalog/CatalogNav";
import ProjectCatalog from "@/components/catalog/ProjectCatalog";

export const metadata: Metadata = {
  title: "Project Catalog | Lumetic",
  description: "Explore brand systems, digital work, and motion from Lumetic.",
};

export default function WorkCatalogPage() {
  return (
    <main className="min-h-screen bg-background">
      <CatalogNav />
      <ProjectCatalog />
    </main>
  );
}
