"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const ease = [0.22, 1, 0.36, 1] as const;

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 48 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.0, ease, delay },
  };
}

function fadeIn(delay: number) {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.9, ease: "easeOut" as const, delay },
  };
}

const displayStyle = {
  fontSize: "clamp(5rem, 19vw, 21rem)",
  letterSpacing: "0.01em",
  lineHeight: 0.9,
} as const;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const frameRef = useRef<number>(0);
  const hoveringRef = useRef(false);
  const scaleRef = useRef(0);
  const tRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouseRef = useRef({ x: 0, y: 0 });

  // Scroll-driven parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 60, damping: 20, mass: 0.8 };

  const eyeY     = useSpring(useTransform(scrollYProgress, [0, 1], [0, -80]),   springConfig);
  const eyeScale = useSpring(useTransform(scrollYProgress, [0, 0.7], [1, 1.3]), springConfig);
  const line1Y  = useSpring(useTransform(scrollYProgress, [0, 1], [0, -140]), springConfig);
  const line2Y  = useSpring(useTransform(scrollYProgress, [0, 1], [0, -100]), springConfig);
  const line3Y  = useSpring(useTransform(scrollYProgress, [0, 1], [0, -60]),  springConfig);
  const descY   = useSpring(useTransform(scrollYProgress, [0, 1], [0, -40]),  springConfig);
  const descOp  = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  // Morph animation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    };
  };
  const handleMouseLeave = () => {
    hoveringRef.current = false;
    mouseRef.current = { x: 0, y: 0 };
  };
  const handleMouseEnter = () => { hoveringRef.current = true; };

  useEffect(() => {
    // No mouse on touch devices — skip the entire loop
    if (window.matchMedia("(pointer: coarse)").matches) return;

    function tick() {
      const mx = smoothMouseRef.current.x;
      const my = smoothMouseRef.current.y;
      const isActive = hoveringRef.current || scaleRef.current > 0.5;

      if (isActive) {
        tRef.current += 0.001;
        const t = tRef.current;
        smoothMouseRef.current.x += (mouseRef.current.x - mx) * 0.06;
        smoothMouseRef.current.y += (mouseRef.current.y - my) * 0.06;
        const dist = Math.sqrt(mx * mx + my * my);
        const target = hoveringRef.current ? 3 + dist * 8 : 0;
        scaleRef.current += (target - scaleRef.current) * 0.04;

        // Update DOM every other frame to reduce filter recalc cost
        if (Math.round(tRef.current * 1000) % 2 === 0) {
          if (turbRef.current) {
            const fx = 0.005 + Math.abs(mx) * 0.005 + Math.sin(t * 0.4) * 0.001;
            const fy = 0.005 + Math.abs(my) * 0.005 + Math.sin(t * 0.6) * 0.001;
            turbRef.current.setAttribute("baseFrequency", `${fx.toFixed(4)} ${fy.toFixed(4)}`);
          }
          if (dispRef.current) {
            dispRef.current.setAttribute("scale", `${scaleRef.current.toFixed(2)}`);
          }
        }
      }

      frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen bg-background overflow-hidden flex flex-col">

      {/* Main hero body */}
      <div className="flex-1 relative flex flex-col justify-center pt-20 md:pt-28">

        {/* SVG displacement filter */}
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <filter id="eye-morph" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="linearRGB">
              <feTurbulence ref={turbRef} type="fractalNoise" baseFrequency="0.005 0.005" numOctaves="4" seed="3" result="noise" />
              <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>

        {/* Eye — parallax layer (slowest) */}
        <motion.div
          {...fadeIn(0.4)}
          style={{ y: eyeY, scale: eyeScale, overflow: "visible" }}
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
        >
          <div
            className="relative w-[50vw] max-w-[600px] min-w-[260px] aspect-square cursor-none pointer-events-auto"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ overflow: "visible", filter: "url(#eye-morph)" }}
          >
            <Image src="/lumetic eye [Vectorized]2.svg" alt="Lumetic eye" fill sizes="(max-width: 768px) 50vw, 600px" className="object-contain" priority />
          </div>
        </motion.div>

        {/* Text lines — each on its own parallax layer */}
        <div className="relative w-full select-none overflow-visible">
          <motion.div {...fadeUp(0.1)} style={{ y: line1Y }} className="relative w-full px-4 md:px-8">
            <h1 className="font-display text-foreground uppercase" style={displayStyle}>DEFINE</h1>
          </motion.div>
          <motion.div {...fadeUp(0.2)} style={{ y: line2Y }} className="relative w-full px-4 md:px-8">
            <h1 className="font-display text-foreground uppercase" style={displayStyle}>YOUR</h1>
          </motion.div>
          <motion.div {...fadeUp(0.3)} style={{ y: line3Y }} className="relative w-full px-4 md:px-8">
            <h1 className="font-display text-foreground uppercase" style={displayStyle}>BRAND</h1>
          </motion.div>
        </div>

        {/* Descriptor — fades out on scroll */}
        <div className="relative z-10 flex items-end justify-between w-full px-4 md:px-8 mt-8 md:mt-12 pb-10 md:pb-14">
          {/* Mobile CTA */}
          <motion.a
            {...fadeIn(0.7)}
            href="#services"
            className="md:hidden inline-flex items-center gap-2 bg-foreground text-background font-sans font-medium px-6 py-3 rounded-full text-sm tracking-wide"
          >
            Our Work <ArrowRight size={13} strokeWidth={1.5} />
          </motion.a>

          {/* Desktop descriptor */}
          <motion.div
            {...fadeIn(0.7)}
            style={{ y: descY, opacity: descOp }}
            className="hidden md:flex flex-col gap-4 max-w-[280px] text-right bg-background/50 backdrop-blur-sm border border-foreground/[0.07] rounded-2xl px-5 py-5 ml-auto"
          >
            <p className="text-foreground font-sans font-semibold uppercase leading-snug" style={{ fontSize: "0.7rem", letterSpacing: "0.1em" }}>
              Lumetic crafts identities that transcend trends
            </p>
            <p className="text-foreground/70 font-sans font-light leading-relaxed" style={{ fontSize: "0.78rem" }}>
              Strategy, vision, and design converge to build brand systems that resonate deeply.
              We partner with forward-thinking companies to create identities that lead, not follow.
            </p>
            <a
              href="#services"
              className="inline-flex items-center justify-end gap-2 text-foreground/60 hover:text-foreground transition-colors duration-200 group"
              style={{ fontSize: "0.78rem" }}
            >
              <span className="font-sans font-medium tracking-wide">Our Work</span>
              <ArrowRight size={12} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-200" />
            </a>
          </motion.div>
        </div>

      </div>

      {/* Hairline border */}
      <div className="w-full h-px bg-foreground/10" />
    </section>
  );
}
