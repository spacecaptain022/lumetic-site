"use client";

import { m as motion, useScroll, useSpring } from "framer-motion";
import { MOTION_SPRING_SCROLL } from "@/lib/motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, MOTION_SPRING_SCROLL);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[120] h-[2px] origin-left bg-foreground/80"
      style={{ scaleX }}
    />
  );
}
