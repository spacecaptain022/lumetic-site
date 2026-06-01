"use client";

type LinkCharShiftProps = {
  children: string;
  className?: string;
  href: string;
  onClick?: () => void;
  "aria-current"?: "true" | "page" | "step" | "location" | "date" | "time" | undefined;
};

export default function LinkCharShift({
  children,
  className = "",
  href,
  onClick,
  "aria-current": ariaCurrent,
}: LinkCharShiftProps) {
  const chars = children.split("");

  return (
    <a
      href={href}
      onClick={onClick}
      className={`group inline-flex overflow-hidden ${className}`}
      aria-current={ariaCurrent}
    >
      <span className="sr-only">{children}</span>
      <span aria-hidden className="inline-flex">
        {chars.map((char, i) => (
          <span
            key={`${char}-${i}`}
            className="relative inline-block overflow-hidden"
            style={{ width: char === " " ? "0.35em" : undefined }}
          >
            <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
              {char === " " ? "\u00A0" : char}
            </span>
            <span
              className="absolute left-0 top-full inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full"
              aria-hidden
            >
              {char === " " ? "\u00A0" : char}
            </span>
          </span>
        ))}
      </span>
    </a>
  );
}
