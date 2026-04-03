"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { exploreServices } from "@/data/exploreServices";
import { scrollRevealViewport } from "@/lib/motion";

const ease = [0.22, 1, 0.36, 1] as const;

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 36 },
    whileInView: { opacity: 1, y: 0 },
    viewport: scrollRevealViewport,
    transition: { duration: 0.88, ease, delay },
  };
}

export default function Services() {
  return (
    <>
      {/* ── Services Grid ── */}
      <section className="w-full bg-background py-14 md:py-32 px-4 md:px-12">
        <div className="max-w-6xl mx-auto mb-12 md:mb-16 text-center md:text-left">
          <motion.p
            {...fadeUp(0)}
            className="font-sans text-foreground/45 uppercase tracking-[0.22em] text-[0.65rem] mb-3"
          >
            (Discover what you&apos;ve been missing)
          </motion.p>
          <motion.h2
            {...fadeUp(0.06)}
            className="font-display text-foreground uppercase"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)", letterSpacing: "0.04em", lineHeight: 0.95 }}
          >
            Explore more
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 max-w-6xl mx-auto">
          {exploreServices.map((service, i) => (
            <motion.article
              key={service.title}
              {...fadeUp(i * 0.1)}
              className="relative flex h-full min-h-[22rem] flex-col overflow-hidden rounded-2xl bg-black md:min-h-[24rem] md:rounded-[1.35rem]"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
            >
              <div className="pointer-events-none absolute inset-0 z-0">
                <Image
                  src={service.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover object-center grayscale contrast-[1.05] brightness-[0.92]"
                  aria-hidden
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/35 to-black/25" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(255,255,255,0.08),transparent_55%)] opacity-70" />
              </div>

              <div className="relative z-10 flex min-h-[22rem] flex-1 flex-col p-5 md:min-h-[24rem] md:p-6">
                <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-white/85 md:text-[11px]">
                  {service.exp} / {service.year}
                </p>

                <div className="mt-auto flex w-full flex-col gap-2 pt-10">
                  <div className="flex h-[7.5rem] flex-col justify-end md:h-[8.25rem]">
                    <h3
                      className="font-sans font-semibold text-white uppercase leading-[1.05] tracking-tight"
                      style={{ fontSize: "clamp(1.35rem, 2.8vw, 1.85rem)" }}
                    >
                      {service.titleLines.map((line, ti) => (
                        <span key={ti} className="block leading-[1.05]">
                          {line}
                        </span>
                      ))}
                    </h3>
                  </div>
                  <p className="flex min-h-[2.5rem] items-center font-mono text-[8px] uppercase leading-snug tracking-[0.12em] text-white/55 md:text-[9px] md:tracking-[0.14em]">
                    {service.tags.join(" • ")}
                  </p>
                  <p className="min-h-[calc(3*1.625*0.75rem)] font-sans text-[0.75rem] leading-relaxed text-white/50 md:min-h-[calc(3*1.625*0.78rem)] md:text-[0.78rem]">
                    {service.description}
                  </p>
                </div>
              </div>

              <a
                href="#contact"
                className="absolute inset-0 z-20 rounded-2xl md:rounded-[1.35rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                aria-label={`${service.title} — get in touch`}
              />
            </motion.article>
          ))}
        </div>
      </section>

      {/* ── CTA — same language as Explore cards: dark canvas, scrim, mono detail, calm type */}
      <section className="w-full bg-background px-4 md:px-12 pb-14 md:pb-32">
        <motion.div
          {...fadeUp(0)}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-black md:rounded-[1.35rem]"
          style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.14)" }}
        >
          <div className="absolute inset-0">
            <Image
              src="/Card 4 graphic.png"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover object-center grayscale contrast-[1.06] brightness-[0.88]"
              aria-hidden
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/94 via-black/50 to-black/30" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_25%,rgba(255,255,255,0.07),transparent_55%)] opacity-80" />
          </div>

          <div className="relative z-10 flex min-h-[420px] flex-col items-center justify-center px-6 py-16 text-center md:min-h-[460px] md:px-16 md:py-24">
            <motion.div {...fadeUp(0.06)} className="mb-8 flex justify-center">
              <Image
                src="/Lumetic logo black no text.png"
                alt="Lumetic"
                width={36}
                height={36}
                className="h-8 w-8 opacity-95 invert"
              />
            </motion.div>

            <motion.h2
              {...fadeUp(0.1)}
              className="mb-6 max-w-[22ch] font-sans font-semibold uppercase leading-[1.08] tracking-[0.06em] text-white antialiased md:max-w-[28ch]"
              style={{ fontSize: "clamp(1.35rem, 3.6vw, 2.35rem)" }}
            >
              Curious how branding can elevate your business?
            </motion.h2>

            <motion.p
              {...fadeUp(0.16)}
              className="mb-10 max-w-md font-sans leading-relaxed text-white/55"
              style={{ fontSize: "0.84rem" }}
            >
              Let&apos;s talk. Book a free consultation and discover how Lumetic can grow your brand.
            </motion.p>

            <motion.div {...fadeUp(0.22)}>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 font-sans text-sm font-medium tracking-wide text-black transition-colors duration-200 hover:bg-white/90"
              >
                Book a call
                <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
