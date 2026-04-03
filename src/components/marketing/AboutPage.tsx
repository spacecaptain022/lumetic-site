"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AboutHeroBackground from "@/components/three/AboutHeroBackground";
import { scrollRevealViewport } from "@/lib/motion";

/** Lusion-style service ticks (https://labs.lusion.co/about) */
const heroServices = [
  "IMMERSIVE BRAND SYSTEMS",
  "DIGITAL & WEB",
  "MOTION & CONTENT",
  "WEB3 & AI",
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: scrollRevealViewport,
    transition: { duration: 0.85, ease, delay },
  };
}

const pillars = [
  {
    id: "01",
    title: "Identity & systems",
    body: "Strategy, naming, and visual systems that scale—so your brand stays coherent from pitch deck to product.",
  },
  {
    id: "02",
    title: "Digital & motion",
    body: "Websites, content, and motion that feel intentional—not like templates bolted onto a logo.",
  },
  {
    id: "03",
    title: "Web3 & AI integration",
    body: "When you’re ready: smart contracts, Web3 touchpoints, and AI workflows wired into how you actually work.",
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <header className="relative flex min-h-[100svh] w-full flex-col justify-center overflow-hidden">
        {/* https://labs.lusion.co/about — particle field + soft mesh */}
        <AboutHeroBackground />
        <div
          className="pointer-events-none absolute inset-0 z-[1] opacity-[0.12] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex w-full max-w-[56rem] flex-col px-5 pb-16 pt-24 md:px-8 md:pb-24 md:pt-28">
          <p className="absolute right-5 top-20 font-mono text-[9px] uppercase tracking-[0.35em] text-white/25 md:right-8 md:top-24">
            Lab / 2026
          </p>

          {/*
            Lusion staircase (labs.lusion.co/about): (WE ARE)+L1; L2 indent; L3 indent + list; L4 flush left.
            Visual-only block + sr-only h1 for valid markup (no ul inside heading).
          */}
          <div className="text-white">
            <h1 className="sr-only">
              The creative division of a brand identity studio. Lumetic is a branding and digital studio.
            </h1>
            <motion.div {...fadeUp(0)} className="mx-auto w-full max-w-[48rem]" aria-hidden="true">
              <div
                className="font-sans font-semibold text-white antialiased"
                style={{
                  fontSize: "clamp(1.65rem, 4.2vw, 3.35rem)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.035em",
                }}
              >
                {/* Line 1 */}
                <span className="flex flex-wrap items-baseline gap-x-3 md:gap-x-4">
                  <span className="font-mono text-[0.28em] font-normal uppercase leading-none tracking-[0.28em] text-white/55">
                    (WE ARE)
                  </span>
                  <span>The creative</span>
                </span>

                {/* Line 2 */}
                <span className="mt-[0.12em] block pl-[1.5rem] sm:pl-[2.5rem] md:pl-[3.5rem] lg:pl-[4.25rem]">
                  division of a
                </span>

                {/* Line 3 — short word + list */}
                <span className="mt-[0.12em] flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10 xl:gap-14">
                  <span className="block pl-[2.75rem] sm:pl-[4.5rem] md:pl-[6.5rem] lg:pl-[8rem]">
                    brand
                  </span>
                  <ul className="flex shrink-0 flex-col gap-2 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-white/50 md:text-[10px] lg:max-w-[13.5rem] lg:pt-[0.15em]">
                    {heroServices.map((line) => (
                      <li key={line} className="flex gap-2">
                        <span className="text-white/30">→</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </span>

                {/* Line 4 */}
                <span className="mt-[0.2em] flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <span>identity studio</span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/35 md:text-[10px]">
                    (↗ LUMETIC)
                  </span>
                </span>
              </div>
            </motion.div>

            <motion.p
              {...fadeUp(0.14)}
              className="mx-auto mt-16 max-w-xl font-sans text-[0.9rem] leading-relaxed text-white/40 md:mt-20 md:text-[0.95rem]"
            >
              Lumetic is a studio for identity, digital, and emerging tech—helping founders and teams
              define who they are, how they show up, and how they ship.
            </motion.p>
          </div>
        </div>
      </header>

      <div className="h-px w-full bg-white/[0.08]" />

      {/* Editorial */}
      <section className="px-5 md:px-12 py-24 md:py-36 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <motion.div {...fadeUp(0)} className="lg:col-span-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40 lg:sticky lg:top-32">
                <span className="text-white/55">(01)</span>
                <br />
                The studio
              </p>
            </motion.div>
            <div className="lg:col-span-9 space-y-10">
              <motion.p
                {...fadeUp(0.05)}
                className="font-display uppercase leading-[1.06] text-white/[0.92]"
                style={{ fontSize: "clamp(1.55rem, 4.2vw, 3.4rem)", letterSpacing: "0.03em" }}
              >
                Most teams rush to visuals before they know the story. We start with the uncomfortable
                questions—who this is for, why it should exist, and what must stay true when everything
                else changes.
              </motion.p>
              <motion.p
                {...fadeUp(0.1)}
                className="font-sans text-white/45 max-w-2xl leading-relaxed text-sm md:text-base border-l border-white/10 pl-6 md:pl-8"
              >
                That discipline is how we build identities and interfaces that feel inevitable: clear
                enough to explain in a sentence, strong enough to last for years.
              </motion.p>
            </div>
          </div>
      </section>

      <div className="h-px w-full bg-white/[0.08]" />

      {/* Pillars */}
      <section className="px-5 md:px-12 py-20 md:py-32 max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-6 mb-14 md:mb-20">
            <motion.p {...fadeUp(0)} className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
              <span className="text-white/55">(02)</span> What we touch
            </motion.p>
            <motion.p {...fadeUp(0.04)} className="font-mono text-[9px] text-white/25 max-w-xs md:text-right">
              Capabilities across brand, product, and infrastructure.
            </motion.p>
          </div>
          <ul className="flex flex-col border-t border-white/[0.08]">
            {pillars.map((p, i) => (
              <motion.li
                key={p.id}
                {...fadeUp(i * 0.06)}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 py-12 md:py-16 border-b border-white/[0.08] group"
              >
                <span className="md:col-span-2 font-mono text-[10px] text-white/30 tracking-[0.16em] tabular-nums">
                  {p.id}
                </span>
                <h2 className="md:col-span-4 font-display uppercase tracking-[0.04em] text-2xl md:text-3xl lg:text-[2.35rem] leading-none text-white/95 group-hover:text-white transition-colors">
                  {p.title}
                </h2>
                <p className="md:col-span-5 md:col-start-8 font-sans text-white/45 text-sm md:text-[0.95rem] leading-relaxed self-end">
                  {p.body}
                </p>
              </motion.li>
            ))}
          </ul>
      </section>

      <div className="h-px w-full bg-white/[0.08]" />

      {/* Statement */}
      <section className="px-5 md:px-12 py-28 md:py-40 max-w-[1600px] mx-auto">
          <motion.p
            {...fadeUp(0)}
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35 text-center mb-10"
          >
            (03) Manifesto
          </motion.p>
          <motion.p
            {...fadeUp(0.06)}
            className="font-display uppercase text-center leading-[0.95] text-white/[0.92] max-w-5xl mx-auto"
            style={{ fontSize: "clamp(1.85rem, 5.2vw, 4.25rem)", letterSpacing: "0.04em" }}
          >
            Strategy, craft, and code—
            <span className="text-white/30"> one team.</span>
          </motion.p>
      </section>

      <div className="h-px w-full bg-white/[0.08]" />

      {/* CTA */}
      <section className="px-5 md:px-12 py-24 md:py-32 max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-12">
          <motion.h2
            {...fadeUp(0)}
            className="font-display uppercase leading-[0.9]"
            style={{ fontSize: "clamp(2.6rem, 7.5vw, 5.75rem)", letterSpacing: "0.03em" }}
          >
            Let&apos;s define
            <br />
            your next chapter.
          </motion.h2>
          <motion.div {...fadeUp(0.08)} className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center gap-2.5 bg-white text-black font-sans font-medium px-8 py-3.5 rounded-full text-sm tracking-wide hover:bg-white/90 transition-colors group"
            >
              Start a project
              <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white/75 hover:text-white hover:border-white/40 font-sans font-medium px-8 py-3.5 rounded-full text-sm tracking-wide transition-colors"
            >
              Back to home
            </Link>
          </motion.div>
      </section>
    </div>
  );
}
