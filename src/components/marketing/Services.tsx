"use client";

import { m as motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { fadeUpReveal } from "@/lib/motion";

export default function Services() {
  return (
    <section className="w-full bg-background px-4 pt-16 pb-16 md:px-12 md:pt-32 md:pb-32">
      <motion.div
        {...fadeUpReveal(0)}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-black md:rounded-[1.35rem]"
      >
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/services-cta.png"
            className="h-full w-full object-cover object-center"
            aria-hidden
          >
            <source src="/services-cta.webm" type="video/webm" />
            <source src="/services-cta.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 flex min-h-[420px] flex-col items-center justify-center px-6 py-16 text-center md:min-h-[460px] md:px-16 md:py-24">
          <motion.div {...fadeUpReveal(0.06)} className="mb-8 flex justify-center">
            <Image
              src="/Lumetic logo black no text.png"
              alt="Lumetic"
              width={36}
              height={36}
              className="h-8 w-8 opacity-95 invert"
            />
          </motion.div>

          <motion.h2
            {...fadeUpReveal(0.1)}
            className="mb-6 max-w-[22ch] font-sans font-semibold uppercase leading-[1.08] tracking-[0.06em] text-white antialiased md:max-w-[28ch]"
            style={{ fontSize: "clamp(1.35rem, 3.6vw, 2.35rem)" }}
          >
            Curious how branding can elevate your business?
          </motion.h2>

          <motion.p
            {...fadeUpReveal(0.16)}
            className="mb-10 max-w-md font-sans leading-relaxed text-white/55"
            style={{ fontSize: "0.84rem" }}
          >
            Let&apos;s talk. Book a free consultation and discover how Lumetic can grow your brand.
          </motion.p>

          <motion.div {...fadeUpReveal(0.22)}>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 font-sans text-sm font-medium tracking-wide text-black transition-colors duration-200 hover:bg-white/90"
            >
              Book a call
              <ArrowRight
                size={14}
                strokeWidth={1.5}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
