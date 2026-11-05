"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  cubicBezier,
  m as motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import BlockLink from "@/components/ui/BlockLink";
import Reveal from "@/components/ui/Reveal";
import { galleryStudies } from "@/data/galleryImages";

/**
 * "From strategy to system", made literal: a heap of studies settles into a grid as you scroll.
 * Offsets are in tile units so the heap holds its shape at any size.
 * d = 4×2 desktop grid, m = 2×4 mobile grid.
 */
const HEAP = [
  { dxd: 0.62, dyd: 0.38, dxm: 0.36, dym: 1.02, r: -13, ds: 0.16, z: 3 },
  { dxd: -0.2, dyd: 0.72, dxm: -0.5, dym: 0.72, r: 9, ds: 0.28, z: 6 },
  { dxd: 0.42, dyd: 0.14, dxm: 0.62, dym: 0.28, r: -6, ds: 0.34, z: 1 },
  { dxd: -0.42, dyd: 0.64, dxm: -0.26, dym: 0.46, r: 15, ds: 0.2, z: 5 },
  { dxd: 1.02, dyd: -0.52, dxm: 0.2, dym: -0.34, r: 8, ds: 0.3, z: 7 },
  { dxd: 0.68, dyd: -0.86, dxm: -0.62, dym: -0.08, r: -17, ds: 0.14, z: 2 },
  { dxd: -0.72, dyd: -0.38, dxm: 0.48, dym: -1.04, r: 5, ds: 0.24, z: 8 },
  { dxd: -1.32, dyd: -0.22, dxm: -0.3, dym: -1.3, r: -9, ds: 0.36, z: 4 },
] as const;

const STUDIES = galleryStudies.slice(0, HEAP.length);
const SETTLE_END = 0.86;
const ease = cubicBezier(0.65, 0, 0.2, 1);

function Tile({
  study,
  index,
  progress,
  reduce,
}: {
  study: (typeof STUDIES)[number];
  index: number;
  progress: MotionValue<number>;
  reduce: boolean | null;
}) {
  const heap = HEAP[index];
  const start = 0.04 + index * 0.035;
  const p = useTransform(progress, [start, start + 0.57], [1, 0], { ease, clamp: true });

  const style = {
    "--dxd": heap.dxd,
    "--dyd": heap.dyd,
    "--dxm": heap.dxm,
    "--dym": heap.dym,
    "--r": heap.r,
    "--ds": heap.ds,
    "--p": reduce ? 0 : p,
    zIndex: heap.z,
  } as unknown as React.ComponentProps<typeof motion.div>["style"];

  return (
    <motion.div className="sys-tile relative overflow-hidden rounded-[12px] bg-card shadow-[0_12px_40px_rgb(0_0_0/0.12)]" style={style}>
      <Image src={study.src} alt={study.alt} fill sizes="(min-width: 768px) 24vw, 45vw" className="object-cover" />
    </motion.div>
  );
}

export default function System() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const line = useTransform(scrollYProgress, [0, SETTLE_END], [0, 1], { clamp: true });
  const fromOpacity = useTransform(scrollYProgress, [0.35, SETTLE_END], [1, 0.3]);
  const toOpacity = useTransform(scrollYProgress, [0.35, SETTLE_END], [0.3, 1]);

  return (
    <section aria-label="From strategy to system">
      <div ref={ref} className={reduce ? "" : "h-[260vh] md:h-[280vh]"}>
        <div className={`${reduce ? "py-24" : "sticky top-0 h-dvh overflow-clip"} flex flex-col pt-[calc(var(--nav-h)+0.5rem)]`}>
          <div className="wrap">
            <p className="label mb-4 text-center opacity-60">The process</p>
            <div className="flex items-center gap-3 md:gap-6">
              <motion.h2 className="shrink-0 text-[1.4rem] font-semibold leading-none tracking-[-0.03em] md:h-section" style={reduce ? undefined : { opacity: fromOpacity }}>
                From strategy
              </motion.h2>
              <div className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-ink/10" aria-hidden>
                <motion.div className="absolute inset-0 origin-left bg-ink" style={reduce ? undefined : { scaleX: line }} />
              </div>
              <motion.p className="shrink-0 text-[1.4rem] font-semibold leading-none tracking-[-0.03em] md:h-section" style={reduce ? undefined : { opacity: toOpacity }}>
                to system
              </motion.p>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center pb-5 pt-5 md:pt-7">
            <div className="sys-grid">
              {STUDIES.map((study, i) => (
                <Tile key={study.src} study={study} index={i} progress={scrollYProgress} reduce={reduce} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="wrap pb-24 pt-8 text-center md:pb-36 md:pt-14">
        <Reveal>
          <p className="mx-auto max-w-[26em] text-[clamp(1.35rem,2.2vw,2.1rem)] font-semibold leading-[1.15] tracking-[-0.025em]">
            From strategy to system, our team transforms clarity into expression, distilling bold ideas
            into brand systems that scale with intention.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <BlockLink href="#approach">Our approach</BlockLink>
            <BlockLink href="/work" tone="outline">
              All work
            </BlockLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
