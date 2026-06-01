"use client";

import { useEffect, useRef, useState } from "react";
import { m as motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { fadeUpReveal } from "@/lib/motion";

const cards = [
  {
    title: "Identity Systems",
    desc: "A unified visual language that scales from launch assets to long-term brand operations.",
    image: "/Card 1 graphic.jpg",
  },
  {
    title: "Digital Platforms",
    desc: "Web experiences designed for clarity, trust, and conversion at every stage of the funnel.",
    image: "/Card 2 graphic.jpg",
  },
  {
    title: "Motion Language",
    desc: "A motion framework teams can reuse across product, campaigns, social, and events.",
    image: "/Card 3 graphic.jpg",
  },
  {
    title: "Launch Direction",
    desc: "From narrative architecture to rollout assets, built for category-level impact.",
    image: "/card-4-graphic.webp",
  },
] as const;

const logos = ["NOTION", "OPENAI", "GUARDIAN", "PIXEL", "ATOM", "NOVA"] as const;

function FlowCard({
  title,
  desc,
  image,
  delay,
}: {
  title: string;
  desc: string;
  image: string;
  delay: number;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [16, -16]);

  return (
    <motion.article
      ref={cardRef}
      {...fadeUpReveal(delay)}
      className="group min-w-[84vw] snap-start overflow-hidden rounded-2xl border border-foreground/[0.08] bg-card md:min-w-[40rem]"
    >
      <div className="relative h-[16rem] w-full overflow-hidden md:h-[20rem]">
        <motion.div className="absolute inset-0" style={{ y: imageY }}>
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 84vw, 640px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/12 to-transparent" />
      </div>
      <div className="space-y-3 px-5 py-5 md:px-7 md:py-6">
        <h3
          className="font-sans font-medium text-foreground"
          style={{ fontSize: "clamp(1.35rem, 2.4vw, 1.85rem)", letterSpacing: "-0.02em", lineHeight: 1.12 }}
        >
          {title}
        </h3>
        <p className="max-w-[56ch] font-sans text-[0.86rem] leading-relaxed text-foreground/65 md:text-[0.9rem]">
          {desc}
        </p>
      </div>
    </motion.article>
  );
}

export default function ShowcaseFlow() {
  const railRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) {
        setProgress(0);
        return;
      }
      setProgress(Math.min(Math.max(el.scrollLeft / max, 0), 1));
    };

    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="w-full bg-background">
      <div className="relative h-[120vh]">
        <div className="sticky top-[5.2rem]">
          <div className="mx-auto max-w-6xl px-4 pb-10 pt-10 md:px-12 md:pb-12 md:pt-14">
            <motion.p
              {...fadeUpReveal(0)}
              className="mb-3 font-sans text-[0.62rem] uppercase tracking-[0.22em] text-foreground/55"
            >
              Selected Work
            </motion.p>
            <motion.h2
              {...fadeUpReveal(0.05)}
              className="max-w-[18ch] font-sans text-foreground"
              style={{ fontSize: "clamp(1.7rem, 3.3vw, 3.2rem)", lineHeight: 1.08, letterSpacing: "-0.01em" }}
            >
              Brand and digital systems that help ambitious companies move with confidence.
            </motion.h2>

            <motion.div {...fadeUpReveal(0.08)} className="mt-6">
              <div className="h-[2px] w-full overflow-hidden rounded-full bg-foreground/[0.08]">
                <div
                  className="h-full rounded-full bg-foreground/60 transition-[width] duration-150"
                  style={{ width: `${Math.max(progress * 100, 6)}%` }}
                />
              </div>
            </motion.div>
          </div>

          <div
            ref={railRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 md:gap-5 md:px-12 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {cards.map((card, i) => (
              <FlowCard
                key={card.title}
                title={card.title}
                desc={card.desc}
                image={card.image}
                delay={i * 0.05}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-4 md:px-12 md:pb-22 md:pt-10">
        <motion.p
          {...fadeUpReveal(0)}
          className="mb-5 font-sans text-[0.58rem] uppercase tracking-[0.22em] text-foreground/48"
        >
          Trusted by teams building the future
        </motion.p>
        <motion.div
          {...fadeUpReveal(0.06)}
          className="flex flex-wrap items-center gap-x-8 gap-y-4 border-y border-foreground/[0.08] py-5 md:gap-x-12"
        >
          {logos.map((logo) => (
            <span
              key={logo}
              className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.2em] text-foreground/58 md:text-[0.76rem]"
            >
              {logo}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        {...fadeUpReveal(0)}
        className="mx-0 flex min-h-[8.5rem] w-full items-center justify-center bg-[#f2ea00] px-4 text-center md:min-h-[10rem]"
      >
        <a
          href="#contact"
          className="inline-flex items-center gap-2 font-sans text-base font-medium tracking-tight text-black transition-opacity hover:opacity-75 md:text-xl"
        >
          Let&apos;s get going on your next project
          <ArrowUpRight size={18} strokeWidth={1.8} />
        </a>
      </motion.div>
    </section>
  );
}
