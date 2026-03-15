"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
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

// Card 1 — Waveform (Brand Identity)
function WaveformGraphic() {
  const count = 32;
  const bars = Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const envelope = Math.sin(t * Math.PI);
    const h = 10 + envelope * 68 + Math.sin(i * 1.7 + 0.4) * 10 + Math.sin(i * 0.9) * 6;
    return Math.max(6, h);
  });
  return (
    <svg width="104" height="104" viewBox="0 0 104 104" fill="none" className="text-foreground">
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * (104 / count) + 0.5}
          y={(104 - h) / 2}
          width={2.5}
          height={h}
          rx={1.25}
          fill="currentColor"
          opacity={0.12 + (h / 90) * 0.82}
        />
      ))}
    </svg>
  );
}

// Card 2 — Starburst / Compass (Web Design)
function StarburstGraphic() {
  const cx = 52, cy = 52, r = 40;
  const spokes = [
    { angle: 0,   width: 7 },
    { angle: 45,  width: 3.5 },
    { angle: 90,  width: 7 },
    { angle: 135, width: 3.5 },
    { angle: 180, width: 7 },
    { angle: 225, width: 3.5 },
    { angle: 270, width: 7 },
    { angle: 315, width: 3.5 },
  ];
  return (
    <svg width="104" height="104" viewBox="0 0 104 104" fill="none" className="text-foreground">
      {/* Guide circle */}
      <circle cx={cx} cy={cy} r={r} stroke="currentColor" strokeWidth={0.75} strokeDasharray="3 3" opacity={0.25} />
      {/* Guide crosshairs */}
      <line x1={cx - r - 8} y1={cy} x2={cx + r + 8} y2={cy} stroke="currentColor" strokeWidth={0.75} opacity={0.18} />
      <line x1={cx} y1={cy - r - 8} x2={cx} y2={cy + r + 8} stroke="currentColor" strokeWidth={0.75} opacity={0.18} />
      {/* Spokes */}
      {spokes.map(({ angle, width }) => {
        const rad = (angle * Math.PI) / 180;
        const x2 = cx + Math.cos(rad) * r;
        const y2 = cy + Math.sin(rad) * r;
        return (
          <line
            key={angle}
            x1={cx}
            y1={cy}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth={width}
            strokeLinecap="round"
            opacity={0.9}
          />
        );
      })}
      {/* Center dot */}
      <circle cx={cx} cy={cy} r={2.5} fill="currentColor" opacity={0.5} />
    </svg>
  );
}

// Card 3 — Concentric offset spheres (Motion & Visual)
function SpheresGraphic() {
  const circles = [
    { r: 44, opacity: 0.07 },
    { r: 36, opacity: 0.11 },
    { r: 28, opacity: 0.18 },
    { r: 20, opacity: 0.28 },
    { r: 13, opacity: 0.42 },
    { r: 7,  opacity: 0.65 },
  ];
  const ox = 8, oy = 6;
  return (
    <svg width="104" height="104" viewBox="0 0 104 104" fill="none" className="text-foreground">
      {/* Subtle grid */}
      {[26, 52, 78].map(v => (
        <g key={v}>
          <line x1={v} y1={4} x2={v} y2={100} stroke="currentColor" strokeWidth={0.5} opacity={0.1} />
          <line x1={4} y1={v} x2={100} y2={v} stroke="currentColor" strokeWidth={0.5} opacity={0.1} />
        </g>
      ))}
      {circles.map(({ r, opacity }, i) => (
        <circle
          key={i}
          cx={52 + (i * ox) / circles.length}
          cy={52 + (i * oy) / circles.length}
          r={r}
          fill="currentColor"
          opacity={opacity}
        />
      ))}
    </svg>
  );
}

const services = [
  {
    title: "Brand Identity & Strategy",
    description:
      "Create cohesive, memorable brand identities that make you stand out and endure.",
    image: "/Card 1 graphic.jpg",
    Graphic: WaveformGraphic,
  },
  {
    title: "Web Design & Digital Presence",
    description:
      "Design intuitive, conversion-driven websites your customers will love.",
    image: "/Card 2 graphic.jpg",
    Graphic: StarburstGraphic,
  },
  {
    title: "Motion & Visual Content",
    description:
      "Bring your brand to life with engaging visuals, animations, and content systems.",
    image: "/Card 3 graphic.jpg",
    Graphic: SpheresGraphic,
  },
];

