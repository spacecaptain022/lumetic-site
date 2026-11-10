"use client";

import { useRef } from "react";
import { m as motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import PixelGlyph, { type GlyphName } from "@/components/ui/PixelGlyph";

const TEXT =
  "Whatever you can imagine, we build. Bring us the idea or the problem, and we bring the solution to light.";

const DISCIPLINES: { label: string; glyph: GlyphName }[] = [
  { label: "Brand identity", glyph: "brand" },
  { label: "Strategy & naming", glyph: "spark" },
  { label: "Web design", glyph: "web" },
  { label: "E-commerce", glyph: "commerce" },
  { label: "Motion & content", glyph: "motion" },
  { label: "AI systems", glyph: "chip" },
  { label: "Custom software", glyph: "chip" },
  { label: "Web3", glyph: "web3" },
  { label: "Autonomous systems", glyph: "chip" },
  { label: "Packaging", glyph: "commerce" },
];

function Word({ word, i, n, progress }: { word: string; i: number; n: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [i / n, (i + 1) / n], [0.2, 1]);
  return (
    <>
      <motion.span style={{ opacity }}>{word}</motion.span>{" "}
    </>
  );
}

/** Statement that fills in word by word as you read down the page. */
export default function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 50%"] });
  const words = TEXT.split(" ");

  return (
    <section className="py-24 md:py-40">
      <div className="wrap text-center">
        <p className="label mb-8 opacity-60">What is Lumetic</p>
        <p ref={ref} className="mx-auto max-w-[21em] text-[clamp(1.75rem,3.1vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
          {reduce
            ? TEXT
            : words.map((w, i) => <Word key={`${w}-${i}`} word={w} i={i} n={words.length} progress={scrollYProgress} />)}
        </p>
      </div>

      <div className="marquee mt-14 overflow-hidden md:mt-20" aria-label="Disciplines">
        <ul className="marquee-track flex w-max">
          {[0, 1].map((copy) =>
            DISCIPLINES.map((d) => (
              <li
                key={`${copy}-${d.label}`}
                aria-hidden={copy === 1}
                className="flex shrink-0 items-center gap-2.5 px-7 text-[1.05rem] font-semibold tracking-[-0.01em] text-ink/45"
              >
                <PixelGlyph name={d.glyph} className="h-4 w-4" />
                {d.label}
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
