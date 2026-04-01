"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const ease = [0.22, 1, 0.36, 1] as const;

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 1.0, ease, delay },
  };
}

/** Lusion-style corner marker — white circle, black dot */
function CardCornerDot() {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm" aria-hidden>
      <span className="size-1.5 rounded-full bg-black" />
    </span>
  );
}

const services = [
  {
    title: "Brand Identity & Strategy",
    description:
      "Create cohesive, memorable brand identities that make you stand out and endure.",
    image: "/Card 1 graphic.jpg",
    exp: "EXP 001",
    year: "2026",
    tags: ["IDENTITY", "STRATEGY", "SYSTEMS"],
  },
  {
    title: "Web Design & Digital Presence",
    description:
      "Design intuitive, conversion-driven websites your customers will love.",
    image: "/Card 2 graphic.jpg",
    exp: "EXP 002",
    year: "2026",
    tags: ["WEB", "UX", "DIGITAL"],
  },
  {
    title: "Motion & Visual Content",
    description:
      "Bring your brand to life with engaging visuals, animations, and content systems.",
    image: "/Card 3 graphic.jpg",
    exp: "EXP 003",
    year: "2026",
    tags: ["MOTION", "CONTENT", "VISUAL"],
  },
  {
    title: "Web3, AI & Dev Services",
    description:
      "Smart contracts, Web3 products, and AI for your business—integration, deployment, and ongoing setup with your team.",
    image: "/Card 4 graphic.png",
    exp: "EXP 004",
    year: "2026",
    tags: ["WEB3", "SMART CONTRACTS", "AI"],
  },
] as const;

export default function Services() {
  return (
    <>
      {/* ── Services Grid ── */}
      <section className="w-full bg-background py-16 md:py-32 px-4 md:px-12">
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
          {services.map((service, i) => (
            <motion.article
              key={service.title}
              {...fadeUp(i * 0.1)}
              className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-2xl md:rounded-[1.35rem] bg-black"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
            >
              <Image
                src={service.image}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                className="object-cover object-center grayscale contrast-[1.05] brightness-[0.92]"
                aria-hidden
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/35 to-black/25 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(255,255,255,0.08),transparent_55%)] pointer-events-none opacity-70" />

              <div className="absolute inset-0 z-10 flex flex-col p-5 md:p-6">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.14em] text-white/85">
                    {service.exp} / {service.year}
                  </p>
                  <CardCornerDot />
                </div>

                <div className="mt-auto space-y-2">
                  <h3
                    className="font-sans font-semibold text-white uppercase leading-[1.05] tracking-tight"
                    style={{ fontSize: "clamp(1.35rem, 2.8vw, 1.85rem)" }}
                  >
                    {service.title}
                  </h3>
                  <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-white/55">
                    {service.tags.join(" • ")}
                  </p>
                  <p className="font-sans text-white/50 leading-relaxed pt-1 line-clamp-3 md:line-clamp-2 text-[0.75rem] md:text-[0.78rem] max-w-[32ch]">
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
      <section className="w-full bg-background px-4 md:px-12 pb-16 md:pb-32">
        <motion.div
          {...fadeUp(0)}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-black md:rounded-[1.35rem]"
          style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.14)" }}
        >
          <div className="absolute right-5 top-5 z-20 md:right-6 md:top-6">
            <CardCornerDot />
          </div>

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
