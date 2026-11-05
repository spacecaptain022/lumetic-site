import Link from "next/link";
import type { MouseEventHandler } from "react";

type Tone = "ink" | "paper" | "glass" | "outline";

const tones: Record<Tone, { body: string; chip: string }> = {
  ink: {
    body: "bg-ink text-paper hover:bg-ink/88",
    chip: "bg-paper/14 text-paper group-hover:bg-paper group-hover:text-ink",
  },
  paper: {
    body: "bg-paper text-ink hover:bg-white",
    chip: "bg-ink text-paper",
  },
  glass: {
    body: "bg-ink/70 text-paper backdrop-blur-md hover:bg-ink",
    chip: "bg-paper/14 text-paper group-hover:bg-paper group-hover:text-ink",
  },
  outline: {
    body: "border border-ink/20 text-ink hover:border-ink",
    chip: "bg-ink/6 text-ink group-hover:bg-ink group-hover:text-paper",
  },
};

export function Arrow({ className = "", dir = "up-right" }: { className?: string; dir?: "up-right" | "right" }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className} aria-hidden>
      {dir === "right" ? (
        <path d="M0.5 6h10M6.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
      ) : (
        <path d="M2 10L10 2M3.5 2H10v6.5" stroke="currentColor" strokeWidth="1.4" />
      )}
    </svg>
  );
}

/** Primary action: label with a square arrow chip, the studio's one button shape. */
export default function BlockLink({
  href,
  children,
  tone = "ink",
  size = "md",
  external = false,
  onClick,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  tone?: Tone;
  size?: "sm" | "md";
  external?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className?: string;
}) {
  const t = tones[tone];
  const box = size === "sm" ? "h-10 pl-3.5 pr-1 gap-3 text-[0.85rem]" : "h-12 pl-4 pr-1.5 gap-4 text-[0.92rem]";
  const chip = size === "sm" ? "h-8 w-8" : "h-9 w-9";

  const inner = (
    <>
      <span className="whitespace-nowrap font-medium">{children}</span>
      <span className={`flex items-center justify-center overflow-hidden rounded-[7px] transition-colors duration-300 ${chip} ${t.chip}`}>
        <span className="relative block h-3 w-3 overflow-hidden">
          <Arrow className="absolute inset-0 transition-transform duration-500 ease-swift group-hover:-translate-y-[160%] group-hover:translate-x-[160%]" />
          <Arrow className="absolute inset-0 -translate-x-[160%] translate-y-[160%] transition-transform duration-500 ease-swift group-hover:translate-x-0 group-hover:translate-y-0" />
        </span>
      </span>
    </>
  );

  const cls = `group inline-flex items-center rounded-[10px] transition-colors duration-300 ${box} ${t.body} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} onClick={onClick}>
        {inner}
      </a>
    );
  }
  // Same-page anchors stay plain <a> so Lenis handles the scroll.
  if (href.startsWith("#") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls} onClick={onClick}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} onClick={onClick}>
      {inner}
    </Link>
  );
}
