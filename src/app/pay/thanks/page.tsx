import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import SiteNav from "@/components/layout/SiteNav";
import BlockLink from "@/components/ui/BlockLink";
import { formatStripeAmount, getStripe, isStripeConfigured } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Payment received",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Summary = { amount: string; project?: string; pending: boolean };

/** Reads the Checkout Session for display only. The webhook, not this page, is what notifies Lumetic. */
async function loadSummary(sessionId: string | undefined): Promise<Summary | null> {
  if (!sessionId || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId) || !isStripeConfigured()) return null;
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.amount_total == null || !session.currency) return null;
    return {
      amount: formatStripeAmount(session.amount_total, session.currency),
      project: session.metadata?.project,
      pending: session.payment_status !== "paid",
    };
  } catch {
    return null;
  }
}

export default async function PayThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const summary = await loadSummary(session_id);

  return (
    <>
      <SiteNav />
      <main id="main" className="bg-paper">
        <section className="pb-24 pt-32 md:pb-36 md:pt-40">
          <div className="wrap max-w-3xl">
            <p className="label-mono mb-6">{"(    PAYMENTS    )"}</p>
            <h1 className="h-big">{summary?.pending ? "Payment processing." : "Thank you."}</h1>
            <p className="lede mt-6 max-w-[32rem] text-ink/70">
              {summary?.pending
                ? "Your bank payment is on its way. It can take a few business days to clear, and we'll email you when it does."
                : "Your payment went through. A receipt is on its way to your inbox, and the Lumetic team has been notified."}
            </p>
            {summary && (
              <dl className="mt-10 grid max-w-[32rem] grid-cols-2 gap-6 border-t pt-5">
                <div>
                  <dt className="label mb-1.5 opacity-60">Amount</dt>
                  <dd className="text-[1rem] font-medium">{summary.amount}</dd>
                </div>
                {summary.project && (
                  <div>
                    <dt className="label mb-1.5 opacity-60">For</dt>
                    <dd className="text-[1rem] font-medium">{summary.project}</dd>
                  </div>
                )}
              </dl>
            )}
            <div className="mt-12">
              <BlockLink href="/">Back to Lumetic</BlockLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
