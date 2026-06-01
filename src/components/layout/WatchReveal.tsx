"use client";

import { m as motion, useReducedMotion } from "framer-motion";
import { fadeUpReveal } from "@/lib/motion";

type WatchRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "p" | "h2" | "h3" | "article";
};

export default function WatchReveal({
  children,
  className,
  delay = 0,
  as = "div",
}: WatchRevealProps) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  if (reduce) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Component {...fadeUpReveal(delay)} className={className}>
      {children}
    </Component>
  );
}