export default function Services() {
  const ctaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ctaRef,
    offset: ["start end", "end start"],
  });
  const bgY = useSpring(
    useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]),
    { stiffness: 50, damping: 20, mass: 1 }
  );

  return (
    <>
      {/* ── Services Grid ── */}
      <section className="w-full bg-background py-16 md:py-32 px-4 md:px-12">
        <motion.h2
          {...fadeUp(0)}
          className="font-display text-foreground uppercase text-center mb-14 md:mb-20"
          style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)", letterSpacing: "0.04em" }}
        >
          Services we provide
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              {...fadeUp(i * 0.1)}
              className="group relative flex flex-col justify-between bg-background border border-border rounded-3xl overflow-hidden md:min-h-[460px] cursor-pointer"
              style={{ boxShadow: "0 2px 20px 0 rgba(0,0,0,0.07)" }}
              whileHover={{ y: -5, boxShadow: "0 16px 48px 0 rgba(0,0,0,0.13)" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
            >
              {/* Text block — top left */}
              <div className="p-5 md:p-8 relative z-10 flex flex-col gap-4 md:gap-5">
                <div className="opacity-80">
                  <service.Graphic />
                </div>
                <div>
                  <h3
                    className="font-display text-foreground uppercase mb-2"
                    style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", letterSpacing: "0.04em", lineHeight: 1.0 }}
                  >
                    {service.title}
                  </h3>
                  <p className="font-sans text-foreground/60 leading-relaxed" style={{ fontSize: "0.82rem", maxWidth: "26ch" }}>
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Image — bleeds up from bottom */}
              <div className="relative w-full h-[180px] md:h-[240px] mt-auto overflow-hidden">
                <Image
                  src={service.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top opacity-90 transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                  aria-hidden
                />
                {/* Fade into card background at top of image */}
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="w-full bg-background px-4 md:px-12 pb-16 md:pb-32">
        <motion.div
          ref={ctaRef}
          {...fadeUp(0)}
          className="relative max-w-6xl mx-auto rounded-3xl overflow-hidden"
          style={{ boxShadow: "0 2px 20px 0 rgba(0,0,0,0.07)" }}
        >
          {/* Background graphic — parallax */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ y: bgY, scale: 1.25 }}
          >
            <Image
              src="/Card 4 graphic.png"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover opacity-90"
              aria-hidden
            />
          </motion.div>

          {/* Subtle vignette — edges only, keeps center clear */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(245,245,243,0.72)_100%)] pointer-events-none" />

          {/* Thin frosted text stage */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[80%] bg-background/30 backdrop-blur-[2px] pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 px-6 py-14 md:px-20 md:py-36 text-center">
            <motion.div {...fadeUp(0.05)} className="flex justify-center mb-7">
              <Image
                src="/Lumetic logo black no text.png"
                alt="Lumetic"
                width={40}
                height={40}
                className="w-9 h-9 opacity-90"
              />
            </motion.div>

            <motion.h2
              {...fadeUp(0.1)}
              className="font-display text-foreground uppercase mb-5"
              style={{ fontSize: "clamp(2.6rem, 6vw, 5.5rem)", letterSpacing: "0.03em", lineHeight: 0.95 }}
            >
              Curious how branding can<br className="hidden md:block" /> elevate your business?
            </motion.h2>

            <motion.p
              {...fadeUp(0.18)}
              className="font-sans text-foreground/75 mb-10 max-w-sm mx-auto leading-relaxed"
              style={{ fontSize: "0.84rem" }}
            >
              Let&apos;s talk. Book a free consultation and discover how Lumetic can grow your brand.
            </motion.p>

            <motion.div {...fadeUp(0.26)}>
              <a
                href="#contact"
                className="inline-flex items-center gap-2.5 bg-foreground text-background font-sans font-medium px-8 py-3.5 rounded-full text-sm tracking-wide hover:bg-foreground/85 transition-colors duration-200 group"
              >
                Book a call
                <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform duration-200" />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
