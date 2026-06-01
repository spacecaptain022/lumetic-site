"use client";

import { useMemo, useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { MOTION_EASE_CSS_STANDARD } from "@/lib/motion";

type ScrollWordRevealProps = {
  text: string;
  className?: string;
  wordClassName?: string;
};

export default function ScrollWordReveal({
  text,
  className,
  wordClassName,
}: ScrollWordRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);
  const [progress, setProgress] = useState(0);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 88%", "end 38%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) {
      setProgress(1);
      return;
    }
    setProgress(v);
  });

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const t = words.length <= 1 ? 1 : i / (words.length - 1);
        const revealed = reduce || progress > t * 0.94;
        return (
          <span
            key={`${word}-${i}`}
            className={wordClassName}
            style={{
              opacity: revealed ? 1 : 0.24,
              transition: `opacity 280ms ${MOTION_EASE_CSS_STANDARD}`,
            }}
          >
            {i > 0 ? " " : ""}
            {word}
          </span>
        );
      })}
    </p>
  );
}
