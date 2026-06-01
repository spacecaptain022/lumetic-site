"use client";

import { useRef } from "react";
import Image from "next/image";
import { m as motion, useScroll, useTransform } from "framer-motion";
import { featuredProjects } from "@/data/featuredProjects";
import WatchReveal from "@/components/layout/WatchReveal";
import { fadeUpReveal } from "@/lib/motion";

function ProjectTile({
  title,
  excerpt,
  categories,
  image,
  aspect,
  delay,
}: {
  title: string;
  excerpt: string;
  categories: string[];
  image: string;
  aspect: "16x9" | "4x3" | "square";
  delay: number;
}) {
  const tileRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: tileRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [12, -12]);

  return (
    <motion.article
      ref={tileRef}
      {...fadeUpReveal(delay)}
      className="relative flex flex-col gap-4"
      data-cursor-label={`Explore ${title}`}
    >
      <a href="#contact" className="absolute inset-0 z-20" aria-label={`Explore ${title}`} />
      <div
        className={`relative w-full overflow-hidden rounded-xl bg-foreground/[0.04] ${
          aspect === "16x9" ? "aspect-video" : aspect === "4x3" ? "aspect-[4/3]" : "aspect-square"
        }`}
      >
        <motion.div className="absolute inset-0" style={{ y: imageY }}>
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
          />
        </motion.div>
      </div>

      <div className="space-y-2 pr-2">
        <h4 className="font-sans text-[0.62rem] font-medium uppercase tracking-[0.2em] text-foreground/55">
          {title}
        </h4>
        <p className="max-w-[42ch] font-sans text-[0.9rem] leading-relaxed text-foreground/72 md:text-[0.95rem]">
          {excerpt}
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1">
          {categories.map((cat) => (
            <span
              key={cat}
              className="font-sans text-[0.58rem] uppercase tracking-[0.18em] text-foreground/45"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}


export default function WorkGrid() {
  return (
    <section className="w-full bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-12 md:py-24">
        <WatchReveal className="mx-auto max-w-3xl text-center">
          <p className="mb-4 font-sans text-[0.62rem] uppercase tracking-[0.22em] text-foreground/55">
            What is Lumetic
          </p>
          <h2
            className="font-sans text-foreground"
            style={{
              fontSize: "clamp(1.6rem, 3.2vw, 2.75rem)",
              lineHeight: 1.12,
              letterSpacing: "-0.015em",
            }}
          >
            Brands thrive by forging deeper connections with their audience. What we create matters, but
            what we make possible matters more.
          </h2>
        </WatchReveal>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 pb-16 md:grid-cols-2 md:gap-x-8 md:gap-y-14 md:px-12 md:pb-24">
        <div className="flex flex-col gap-10 md:gap-14">
          {featuredProjects
            .filter((p) => p.column === "left")
            .map((project, i) => (
              <ProjectTile key={project.slug} {...project} delay={i * 0.08} />
            ))}
        </div>
        <div className="flex flex-col gap-10 md:gap-14 md:pt-16">
          {featuredProjects
            .filter((p) => p.column === "right")
            .map((project, i) => (
              <ProjectTile key={project.slug} {...project} delay={0.06 + i * 0.08} />
            ))}
        </div>
      </div>
    </section>
  );
}
