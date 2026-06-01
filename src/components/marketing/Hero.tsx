"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { m as motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import ScrollWordReveal from "@/components/layout/ScrollWordReveal";
import HeroHeadline from "@/components/marketing/HeroHeadline";
import { fadeUpEnter } from "@/lib/motion";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const visualY = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0.35]);

  return (
    <section ref={sectionRef} className="relative w-full bg-background">
      <div className="mx-auto max-w-5xl px-5 pt-24 pb-10 text-center md:px-12 md:pt-32 md:pb-12">
        <motion.div
          {...fadeUpEnter(0.05, 32)}
          className="mx-auto max-w-4xl"
          style={reduce ? undefined : { opacity: headlineOpacity }}
        >
          <HeroHeadline className="cursor-default" />
        </motion.div>
      </div>

      <motion.div
        className="relative mx-auto w-full max-w-6xl px-4 md:px-12"
        style={reduce ? undefined : { y: visualY }}
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-foreground/[0.04] md:rounded-2xl">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
            aria-label="Lumetic brand showreel"
          >
            <source src="/hero-showreel.mp4" type="video/mp4" />
          </video>
        </div>
      </motion.div>

      <div className="mx-auto flex max-w-6xl flex-col items-end justify-between gap-8 px-4 py-12 md:flex-row md:items-end md:px-12 md:py-16">
        <div className="md:hidden">
          <p
            className="font-sans font-medium text-foreground"
            style={{ fontSize: "clamp(2.5rem, 12vw, 4rem)", lineHeight: 0.92, letterSpacing: "-0.02em" }}
          >
            Clarity over noise
          </p>
        </div>

        <div className="hidden max-w-[min(380px,38vw)] flex-col gap-5 md:flex">
          <p
            className="font-sans font-semibold uppercase leading-snug tracking-[0.12em] text-foreground"
            style={{ fontSize: "0.7rem" }}
          >
            Lumetic crafts identities that transcend trends
          </p>
          <ScrollWordReveal
            text="Strategy, vision, and design converge to build brand systems that resonate deeply. We partner with forward-thinking companies to create identities that lead, not follow."
            className="font-sans font-light leading-[1.65] text-foreground/65"
            wordClassName="will-change-[opacity]"
          />
        </div>

        <a
          href="#services"
          className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 font-sans text-sm font-medium tracking-wide text-background transition-opacity hover:opacity-85"
          data-cursor-label="Explore services"
        >
          Services
          <ArrowRight size={13} strokeWidth={1.5} className="transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>

      <div className="h-px w-full bg-foreground/10" />
    </section>
  );
}
