"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

const LINES = ["WE MAKE", "BRANDS THAT", "LEAD."];
const TOTAL_CHARS = LINES.join("").length;

function CountUp({ to, from = 0, suffix = "", duration = 1.6 }: { to: number; from?: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const range = to - from;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(from + eased * range));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(to);
    };
    requestAnimationFrame(step);
  }, [inView, to, from, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const ease = [0.22, 1, 0.36, 1] as const;

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 56 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, ease, delay },
  };
}

function scrollFadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 56 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 1.0, ease, delay },
  };
}

const principles = [
  {
    index: "01",
    title: "Clarity over noise",
    body: "Great brands don't shout, they resonate. We strip away everything that doesn't belong, leaving only what's essential and true.",
  },
  {
    index: "02",
    title: "Systems, not logos",
    body: "A mark is nothing without a system. We build identities designed to scale, cohesive across every surface, medium, and moment.",
  },
  {
    index: "03",
    title: "Lead, don't follow",
    body: "Trends are a ceiling. We study culture to find the space just ahead of it, building brands that feel inevitable, not derivative.",
  },
  {
    index: "04",
    title: "Earned through craft",
    body: "Every kerning decision, every color choice, every word. It's all intentional. We don't ship work we wouldn't stake our name on.",
  },
];

export default function About() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [revealCount, setRevealCount] = useState(0);
  const prevRevealRef = useRef(-1);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const videoY = useSpring(
    useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]),
    { stiffness: 30, damping: 25, mass: 1 }
  );

  const descriptorOpacity = useTransform(scrollYProgress, [0.7, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.round(v * (TOTAL_CHARS + 4));
    if (next !== prevRevealRef.current) {
      prevRevealRef.current = next;
      setRevealCount(next);
    }
  });

  return (
    <>
      {/* ── Hero — sticky scroll type-on ── */}
      <div ref={heroRef} className="h-[150vh] md:h-[280vh]">
        <section className="sticky top-0 relative w-full h-screen bg-background flex flex-col justify-end px-4 md:px-12 pb-16 md:pb-20 overflow-hidden">

          {/* LUMETIC video text mask + parallax */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.05 }}
            className="absolute inset-0 pointer-events-none select-none"
            aria-hidden
          >
            <motion.div className="absolute inset-0" style={{ y: videoY, scale: 1.35 }}>
              <video autoPlay muted loop playsInline preload="metadata" className="w-full h-full object-cover" style={{ opacity: 0.35 }}>
                <source src="/about%20text%20mask%20video.mp4" type="video/mp4" />
              </video>
            </motion.div>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
              <defs>
                <mask id="lumetic-text-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <text x="0" y="50%" dominantBaseline="middle" style={{ fontFamily: "var(--font-bebas), 'Arial Narrow', sans-serif", fontSize: "clamp(2rem, 26vw, 42rem)", letterSpacing: "0.01em", fill: "black" }}>
                    LUMETIC
                  </text>
                </mask>
              </defs>
              <rect width="100%" height="100%" mask="url(#lumetic-text-mask)" style={{ fill: "var(--background)" }} />
            </svg>
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
          </motion.div>

          {/* Scroll-driven typewriter headline */}
          <div className="relative z-10 max-w-6xl w-full mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-10">
            <div>
              <motion.p {...fadeUp(0)} className="font-sans text-[10px] uppercase tracking-[0.18em] text-foreground/60 mb-5">
                About us
              </motion.p>
              <h1
                className="font-display text-foreground uppercase"
                style={{ fontSize: "clamp(3rem, 9vw, 10rem)", letterSpacing: "0.03em", lineHeight: 0.92 }}
              >
                {LINES.map((line, li) => {
                  const lineStart = LINES.slice(0, li).join("").length;
                  return (
                    <span key={li} style={{ display: "block" }}>
                      {line.split("").map((char, ci) => {
                        const idx = lineStart + ci;
                        const revealed = revealCount > idx;
                        return (
                          <span
                            key={ci}
                            style={{
                              opacity: revealed ? 1 : 0.08,
                              transition: "opacity 0.06s ease",
                            }}
                          >
                            {char}
                          </span>
                        );
                      })}
                    </span>
                  );
                })}
              </h1>
            </div>

            <motion.div
              style={{ opacity: descriptorOpacity }}
              className="md:max-w-[280px] flex flex-col gap-3"
            >
              <p className="font-sans text-foreground/70 leading-relaxed" style={{ fontSize: "0.82rem" }}>
                Lumetic is a brand identity studio working with founders, startups, and companies
                who understand that design is a competitive advantage, not an afterthought.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-foreground/75 hover:text-foreground transition-colors duration-200 group"
                style={{ fontSize: "0.78rem" }}
              >
                <span className="font-sans font-medium tracking-wide">Start a project</span>
                <ArrowRight size={12} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform duration-200" />
              </a>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Hairline */}
      <div className="w-full h-px bg-foreground/10" />

      {/* ── Manifesto ── */}
      <section className="w-full bg-background px-4 md:px-12 py-16 md:py-36 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <motion.div {...scrollFadeUp(0)} className="md:col-span-2 flex items-start pt-1">
            <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-foreground/55">
              Philosophy
            </span>
          </motion.div>
          <div className="md:col-span-10 w-full min-w-0">
            <p
              className="font-display text-foreground uppercase w-full"
              style={{ fontSize: "clamp(1rem, 4.5vw, 4.2rem)", letterSpacing: "0.03em", lineHeight: 1.15 }}
            >
              {[
                { word: "Most",      dim: false },
                { word: "brands",    dim: false },
                { word: "fail",      dim: false },
                { word: "before",    dim: false },
                { word: "they",      dim: false },
                { word: "launch.",   dim: false },
                { word: "Not",       dim: false },
                { word: "because",   dim: false },
                { word: "of",        dim: false },
                { word: "bad",       dim: false },
                { word: "products,", dim: false },
                { word: "but",       dim: false },
                { word: "because",   dim: false },
                { word: "no",        dim: false },
                { word: "one",       dim: false },
                { word: "stopped",   dim: false },
                { word: "to",        dim: false },
                { word: "ask:",      dim: false },
                { word: "who",       dim: true  },
                { word: "is",        dim: true  },
                { word: "this",      dim: true  },
                { word: "for,",      dim: true  },
                { word: "and",       dim: true  },
                { word: "why",       dim: true  },
                { word: "should",    dim: true  },
                { word: "they",      dim: true  },
                { word: "care?",     dim: true  },
                { word: "That",      dim: false },
                { word: "question",  dim: false },
                { word: "is",        dim: false },
                { word: "where",     dim: false },
                { word: "we",        dim: false },
                { word: "start.",    dim: false },
              ].map(({ word, dim }, i) => {
                const yDir = i % 3 === 0 ? -1 : 1;
                const yAmt = 28 + (i % 5) * 8;
                const rot  = (i % 2 === 0 ? -1 : 1) * (2 + (i % 4) * 1.5);
                return (
                  <motion.span
                    key={i}
                    className={`inline-block mr-[0.2em] ${dim ? "text-foreground/50" : ""}`}
                    initial={{ opacity: 0, y: yDir * yAmt, rotate: rot, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                    viewport={{ once: false, margin: "-60px" }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay: (i % 6) * 0.03 }}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Hairline */}
      <div className="w-full h-px bg-foreground/10" />

      {/* ── Principles ── */}
      <section className="w-full bg-background px-4 md:px-12 py-14 md:py-32">
        <div className="max-w-6xl mx-auto">
          <motion.p {...scrollFadeUp(0)} className="font-sans text-[10px] uppercase tracking-[0.18em] text-foreground/55 mb-14">
            How we work
          </motion.p>
          <div className="flex flex-col divide-y divide-foreground/8">
            {principles.map((p, i) => (
              <motion.div
                key={p.index}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.1 }}
                className="flex flex-col gap-3 md:grid md:grid-cols-12 md:gap-8 py-8 md:py-12"
              >
                <div className="flex items-baseline gap-3 md:contents">
                  <span className="md:col-span-1 font-sans text-[10px] text-foreground/50 tracking-[0.12em] shrink-0">{p.index}</span>
                  <h3
                    className="md:col-span-4 font-display text-foreground uppercase"
                    style={{ fontSize: "clamp(1.4rem, 2.8vw, 2.6rem)", letterSpacing: "0.04em", lineHeight: 1.0 }}
                  >
                    {p.title}
                  </h3>
                </div>
                <div className="md:col-span-6 md:col-start-7 flex items-center">
                  <p className="font-sans text-foreground/70 leading-relaxed" style={{ fontSize: "0.85rem" }}>
                    {p.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hairline */}
      <div className="w-full h-px bg-foreground/10" />

      {/* ── Stats row ── */}
      <section className="w-full bg-background px-4 md:px-12 py-12 md:py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 place-items-center text-center">
          {[
            { to: 20, suffix: "+", label: "Brands built" },
            { to: 6,  suffix: "",  label: "Industries" },
            { to: 100, suffix: "%", label: "Custom work" },
            { to: 2021, from: 2000, suffix: "", label: "Founded", duration: 2.2 },
          ].map((stat, i) => (
            <motion.div key={stat.label} {...scrollFadeUp(i * 0.07)} className="flex flex-col gap-2 items-center">
              <span
                className="font-display text-foreground uppercase"
                style={{ fontSize: "clamp(2.4rem, 4vw, 4rem)", letterSpacing: "0.04em", lineHeight: 1 }}
              >
                <CountUp to={stat.to} suffix={stat.suffix} duration={stat.duration ?? 1.6} />
              </span>
              <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-foreground/55">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Hairline */}
      <div className="w-full h-px bg-foreground/10" />

      {/* ── CTA ── */}
      <section className="w-full bg-background px-4 md:px-12 py-14 md:py-32">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-10">
          <motion.h2
            {...scrollFadeUp(0)}
            className="font-display text-foreground uppercase"
            style={{ fontSize: "clamp(3rem, 6vw, 6.5rem)", letterSpacing: "0.03em", lineHeight: 0.95 }}
          >
            Ready to define<br />your brand?
          </motion.h2>
          <motion.div {...scrollFadeUp(0.12)}>
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 bg-foreground text-background font-sans font-medium px-8 py-3.5 rounded-full text-sm tracking-wide hover:bg-foreground/85 transition-colors duration-200 group"
            >
              Book a call
              <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
