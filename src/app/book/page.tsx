import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookingEmbed from "@/components/book/BookingEmbed";
import Footer from "@/components/layout/Footer";
import SiteNav from "@/components/layout/SiteNav";
import { Arrow } from "@/components/ui/BlockLink";
import Mark from "@/components/ui/Mark";
import { bookingEmbedUrl, isBookingEnabled } from "@/lib/booking";

export const metadata: Metadata = {
  title: "Book a call",
  description: "Book an intro call with Lumetic. Bring the idea or the problem, and leave with a clear next step.",
  alternates: { canonical: "/book" },
};

const STEPS = [
  { title: "Pick a time", body: "Every open slot is live, shown in your time zone." },
  { title: "Share the idea", body: "One question when you book: what are you imagining?" },
  { title: "Talk it through", body: "Meet on Google Meet and leave with a clear next step." },
];

const DETAILS = [
  { label: "Format", value: "Video call" },
  { label: "Platform", value: "Google Meet" },
  { label: "Cost", value: "Free" },
  { label: "Invite", value: "Sent by email" },
];

export default function BookPage() {
  if (!isBookingEnabled()) notFound();

  return (
    <>
      <SiteNav />
      <main id="main" className="bg-paper">
        <section className="p-[6px] md:p-2">
          <div className="relative overflow-hidden rounded-[16px] bg-ink text-paper md:rounded-[20px]">
            <div className="wrap relative grid grid-cols-1 gap-10 pb-10 pt-32 md:pb-16 md:pt-40 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-14">
              {/* Intro */}
              <div className="lg:col-span-5 lg:row-start-1">
                <div className="mb-8 flex items-center gap-3">
                  <Mark className="h-5 w-auto text-mauve" />
                  <p className="label-mono text-paper/70">{"(    BOOK A CALL    )"}</p>
                </div>
                <h1 className="h-big max-w-[7em]">Talk it through.</h1>
                <p className="lede mt-6 max-w-[26rem] text-paper/70">
                  An intro call with Lumetic. Bring the idea or the problem, and leave with a clear next step.
                </p>
              </div>

              {/* Calendar */}
              <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
                <div className="overflow-hidden rounded-[14px] bg-paper text-ink shadow-[0_30px_80px_-30px_rgb(0_0_0/0.6)]">
                  <div className="flex items-center justify-between gap-4 border-b px-4 py-3 md:px-5">
                    <div className="flex items-center gap-2.5">
                      <Mark className="h-4 w-auto" />
                      <span className="label">Intro call</span>
                    </div>
                    <span className="label inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 text-paper">
                      <span className="booking-dot h-1.5 w-1.5 rounded-full bg-mauve" aria-hidden />
                      Booking open
                    </span>
                  </div>
                  <div className="p-[6px]">
                    <BookingEmbed src={bookingEmbedUrl()} />
                  </div>
                  <p className="label border-t px-4 py-3 text-ink/55 md:px-5">
                    Scheduling by Google Calendar. Your invite and Meet link arrive by email.
                  </p>
                </div>
              </div>

              {/* How it works and the details */}
              <div className="flex flex-col gap-10 lg:col-span-5 lg:row-start-2 lg:self-end">
                <ol className="border-t border-paper/12">
                  {STEPS.map((step, i) => (
                    <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-y-1 border-b border-paper/12 py-4">
                      <span className="label-mono pt-[0.3em] text-mauve">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <p className="text-[1.05rem] font-semibold tracking-[-0.01em]">{step.title}</p>
                        <p className="mt-1 text-[0.95rem] leading-[1.5] text-paper/60">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-2">
                  {DETAILS.map((d) => (
                    <div key={d.label}>
                      <dt className="label mb-1.5 text-paper/45">{d.label}</dt>
                      <dd className="text-[0.98rem] font-medium">{d.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-paper/12 pt-5 text-[0.95rem]">
                  <Link href="/#contact" className="group inline-flex items-center gap-2 font-medium">
                    <span className="link-line">Prefer to write? Start a project</span>
                    <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                  <a href="mailto:hello@lumetic.io" className="text-paper/60 transition-colors hover:text-paper">
                    hello@lumetic.io
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
