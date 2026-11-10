import Footer from "@/components/layout/Footer";
import SiteNav from "@/components/layout/SiteNav";
import BlockLink from "@/components/ui/BlockLink";

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main id="main" className="wrap flex min-h-[80svh] flex-col justify-end pb-16 pt-[calc(var(--nav-h)+3rem)]">
        <p className="label">404</p>
        <h1 className="h-big mt-4 max-w-[8em]">This page isn&apos;t here.</h1>
        <p className="lede mt-6 max-w-[30rem]">
          It may have moved. Head back to explore Lumetic&apos;s work and services.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <BlockLink href="/">Back to home</BlockLink>
          <BlockLink href="/work" tone="outline">
            View work
          </BlockLink>
        </div>
      </main>
      <Footer />
    </>
  );
}
