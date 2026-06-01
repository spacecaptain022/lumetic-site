"use client";

import { useEffect, useRef, useState } from "react";
import { m as motion, useInView } from "framer-motion";
import { fadeUpReveal, inViewReveal } from "@/lib/motion";
import WatchReveal from "@/components/layout/WatchReveal";
import InteractiveHeadline from "@/components/marketing/InteractiveHeadline";

const STATS = [
  { label: "Brand systems delivered", value: 20, suffix: "+" },
  { label: "Year founded", value: 2021, suffix: "" },
  { label: "Industries served", value: 6, suffix: "+" },
  { label: "Bespoke client work", value: 100, suffix: "%" },
] as const;

function CountUp({
  to,
  from = 0,
  suffix = "",
  duration = 1.6,
}: {
  to: number;
  from?: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, inViewReveal);
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

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function StatCell({
  label,
  value,
  suffix,
  from,
  duration,
  delay,
}: {
  label: string;
  value: number;
  suffix: string;
  from?: number;
  duration?: number;
  delay: number;
}) {
  return (
    <motion.div {...fadeUpReveal(delay, 24)} className="flex flex-col">
      <div className="border-t border-foreground/15 pt-4">
        <p className="font-sans text-[0.68rem] leading-snug text-foreground/55 md:text-[0.72rem]">
          {label}
        </p>
      </div>
      <p
        className="mt-3 font-sans font-medium tracking-[-0.02em] text-foreground"
        style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)", lineHeight: 1 }}
      >
        <CountUp to={value} from={from} suffix={suffix} duration={duration} />
      </p>
    </motion.div>
  );
}

const ABOUT_HEADLINE =
  "We're a studio of strategists and designers bringing distinctive brand systems to life through clarity, craft, and intentional design.";

const ABOUT_ACCENT_WORDS = [
  "strategists",
  "designers",
  "distinctive",
  "brand",
  "systems",
  "clarity",
  "craft",
  "intentional",
  "design",
];

export default function About() {
  return (
    <section className="w-full bg-background">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-12 md:py-28 lg:py-36">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10 lg:gap-y-0">
          <div className="flex flex-col justify-end gap-8 lg:col-span-7 lg:min-h-[min(72vh,640px)] lg:pt-20">
            <WatchReveal>
              <p className="font-sans text-[0.62rem] font-medium uppercase tracking-[0.22em] text-foreground/55">
                Lumetic today
              </p>
            </WatchReveal>

            <WatchReveal delay={0.06} className="lg:max-w-[38rem] xl:max-w-[42rem]">
              <InteractiveHeadline
                as="h2"
                text={ABOUT_HEADLINE}
                accentWords={ABOUT_ACCENT_WORDS}
                className="cursor-default font-medium"
                style={{
                  fontSize: "clamp(1.65rem, 3.4vw, 2.85rem)",
                  lineHeight: 1.18,
                  letterSpacing: "-0.025em",
                }}
              />
            </WatchReveal>
          </div>

          <div className="flex flex-col justify-end lg:col-span-5 lg:col-start-8 lg:min-h-[min(72vh,640px)]">
            <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:gap-x-10 md:gap-y-14">
              {STATS.map((stat, i) => (
                <StatCell
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  from={stat.value === 2021 ? 2000 : 0}
                  duration={stat.value === 2021 ? 2.2 : 1.6}
                  delay={0.08 + i * 0.06}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-foreground/10" />
    </section>
  );
}
