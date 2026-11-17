"use client";

import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/ui/BlockLink";
import PixelGlyph, { type GlyphName } from "@/components/ui/PixelGlyph";
import SectionHead from "@/components/ui/SectionHead";
import { prefillContact } from "@/lib/contact-prefill";

/*
 * What Lumetic does, said as the result a business owner gets. Each card opens the closest
 * practice page in /work. Get found and Get booked share the web page, which covers both.
 * Payments and blockchain have no /work page yet, so those cards open the contact form with
 * the service picked.
 */
const OUTCOMES: {
  title: string;
  body: string;
  includes: string[];
  glyph: GlyphName;
  href: string;
  image: string;
  /** When set, the card opens the contact form with this service picked instead of a page. */
  service?: string;
}[] = [
  {
    title: "Get found",
    body: "Websites and online stores that work on every phone, plus Google and local ads.",
    includes: ["Web design", "E-commerce, Shopify or custom", "Google listing & SEO", "Local ads"],
    glyph: "web",
    href: "/work/web-design-digital-presence",
    image: "/gallery/web-design-digital-v2.png",
  },
  {
    title: "Get booked",
    body: "Booking, quote forms, and checkout, so a visit turns into a customer.",
    includes: ["Online booking", "Quote & estimate forms", "Checkout & payments", "Tap-to-call & lead capture"],
    glyph: "calendar",
    href: "/work/web-design-digital-presence",
    image: "/gallery/motion-visual-v2.png",
  },
  {
    title: "Runs on its own",
    body: "Systems that handle reminders, follow-ups, and busywork by themselves.",
    includes: ["Autonomous systems & flows", "Agents & automations", "Headless, API-first builds", "1,700+ app integrations", "Custom software"],
    glyph: "chip",
    href: "/work/web3-ai-dev-services",
    image: "/gallery/web3-ai-dev.png",
  },
  {
    title: "Get paid",
    body: "Payment rails for cards, bank transfers, invoices, subscriptions, and stablecoins, built into your site or app.",
    includes: ["Card, ACH & Apple Pay", "Invoices & subscriptions", "Stablecoin & USDC payments", "Payouts & marketplaces"],
    glyph: "pay",
    href: "#contact",
    image: "/gallery/new-york.png",
    service: "Payment Rails & Blockchain",
  },
  {
    title: "Own it on-chain",
    body: "Blockchain solutions: smart contracts, tokens, and records anyone can verify, built safe and simple to use.",
    includes: ["Smart contracts", "Tokenization & digital assets", "Wallets & on-chain payments", "Verifiable records"],
    glyph: "chain",
    href: "#contact",
    image: "/gallery/collage.png",
    service: "Payment Rails & Blockchain",
  },
  {
    title: "Look the part",
    body: "A brand, packaging, and content that look as good as the work you do.",
    includes: ["Brand identity", "Strategy & naming", "Packaging", "Motion & content"],
    glyph: "brand",
    href: "/work/brand-identity-strategy",
    image: "/gallery/brand-identity.png",
  },
];

export default function Services() {
  return (
    <section className="pb-24 pt-24 md:pb-36 md:pt-36">
      <div className="wrap">
        <SectionHead title={["What we", "do for you."]} tag="WHAT WE DO" note="One piece or all six" />
        <p className="lede mt-6 max-w-[36rem] text-ink/70">
          Most businesses don&apos;t need more tech. They need more people finding them, less time
          on the phone, and fewer things to keep track of. Here&apos;s how Lumetic helps, from
          websites and online stores to autonomous systems, payment rails, and blockchain.
        </p>
      </div>

      {/* Scrolls sideways on small screens, two rows of three on large ones */}
      <ul className="mt-10 flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-3 overflow-x-auto px-[var(--gutter)] pb-2 [scrollbar-width:none] md:mt-12 lg:wrap lg:grid lg:grid-cols-3 lg:overflow-visible">
        {OUTCOMES.map((item, i) => (
          <li key={item.title} className="w-[78vw] max-w-[22rem] shrink-0 snap-start lg:w-auto lg:max-w-none">
            <Link
              href={item.href}
              onClick={item.service ? () => prefillContact({ service: item.service }) : undefined}
              className="group relative flex aspect-[4/5] lg:aspect-[5/4] flex-col justify-between overflow-hidden rounded-[16px] bg-card p-5 transition-colors duration-500 hover:text-paper focus-visible:text-paper md:p-6"
            >
              <span aria-hidden className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-swift group-hover:opacity-100 group-focus-visible:opacity-100">
                <Image src={item.image} alt="" fill sizes="(min-width: 1024px) 33vw, 78vw" className="object-cover" />
                <span className="absolute inset-0 bg-ink/55" />
              </span>

              <span className="label-mono relative">{`(     ${String(i + 1).padStart(3, "0")}     )`}</span>

              <span className="relative flex justify-center transition-transform duration-700 ease-swift group-hover:scale-75 group-hover:opacity-0">
                <PixelGlyph name={item.glyph} className="h-16 w-16 md:h-20 md:w-20" />
              </span>

              <span className="relative">
                <span className="flex items-center justify-between gap-3">
                  <span className="text-[0.82rem] font-semibold uppercase tracking-[0.01em]">{item.title}</span>
                  <Arrow className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </span>
                <span className="mt-2 block text-[0.95rem] leading-[1.45] opacity-70">{item.body}</span>
              </span>
            </Link>

            <p className="label-mono mt-5 opacity-50">Includes</p>
            <ul className="mt-2 border-t border-ink/12">
              {item.includes.map((name) => (
                <li key={name} className="border-b border-ink/12 py-2 text-[0.92rem] leading-[1.35]">
                  {name}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
