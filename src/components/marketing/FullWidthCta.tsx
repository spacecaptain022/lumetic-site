"use client";

import { useRef } from "react";
import {
  m as motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { MOTION_SPRING_SCROLL } from "@/lib/motion";

export default function FullWidthCta() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "start 35%"],
  });

  const yRaw = useTransform(scrollYProgress, [0, 1], ["-22vh", "0vh"]);
  const opacityRaw = useTransform(scrollYProgress, [0, 0.35, 1], [0, 1, 1]);
  const y = useSpring(yRaw, MOTION_SPRING_SCROLL);
  const opacity = useSpring(opacityRaw, MOTION_SPRING_SCROLL);

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-background">
      <div className="relative z-10 bg-background px-4 pb-6 pt-3 md:px-12 md:pb-8">
        <a
          href="#hero"
          aria-label="Scroll to the top of the page"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 text-foreground/70 transition-colors hover:border-foreground/30 hover:text-foreground"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M7 11V3M7 3L3 7M7 3L11 7"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      <div className="bg-black">
        <motion.div
          style={reduce ? undefined : { y, opacity }}
          className="relative z-0 w-full overflow-hidden rounded-b-[2rem] bg-[#D595AF] will-change-transform md:rounded-b-[3rem]"
        >
        <div className="mx-auto flex min-h-[17rem] max-w-4xl flex-col items-center justify-center px-6 py-16 text-center md:min-h-[20rem] md:py-24">
          <h3
            className="mb-8 max-w-[16ch] font-sans font-medium text-black md:max-w-none"
            style={{
              fontSize: "clamp(1.5rem, 3.8vw, 2.75rem)",
              lineHeight: 1.12,
              letterSpacing: "-0.025em",
            }}
          >
            Let&apos;s move forward with your next project
          </h3>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-sans text-[0.78rem] font-medium tracking-wide text-white transition-opacity hover:opacity-88 md:px-7 md:py-3.5 md:text-sm"
            data-cursor-label="Drop us a line"
          >
            Drop us a line
            <ArrowDownRight
              size={15}
              strokeWidth={1.75}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
            />
          </a>
        </div>
      </motion.div>
      </div>
    </section>
  );
}
