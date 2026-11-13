import type { Metadata } from "next";
import { ArrowUpRight, Lock } from "lucide-react";
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
              <a
                href="https://stripe.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 self-start text-[0.92rem] text-ink/70 transition-colors hover:text-ink"
              >
                <Lock aria-hidden className="h-4 w-4" strokeWidth={2} />
                <span className="link-line">Secure checkout by Stripe</span>
                <ArrowUpRight
                  aria-hidden
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </a>
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
