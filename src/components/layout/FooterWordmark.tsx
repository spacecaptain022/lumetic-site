"use client";

import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, m as motion, useReducedMotion } from "framer-motion";
import { MOTION_SPRING_MORPH } from "@/lib/motion";

type LetterConfig = {
  char: string;
  width: string;
  variants: ReactNode[];
};

/** Alternate glyph shapes: Fiasco-style swaps per letter */
const letters: LetterConfig[] = [
  {
    char: "L",
    width: "0.72em",
    variants: [
      <path
        key="l1"
        d="M18 82C14 58 16 34 22 16C28 8 38 10 42 18V48C58 44 68 52 66 68C62 84 38 88 18 82Z"
      />,
      <path key="l2" d="M16 14H44V38H36V78H16V14Z" />,
    ],
  },
  {
    char: "U",
    width: "0.82em",
    variants: [
      <path
        key="u1"
        d="M18 22V58C18 78 34 88 50 88C66 88 82 78 82 58V22H66V56C66 68 58 74 50 74C42 74 34 68 34 56V22H18Z"
      />,
      <path
        key="u2"
        d="M22 18V54C22 76 36 90 50 90C64 90 78 76 78 54V18H62V52C62 66 56 74 50 74C44 74 38 66 38 52V18H22Z"
      />,
    ],
  },
  {
    char: "M",
    width: "1.05em",
    variants: [
      <path
        key="m1"
        d="M8 78L22 18L38 58L50 22L62 58L78 18L92 78H76L68 38L50 72L32 38L24 78H8Z"
      />,
      <path key="m2" d="M10 18H26V58L42 18H58L74 58V18H90V78H74V38L58 78H42L26 38V78H10V18Z" />,
    ],
  },
  {
    char: "E",
    width: "0.72em",
    variants: [
      <g key="e1">
        <path d="M14 14H86V86H14Z" />
        <circle cx="50" cy="36" r="11" fill="var(--wordmark-hole)" />
        <path d="M36 78H64V86H36Z" fill="var(--wordmark-hole)" />
      </g>,
      <path key="e2" d="M16 18H84V34H34V44H78V58H34V68H84V82H16V18Z" />,
    ],
  },
  {
    char: "T",
    width: "0.72em",
    variants: [
      <path key="t1" d="M10 18H90V34H56V82H44V34H10V18Z" transform="skewX(-8)" />,
      <path key="t2" d="M8 18H92V36H58V82H42V36H8V18Z" />,
    ],
  },
  {
    char: "I",
    width: "0.38em",
    variants: [
      <g key="i1">
        <rect x="38" y="34" width="24" height="56" rx="2" />
        <circle cx="50" cy="18" r="14" />
      </g>,
      <g key="i2">
        <rect x="42" y="28" width="16" height="62" />
        <rect x="36" y="12" width="28" height="10" />
      </g>,
    ],
  },
  {
    char: "C",
    width: "0.78em",
    variants: [
      <path
        key="c1"
        d="M50 8L58 34L86 28L66 50L86 72L58 66L50 92L42 66L14 72L34 50L14 28L42 34L50 8Z"
      />,
      <path
        key="c2"
        d="M72 22C62 12 46 8 32 14C16 22 10 38 10 50C10 62 16 78 32 86C46 92 62 88 72 78L62 66C54 74 44 76 36 72C24 66 20 54 20 50C20 46 24 34 36 28C44 24 54 26 62 34L72 22Z"
      />,
    ],
  },
];

const morphTransition = {
  type: "spring" as const,
  ...MOTION_SPRING_MORPH,
};

function HoverLetter({
  char,
  width,
  variants,
  holeFill,
}: LetterConfig & { holeFill: string }) {
  const [hovered, setHovered] = useState(false);
  const [variantIndex, setVariantIndex] = useState(0);
  const reduce = useReducedMotion();

  const onEnter = useCallback(() => {
    setHovered(true);
    setVariantIndex((v) => (v + 1) % variants.length);
  }, [variants.length]);

  if (reduce) {
    return (
      <span className="inline-flex items-end justify-center leading-none" style={{ width, minHeight: "1em" }}>
        {char}
      </span>
    );
  }

  return (
    <span
      className="relative inline-flex items-end justify-center leading-none"
      style={{ width, minHeight: "1em", ["--wordmark-hole" as string]: holeFill }}
      onMouseEnter={onEnter}
      onMouseLeave={() => setHovered(false)}
      onFocus={onEnter}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      role="img"
      aria-label={char}
    >
      <motion.span
        className="inline-block origin-bottom"
        animate={{
          opacity: hovered ? 0 : 1,
          scale: hovered ? 0.86 : 1,
          y: hovered ? "0.05em" : 0,
          filter: hovered ? "blur(5px)" : "blur(0px)",
        }}
        transition={morphTransition}
        aria-hidden={hovered}
      >
        {char}
      </motion.span>

      <span className="pointer-events-none absolute inset-0 flex items-end justify-center" aria-hidden>
        <svg viewBox="0 0 100 100" className="h-[0.88em] w-full overflow-visible" fill="currentColor">
          <AnimatePresence mode="popLayout" initial={false}>
            {hovered && (
              <motion.g
                key={variantIndex}
                initial={{ opacity: 0, scale: 0.82, y: 6, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.06, y: -4, filter: "blur(6px)" }}
                transition={morphTransition}
                style={{ transformOrigin: "50px 85px", transformBox: "fill-box" }}
              >
                {variants[variantIndex]}
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </span>
    </span>
  );
}

type FooterWordmarkProps = {
  className?: string;
  holeFill?: string;
};

export default function FooterWordmark({
  className = "",
  holeFill = "#000000",
}: FooterWordmarkProps) {
  return (
    <div
      className={`flex w-full items-end justify-center gap-[0.01em] font-sans uppercase leading-none ${className}`}
      style={{
        fontSize: "clamp(5rem, 20vw, 18rem)",
        letterSpacing: "0.01em",
        marginBottom: "-0.12em",
      }}
    >
      {letters.map((letter) => (
        <HoverLetter key={letter.char} {...letter} holeFill={holeFill} />
      ))}
    </div>
  );
}
