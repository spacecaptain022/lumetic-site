import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import SiteNav from "@/components/layout/SiteNav";
import ResolveTool from "@/components/resolve/ResolveTool";
import { SITE_NAME, SITE_URL } from "@/lib/site-seo";

const description = "Type your company name and watch it come out of the noise. Get the image free.";

export const metadata: Metadata = {
  title: "Resolve Your Brand",
  description,
  alternates: { canonical: `${SITE_URL}/resolve` },
  openGraph: {
    title: `Resolve Your Brand | ${SITE_NAME}`,
    description,
    url: `${SITE_URL}/resolve`,
    images: [{ url: "/api/resolve/image?name=Your%20brand&style=ink", width: 1080, height: 1350, alt: "Your brand, resolved by Lumetic" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@LumeticStudio",
    title: `Resolve Your Brand | ${SITE_NAME}`,
    description,
    images: ["/api/resolve/image?name=Your%20brand&style=ink"],
  },
};

export default function ResolvePage() {
  return (
    <>
      <SiteNav />
      <main id="main" className="bg-paper pb-24 pt-[calc(var(--nav-h)+2.5rem)] md:pb-36 md:pt-[calc(var(--nav-h)+4rem)]">
        <div className="wrap">
          <ResolveTool />
        </div>
      </main>
      <Footer />
    </>
  );
}
