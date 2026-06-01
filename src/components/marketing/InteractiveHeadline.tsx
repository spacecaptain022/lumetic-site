"use client";

import { useMemo, useState } from "react";
import { m as motion, useReducedMotion } from "framer-motion";
import { MOTION_EASE_SWIFT } from "@/lib/motion";

const BRAND_ACCENT = "#D595AF";

type InteractiveHeadlineProps = {
  text: string;
  accentWords: string[];
  as?: "h1" | "h2" | "h3";
  className?: string;
  style?: React.CSSProperties;
};

function isAccentWord(word: string, accent: Set<string>) {
  return accent.has(word.replace(/[,.]/g, "").toLowerCase());
}

export default function InteractiveHeadline({
  text,
  accentWords,
  as: Tag = "h2",
  className = "",
  style,
}: InteractiveHeadlineProps) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const words = text.split(" ");
  const accent = useMemo(() => new Set(accentWords.map((w) => w.toLowerCase())), [accentWords]);

  if (reduce) {
    return (
      <Tag className={`font-sans text-foreground ${className}`} style={style}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag
      className={`font-sans text-foreground ${className}`}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={text}
    >
      {words.map((word, i) => {
        const wordAccent = isAccentWord(word, accent);
        const delay = i * 0.028;

        return (
          <motion.span
            key={`${word}-${i}`}
            className="relative inline-block align-top"
            style={{ marginRight: "0.26em" }}
            animate={
              hovered
                ? {
                    y: wordAccent ? -8 : -3,
                    scale: wordAccent ? 1.04 : 1,
                    color: wordAccent ? BRAND_ACCENT : "var(--foreground)",
                    opacity: 1,
                  }
                : {
                    y: 0,
                    scale: 1,
                    color: "var(--foreground)",
                    opacity: 1,
                  }
            }
            transition={{
              duration: 0.55,
              ease: MOTION_EASE_SWIFT,
              delay: hovered ? delay : delay * 0.35,
            }}
          >
            <span className="relative z-[1]">{word}</span>
            {wordAccent && (
              <motion.span
                className="pointer-events-none absolute -bottom-1 left-0 right-0 h-[2px] origin-left rounded-full bg-[#D595AF]"
                initial={false}
                animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
                transition={{
                  duration: 0.45,
                  ease: MOTION_EASE_SWIFT,
                  delay: hovered ? delay + 0.06 : 0,
                }}
                aria-hidden
              />
            )}
          </motion.span>
        );
      })}
    </Tag>
  );
}
