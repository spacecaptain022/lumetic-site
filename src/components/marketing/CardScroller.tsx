"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  m as motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import WatchReveal from "@/components/layout/WatchReveal";
import { scrollerCards, type ScrollerCard } from "@/data/galleryImages";

const titleStyle = {
  fontSize: "clamp(2.25rem, 5.5vw, 4.25rem)",
  lineHeight: 1.08,
  letterSpacing: "-0.02em",
} as const;

function ScrollStatement({
  children,
  opacity,
  y,
  scale,
  reduce,
}: {
  children: React.ReactNode;
  opacity: MotionValue<number> | number;
  y: MotionValue<number> | number;
  scale: MotionValue<number> | number;
  reduce: boolean | null;
}) {
  if (reduce) {
    return (
      <h2 className="font-sans font-medium text-foreground" style={titleStyle}>
        {children}
      </h2>
    );
  }

  return (
    <motion.h2
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6 text-center font-sans font-medium text-foreground"
      style={{ ...titleStyle, opacity, y, scale }}
    >
      {children}
    </motion.h2>
  );
}

function IndependentCard({
  card,
  index,
  progress,
  reduce,
}: {
  card: ScrollerCard;
  index: number;
  progress: MotionValue<number>;
  reduce: boolean | null;
}) {
  const stagger = index * 0.034;
  const enter = 0.22 + stagger;
  const exit = 0.72 + stagger * 0.3;

  const opacity = useTransform(progress, [enter - 0.05, enter + 0.04, exit - 0.04, exit + 0.05], [0, 1, 1, 0]);
  const x = useTransform(
    progress,
    [enter, exit],
    [`${card.scatterXVw}vw`, `${card.scatterXVw + card.driftXVw}vw`]
  );
  const y = useTransform(
    progress,
    [enter, exit],
    [`${card.scatterYVh + 4}vh`, `${card.scatterYVh + card.driftYVh}vh`]
  );
  const rotate = useTransform(progress, [enter, exit], [card.rotate + 10, card.rotate - 8]);
  const scale = useTransform(
    progress,
    [enter - 0.05, enter + 0.06, exit],
    [0.82 * card.scale, card.scale, 0.88 * card.scale]
  );

  const cardInner = (
    <div
      className="relative overflow-hidden rounded-xl bg-foreground/[0.04] shadow-[0_16px_48px_rgba(0,0,0,0.14)] md:rounded-2xl"
      style={{
        width: "clamp(7.5rem, 14vw, 13.5rem)",
        height: "clamp(7.5rem, 14vw, 13.5rem)",
      }}
    >
      <Image
        src={card.src}
        alt={card.alt}
        fill
        sizes="(max-width: 768px) 152px, 216px"
        className="object-cover"
      />
    </div>
  );

  if (reduce) return null;

  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{ x, y, rotate, scale, opacity, zIndex: card.zIndex }}
    >
      <div className="-translate-x-1/2 -translate-y-1/2">{cardInner}</div>
    </motion.div>
  );
}

export default function CardScroller() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const startOpacity = useTransform(scrollYProgress, [0, 0.07, 0.18, 0.26], [0, 1, 1, 0]);
  const startY = useTransform(scrollYProgress, [0, 0.07, 0.26], [56, 0, -48]);
  const startScale = useTransform(scrollYProgress, [0, 0.07, 0.18], [0.94, 1, 1]);

  const endOpacity = useTransform(scrollYProgress, [0.76, 0.86, 0.96, 1], [0, 1, 1, 1]);
  const endY = useTransform(scrollYProgress, [0.76, 0.86], [56, 0]);
  const endScale = useTransform(scrollYProgress, [0.76, 0.86], [0.94, 1]);

  if (reduce) {
    return (
      <section className="w-full bg-background py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 md:px-12">
          <h2 className="mb-12 text-center font-sans font-medium text-foreground" style={titleStyle}>
            From strategy to system
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5">
            {scrollerCards.map((card) => (
              <div
                key={card.src}
                className="relative aspect-square overflow-hidden rounded-xl md:rounded-2xl"
              >
                <Image src={card.src} alt={card.alt} fill sizes="33vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <ScrollerFooter />
      </section>
    );
  }

  return (
    <div className="w-full bg-background">
      <section ref={sectionRef} className="relative w-full" style={{ height: "420vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <ScrollStatement opacity={startOpacity} y={startY} scale={startScale} reduce={reduce}>
            From strategy
          </ScrollStatement>

          <div className="absolute inset-0">
            {scrollerCards.map((card, i) => (
              <IndependentCard key={card.src} card={card} index={i} progress={scrollYProgress} reduce={reduce} />
            ))}
          </div>

          <ScrollStatement opacity={endOpacity} y={endY} scale={endScale} reduce={reduce}>
            to system
          </ScrollStatement>
        </div>
      </section>

      <ScrollerFooter />
    </div>
  );
}

function ScrollerFooter() {
  return (
    <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 md:px-12 md:pb-28 md:pt-24">
      <WatchReveal className="mx-auto max-w-3xl text-center">
        <h3
          className="font-sans text-foreground"
          style={{
            fontSize: "clamp(1.25rem, 2.4vw, 1.85rem)",
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
          }}
        >
          From strategy to system, our team transforms clarity into expression, distilling bold ideas
          into brand systems that scale with intention.
        </h3>
        <p className="mt-8">
          <a
            href="#about"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 font-sans text-[0.78rem] font-medium uppercase tracking-[0.14em] text-background transition-opacity duration-300 hover:opacity-85"
            data-cursor-label="Our approach"
          >
            Our approach
          </a>
        </p>
      </WatchReveal>
    </div>
  );
}
