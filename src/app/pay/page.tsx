import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import SiteNav from "@/components/layout/SiteNav";
import PayForm from "@/components/pay/PayForm";

export const metadata: Metadata = {
  title: "Make a payment",
  description: "Pay a Lumetic deposit or invoice securely with Stripe.",
  robots: { index: false, follow: false },
};

export default function PayPage() {
  return (
    <>
      <SiteNav />
      <main id="main" className="bg-paper">
        <section className="pb-24 pt-32 md:pb-36 md:pt-40">
          <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col gap-6 lg:col-span-5">
              <p className="label-mono">{"(    PAYMENTS    )"}</p>
              <h1 className="h-big max-w-[7em]">Make a payment.</h1>
              <p className="max-w-[26rem] text-[0.92rem] text-ink/60">
                Have a question about an amount?{" "}
                <a href="mailto:hello@lumetic.io" className="link-line font-medium text-ink">
                  hello@lumetic.io
                </a>
              </p>
            </div>
            <div className="rounded-[16px] bg-card p-5 md:p-8 lg:col-span-7">
              <PayForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
