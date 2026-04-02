"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const displayStyle = {
  fontSize: "clamp(5rem, 19vw, 21rem)",
  letterSpacing: "0.01em",
  lineHeight: 0.9,
} as const;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen bg-background overflow-hidden flex flex-col">
      {/* Main hero body */}
      <div className="flex-1 relative flex flex-col justify-center pt-20 md:pt-28">
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div
            className="relative w-[50vw] max-w-[600px] min-w-[260px] aspect-square pointer-events-auto"
            style={{ overflow: "visible" }}
          >
            <Image src="/lumetic eye [Vectorized]2.svg" alt="Lumetic eye" fill sizes="(max-width: 768px) 50vw, 600px" className="object-contain" priority />
          </div>
        </div>

        <div className="relative w-full select-none overflow-visible">
          <div className="relative w-full px-4 md:px-8">
            <h1 className="font-display text-foreground uppercase" style={displayStyle}>DEFINE</h1>
          </div>
          <div className="relative w-full px-4 md:px-8">
            <h1 className="font-display text-foreground uppercase" style={displayStyle}>YOUR</h1>
          </div>
          <div className="relative w-full px-4 md:px-8">
            <h1 className="font-display text-foreground uppercase" style={displayStyle}>BRAND</h1>
          </div>
        </div>

        <div className="relative z-10 flex items-end justify-between w-full px-4 md:px-8 mt-8 md:mt-12 pb-10 md:pb-14">
          <a
            href="#services"
            className="md:hidden inline-flex items-center gap-2 bg-foreground text-background font-sans font-medium px-6 py-3 rounded-full text-sm tracking-wide"
          >
            Our Work <ArrowRight size={13} strokeWidth={1.5} />
          </a>

          <div
            className="relative hidden md:flex max-w-[min(380px,34vw)] flex-col gap-5 overflow-hidden text-right ml-auto rounded-[2rem] border border-foreground/[0.08] bg-card/90 p-8 pl-9 shadow-[0_28px_72px_-24px_rgba(0,0,0,0.14),0_12px_32px_-12px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] ring-1 ring-foreground/[0.04] backdrop-blur-xl backdrop-saturate-150"
          >
            <div
              className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.07] to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-foreground/[0.04] blur-3xl"
              aria-hidden
            />

            <p
              className="relative text-foreground font-sans font-semibold uppercase leading-snug tracking-[0.12em]"
              style={{ fontSize: "0.7rem" }}
            >
              Lumetic crafts identities that transcend trends
            </p>
            <p
              className="relative text-foreground/65 font-sans font-light leading-[1.65]"
              style={{ fontSize: "0.8rem" }}
            >
              Strategy, vision, and design converge to build brand systems that resonate deeply.
              We partner with forward-thinking companies to create identities that lead, not follow.
            </p>
            <a
              href="#services"
              className="relative inline-flex items-center justify-end gap-2 text-foreground/55 transition-colors duration-200 hover:text-foreground group"
              style={{ fontSize: "0.78rem" }}
            >
              <span className="font-sans font-medium tracking-wide">Our Work</span>
              <ArrowRight size={12} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-200" />
            </a>
          </div>
        </div>

      </div>

      {/* Hairline border */}
      <div className="w-full h-px bg-foreground/10" />
    </section>
  );
}
