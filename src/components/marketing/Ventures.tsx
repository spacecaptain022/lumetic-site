"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { scrollRevealViewport } from "@/lib/motion";

const ease = [0.22, 1, 0.36, 1] as const;

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 36 },
    whileInView: { opacity: 1, y: 0 },
    viewport: scrollRevealViewport,
    transition: { duration: 0.88, ease, delay },
  };
}

function fadeIn(delay: number) {
  return {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: scrollRevealViewport,
    transition: { duration: 0.88, ease, delay },
  };
}

const focus = [
  { label: "Brand-led Companies", desc: "Businesses where identity is the core competitive advantage." },
  { label: "Creative Technology", desc: "Tools, platforms, and software shaping how brands are built." },
  { label: "Consumer & Culture", desc: "Products at the intersection of culture, lifestyle, and community." },
  { label: "Digital Infrastructure", desc: "The foundations powering the next generation of the web." },
];

export default function Ventures() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useSpring(
    useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]),
    { stiffness: 40, damping: 20, mass: 1 }
  );

  return (
    <section ref={sectionRef} className="w-full bg-foreground text-background overflow-hidden relative isolate">

      {/* Parallax background image */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY, scale: 1.18 }}
      >
        <Image
          src="/Venture bg.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.34] [filter:saturate(0.85)_contrast(1.08)]"
          aria-hidden
        />
      </motion.div>

      {/* Depth: vignette + soft top light — separates UI from terrain */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/65"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-5%,rgba(255,255,255,0.07)_0%,transparent_58%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]"
        aria-hidden
      />

      {/* Top hairline */}
      <div className="relative z-10 w-full h-px bg-gradient-to-r from-transparent via-background/15 to-transparent" />

      <div className="relative z-10 px-4 md:px-12 pt-14 md:pt-32 pb-16 md:pb-28 max-w-7xl mx-auto">

        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-7 md:gap-12 mb-10 md:mb-28">
          <div>
            <motion.p
              {...fadeUp(0)}
              className="font-sans text-background/50 uppercase tracking-[0.22em] text-[0.65rem] mb-5"
            >
              A Lumetic Company
            </motion.p>
            <motion.h2
              {...fadeUp(0.07)}
              className="font-display text-background uppercase leading-none [text-shadow:0_1px_0_rgba(255,255,255,0.06),0_28px_90px_rgba(0,0,0,0.55),0_0_80px_rgba(0,0,0,0.35)]"
              style={{ fontSize: "clamp(2.4rem, 10vw, 10rem)", letterSpacing: "0.02em", lineHeight: 0.9 }}
            >
              Lumetic
              <br />
              Collective
            </motion.h2>
          </div>

          <motion.div
            {...fadeUp(0.15)}
            className="md:max-w-[340px] rounded-2xl border border-background/12 bg-background/[0.04] px-5 py-5 backdrop-blur-md backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] md:px-6 md:py-6"
          >
            <p
              className="font-sans font-semibold uppercase text-background/50 tracking-[0.15em] mb-3"
              style={{ fontSize: "0.65rem" }}
            >
              Early Stage &amp; Beyond
            </p>
            <p className="font-sans text-background/70 leading-relaxed" style={{ fontSize: "0.85rem" }}>
              Lumetic connects builders, visionaries, and founders with the right capital,
              partners, and opportunities to grow. We believe brand is not decoration. It
              is strategy, and when paired with clear vision, it becomes a powerful advantage.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 mt-6 text-background/60 hover:text-background transition-colors duration-200 group"
              style={{ fontSize: "0.78rem" }}
            >
              <span className="font-sans font-medium tracking-wide">Get in touch</span>
              <ArrowRight
                size={12}
                strokeWidth={1.5}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </a>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-background/25 to-transparent mb-10 md:mb-20" />

        {/* Focus areas */}
        <motion.p
          {...fadeUp(0)}
          className="font-sans uppercase tracking-[0.22em] text-background/80 text-[0.65rem] mb-10"
        >
          Areas of Focus
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {focus.map((item, i) => (
            <motion.div
              key={item.label}
              {...fadeUp(i * 0.08)}
              className="group relative overflow-hidden rounded-[1.75rem] border border-background/14 bg-background/[0.055] p-6 backdrop-blur-xl backdrop-saturate-150 shadow-[0_20px_56px_-16px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors duration-300 hover:border-background/22 hover:bg-background/[0.08] md:p-9"
            >
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-background/[0.06] blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p
                    className="font-display text-background uppercase mb-3 leading-tight"
                    style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", letterSpacing: "0.04em" }}
                  >
                    {item.label}
                  </p>
                  <p className="font-sans text-background/55 leading-relaxed" style={{ fontSize: "0.8rem" }}>
                    {item.desc}
                  </p>
                </div>
                <span className="font-mono tabular-nums text-background/35 text-[0.7rem] mt-1 shrink-0 tracking-widest">
                  0{i + 1}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom strip */}
        <motion.div
          {...fadeIn(0.2)}
          className="mt-16 md:mt-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-[1.35rem] border border-background/22 bg-background/[0.09] px-6 py-6 backdrop-blur-xl backdrop-saturate-150 shadow-[0_16px_48px_-14px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.14)] md:px-8"
        >
          <div className="flex items-center gap-4">
            <Image
              src="/Lumetic logo black no text.png"
              alt="Lumetic Collective"
              width={28}
              height={28}
              className="w-6 h-6 invert opacity-100 brightness-110 drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]"
            />
            <span
              className="font-sans uppercase tracking-[0.2em] text-background [text-shadow:0_0_32px_rgba(255,255,255,0.12)]"
              style={{ fontSize: "0.65rem" }}
            >
              Lumetic Collective — Early Stage &amp; Beyond
            </span>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2.5 rounded-full border border-background/45 px-6 py-3 font-sans text-sm font-medium tracking-wide text-background shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-200 hover:border-background/70 hover:bg-background/[0.08] hover:text-background group"
          >
            Pitch us
            <ArrowRight size={12} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </a>
        </motion.div>

      </div>

      {/* Bottom hairline */}
      <div className="relative z-10 w-full h-px bg-gradient-to-r from-transparent via-background/15 to-transparent" />
    </section>
  );
}
