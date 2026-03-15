"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] as const, delay },
  };
}

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Ventures", href: "#ventures" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { label: "X", href: "https://x.com/LUMETICio" },
  { label: "Telegram", href: "https://t.me/LUMETICio" },
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
];

export default function Footer() {
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wordmarkRef, { once: false, margin: "0px 0px -40px 0px" });

  return (
    <footer className="w-full bg-background overflow-hidden">

      {/* Top strip */}
      <div className="w-full h-px bg-foreground/10" />

      <div className="max-w-7xl mx-auto px-4 md:px-12 pt-16 md:pt-20 pb-10">

        {/* Single row: logo + tagline left | nav center | social right */}
        <motion.div
          {...fadeUp(0)}
          className="flex flex-col md:flex-row md:items-start justify-between gap-8 md:gap-6 pb-10 md:pb-14"
        >
          {/* Brand */}
          <div className="flex flex-col gap-4 md:max-w-[220px]">
            <Image
              src="/Lumetic logo black no text.png"
              alt="Lumetic"
              width={28}
              height={28}
              className="w-7 h-7"
            />
            <p className="font-sans text-foreground/40 leading-relaxed" style={{ fontSize: "0.73rem" }}>
              A branding studio and venture firm for the forward-thinking.
            </p>
          </div>

          {/* Nav */}
          <motion.div {...fadeUp(0.06)} className="flex flex-col gap-3">
            <p className="font-sans uppercase tracking-[0.18em] text-foreground/25 mb-1" style={{ fontSize: "0.58rem" }}>
              Navigation
            </p>
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-sans text-foreground/50 hover:text-foreground transition-colors duration-200"
                style={{ fontSize: "0.78rem" }}
              >
                {item.label}
              </a>
            ))}
          </motion.div>

          {/* Social */}
          <motion.div {...fadeUp(0.1)} className="flex flex-col gap-3">
            <p className="font-sans uppercase tracking-[0.18em] text-foreground/25 mb-1" style={{ fontSize: "0.58rem" }}>
              Social
            </p>
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-sans text-foreground/50 hover:text-foreground transition-colors duration-200 group"
                style={{ fontSize: "0.78rem" }}
              >
                {item.label}
                <ArrowUpRight size={10} strokeWidth={1.5} className="opacity-0 group-hover:opacity-60 transition-opacity duration-200" />
              </a>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div {...fadeUp(0.14)} className="flex flex-col gap-4 md:items-end">
            <p className="font-sans uppercase tracking-[0.18em] text-foreground/25" style={{ fontSize: "0.58rem" }}>
              Ready to build?
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-foreground text-background font-sans font-medium px-6 py-2.5 rounded-full text-xs tracking-wide hover:bg-foreground/85 transition-colors duration-200 group"
            >
              Start a project
              <ArrowUpRight size={11} strokeWidth={1.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </a>
          </motion.div>
        </motion.div>

        {/* Bottom strip */}
        <div className="w-full h-px bg-foreground/8 mb-6" />
        <motion.div
          {...fadeUp(0.16)}
          className="flex items-center justify-between"
        >
          <p className="font-sans text-foreground/25 uppercase tracking-[0.14em]" style={{ fontSize: "0.58rem" }}>
            © 2026 Lumetic Studio LLC.
          </p>
          <div className="flex items-center gap-5">
            {["Privacy", "Terms"].map((l) => (
              <a key={l} href="#" className="font-sans text-foreground/25 hover:text-foreground/50 uppercase tracking-[0.14em] transition-colors duration-200" style={{ fontSize: "0.58rem" }}>
                {l}
              </a>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Large wordmark */}
      <div ref={wordmarkRef} className="w-full overflow-hidden select-none">
        <motion.p
          animate={{ y: inView ? "0%" : "105%" }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] as const }}
          className="font-display text-foreground uppercase w-full text-center leading-none"
          style={{ fontSize: "clamp(5rem, 20vw, 18rem)", letterSpacing: "0.01em", marginBottom: "-0.12em" }}
        >
          LUMETIC
        </motion.p>
      </div>

    </footer>
  );
}
