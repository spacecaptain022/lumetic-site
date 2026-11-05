"use client";

import { useState } from "react";
import Image from "next/image";
import { m as motion } from "framer-motion";
import AutoVideo from "@/components/ui/AutoVideo";
import { Arrow } from "@/components/ui/BlockLink";
import ResolveImage from "@/components/ui/ResolveImage";
import { MOTION_EASE_SWIFT } from "@/lib/motion";

const LINES = ["Clarity.", "Over.", "Noise."];

export default function Hero() {
  const [posterDone, setPosterDone] = useState(false);

  return (
    <section className="bg-paper p-[6px] md:p-2">
      <div className="relative flex h-[calc(100svh-12px)] min-h-[600px] flex-col justify-end overflow-hidden rounded-[16px] bg-ink text-paper md:h-[calc(100svh-16px)] md:rounded-[20px]">
        <AutoVideo
          // Full 1744px master on larger screens; the lighter 1280px cut on phones.
          sources={[
            { src: "/hero-showreel-hd.mp4", type: "video/mp4", media: "(min-width: 768px)" },
            { src: "/hero-showreel.webm", type: "video/webm" },
            { src: "/hero-showreel.mp4", type: "video/mp4" },
          ]}
          poster="/hero-showreel-poster.jpg"
          label="Lumetic brand showreel"
        />
        {/* Poster resolves from mosaic to sharp on load, then hands off to the live video. */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${posterDone ? "opacity-0" : "opacity-100"}`}
        >
          <ResolveImage src="/hero-showreel-poster.jpg" alt="" sizes="100vw" priority onDone={() => setPosterDone(true)} />
        </div>
        {/* Scrim so the type always reads over a busy collage */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/10" />

        <div className="relative grid grid-cols-1 items-end gap-6 px-4 pb-4 md:grid-cols-12 md:px-8 md:pb-8">
          <h1 className="h-hero md:col-span-8">
            <span className="sr-only">Lumetic, a branding studio. </span>
            {LINES.map((line, i) => (
              <span key={line} className="block overflow-clip pb-[0.06em] -mb-[0.06em]">
                <motion.span
                  className="block"
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, ease: MOTION_EASE_SWIFT, delay: 0.15 + i * 0.09 }}
                >
                  {line}
                  {i < LINES.length - 1 ? " " : ""}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: MOTION_EASE_SWIFT, delay: 0.55 }}
            className="group flex w-full items-stretch gap-2 justify-self-end rounded-[12px] bg-ink/55 p-2 backdrop-blur-xl transition-colors duration-300 hover:bg-ink/75 md:col-span-4 md:max-w-[24rem]"
          >
            <span className="flex flex-1 flex-col justify-between gap-6 p-2.5">
              <span className="label opacity-70">Studio status</span>
              <span className="text-[1.05rem] font-medium leading-snug">
                Taking on a small number of projects each quarter.
                <span className="mt-2 flex items-center gap-1.5 text-[0.85rem] text-paper/70 group-hover:text-paper">
                  Start a project <Arrow />
                </span>
              </span>
            </span>
            <span className="relative w-[7.5rem] shrink-0 overflow-hidden rounded-[8px]">
              <Image src="/gallery/people.png" alt="" fill sizes="120px" className="object-cover transition-transform duration-700 ease-swift group-hover:scale-105" />
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
