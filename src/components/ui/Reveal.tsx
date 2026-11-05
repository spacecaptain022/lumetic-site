"use client";

import { m as motion } from "framer-motion";
import { MOTION_EASE_SWIFT } from "@/lib/motion";

/** Restrained section entrance. Used on headings, not on every element. */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease: MOTION_EASE_SWIFT, delay }}
    >
      {children}
    </motion.div>
  );
}
