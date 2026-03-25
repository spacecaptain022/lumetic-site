"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const ease = [0.22, 1, 0.36, 1] as const;

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 1.0, ease, delay },
  };
}

function fadeIn(delay: number) {
  return {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 1.0, ease, delay },
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
    <section ref={sectionRef} className="w-full bg-foreground text-background overflow-hidden relative">

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
          className="object-cover opacity-20"
          aria-hidden
        />
      </motion.div>

      {/* Top hairline */}
      <div className="w-full h-px bg-background/10" />

      <div className="px-4 md:px-12 pt-16 md:pt-32 pb-20 md:pb-28 max-w-7xl mx-auto">

        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-28">
          <div>
            <motion.p
              {...fadeUp(0)}
              className="font-sans text-background/40 uppercase tracking-[0.2em] text-[0.65rem] mb-4"
            >
              A Lumetic Company
            </motion.p>
            <motion.h2
              {...fadeUp(0.07)}
              className="font-display text-background uppercase leading-none"
              style={{ fontSize: "clamp(2.4rem, 10vw, 10rem)", letterSpacing: "0.01em", lineHeight: 0.9 }}
            >
              Lumetic
              <br />
              Collective
            </motion.h2>
          </div>

          <motion.div {...fadeUp(0.15)} className="md:max-w-[340px]">
            <p
              className="font-sans font-semibold uppercase text-background/40 tracking-[0.15em] mb-3"
              style={{ fontSize: "0.65rem" }}
            >
              Early Stage &amp; Beyond
            </p>
            <p className="font-sans text-background/65 leading-relaxed" style={{ fontSize: "0.85rem" }}>
              Lumetic connects builders, visionaries, and founders with the right capital,
              partners, and opportunities to grow. We believe brand is not decoration — it
              is strategy, and when paired with clear vision, it becomes a powerful advantage.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 mt-6 text-background/50 hover:text-background transition-colors duration-200 group"
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
        <div className="w-full h-px bg-background/30 mb-10 md:mb-20" />

        {/* Focus areas */}
        <motion.p
          {...fadeUp(0)}
          className="font-sans uppercase tracking-[0.2em] text-background text-[0.65rem] mb-10"
        >
          Areas of Focus
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {focus.map((item, i) => (
            <motion.div
              key={item.label}
              {...fadeUp(i * 0.08)}
              className="bg-background/5 backdrop-blur-sm p-5 md:p-8 rounded-3xl group hover:bg-background/10 transition-colors duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className="font-display text-background uppercase mb-3 leading-tight"
                    style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", letterSpacing: "0.04em" }}
                  >
                    {item.label}
                  </p>
                  <p className="font-sans text-background/50 leading-relaxed" style={{ fontSize: "0.8rem" }}>
                    {item.desc}
                  </p>
                </div>
                <span className="font-sans text-background/20 text-xs mt-1 shrink-0">
                  0{i + 1}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom strip */}
        <motion.div
          {...fadeIn(0.2)}
          className="mt-16 md:mt-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-background/8 backdrop-blur-sm border border-background/10 rounded-2xl px-6 py-5"
        >
          <div className="flex items-center gap-4">
            <Image
              src="/Lumetic logo black no text.png"
              alt="Lumetic Collective"
              width={28}
              height={28}
              className="w-6 h-6 invert opacity-40"
            />
            <span
              className="font-sans uppercase tracking-[0.2em] text-background/30"
              style={{ fontSize: "0.65rem" }}
            >
              Lumetic Collective — Early Stage &amp; Beyond
            </span>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2.5 border border-background/20 text-background/70 hover:border-background/50 hover:text-background font-sans font-medium px-6 py-3 rounded-full text-sm tracking-wide transition-all duration-200 group"
          >
            Pitch us
            <ArrowRight size={12} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </a>
        </motion.div>

      </div>

      {/* Bottom hairline */}
      <div className="w-full h-px bg-background/10" />
    </section>
  );
}
