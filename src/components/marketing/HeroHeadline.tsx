"use client";

import InteractiveHeadline from "@/components/marketing/InteractiveHeadline";

const HEADLINE =
  "A branding studio blending strategy and creative craft to build identities that lead, not follow";

const ACCENT_WORDS = ["strategy", "creative", "craft", "identities", "lead", "follow"];

const headlineTypography = {
  fontSize: "clamp(1.75rem, 4.2vw, 3.35rem)",
  lineHeight: 1.14,
  letterSpacing: "-0.025em",
} as const;

type HeroHeadlineProps = {
  className?: string;
};

export default function HeroHeadline({ className = "" }: HeroHeadlineProps) {
  return (
    <InteractiveHeadline
      as="h1"
      text={HEADLINE}
      accentWords={ACCENT_WORDS}
      className={`font-normal ${className}`}
      style={headlineTypography}
    />
  );
}
