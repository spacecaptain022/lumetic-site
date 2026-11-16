import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookingEmbed from "@/components/book/BookingEmbed";
import Footer from "@/components/layout/Footer";
import SiteNav from "@/components/layout/SiteNav";
import { Arrow } from "@/components/ui/BlockLink";
import { bookingEmbedUrl, isBookingEnabled } from "@/lib/booking";

export const metadata: Metadata = {
  title: "Book a call",
  description: "Book a call with Lumetic. Bring the idea or the problem, and leave with a clear next step.",
  alternates: { canonical: "/book" },
};

const BRING = [
  "The idea, or the problem you want solved.",
  "What it should become: a brand, a store, software, or a system that runs on its own.",
  "Anything already in place, from a logo to a stack of tools.",
];

export default function BookPage() {
  if (!isBookingEnabled()) notFound();

  return (
    <>
      <SiteNav />
      <main id="main" className="bg-paper">
        <section className="pb-24 pt-32 md:pb-36 md:pt-40">
          <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col gap-10 lg:col-span-5 lg:self-start lg:sticky lg:top-32">
              <div>
                <p className="label-mono mb-6">{"(    BOOK A CALL    )"}</p>
                <h1 className="h-big max-w-[7em]">Talk it through.</h1>
                <p className="lede mt-6 max-w-[26rem] text-ink/70">
                  Pick a time that suits you. Bring the idea or the problem, and leave the call with a clear
                  next step.
                </p>
              </div>

              <div className="max-w-[28rem] border-t pt-5">
                <p className="label mb-4 opacity-60">What to bring</p>
                <ol className="flex flex-col gap-3">
                  {BRING.map((item, i) => (
                    <li key={item} className="grid grid-cols-[2rem_1fr] text-[0.98rem] leading-[1.5]">
                      <span className="label-mono pt-[0.2em] opacity-50">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-ink/80">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <dl className="grid max-w-[28rem] grid-cols-2 gap-6 border-t pt-5">
                <div>
                  <dt className="label mb-1.5 opacity-60">Prefer to write?</dt>
                  <dd>
                    <Link href="/#contact" className="group inline-flex items-center gap-2 text-[1rem] font-medium">
                      <span className="link-line">Start a project</span>
                      <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="label mb-1.5 opacity-60">Email</dt>
                  <dd>
                    <a href="mailto:hello@lumetic.io" className="text-[1rem] font-medium">
                      <span className="link-line">hello@lumetic.io</span>
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[16px] bg-card p-[6px] md:p-2 lg:col-span-7">
              <BookingEmbed src={bookingEmbedUrl()} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
