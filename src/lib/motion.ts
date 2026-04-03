/**
 * Scroll-triggered motion defaults tuned for mobile:
 * Negative viewport margins delay intersection (content can stay invisible). Positive bottom
 * rootMargin expands the observer root so reveals fire slightly earlier and feel smoother on
 * short viewports and fast flicks.
 */
export const scrollRevealViewport = {
  once: true as const,
  margin: "0px 0px 22% 0px",
  amount: 0.08,
} as const;

export const scrollRevealViewportSubtle = {
  once: true as const,
  margin: "0px 0px 14% 0px",
  amount: 0.15,
} as const;

/** useInView (e.g. stats count-up) — match scroll reveal timing */
export const inViewReveal = {
  once: true as const,
  margin: "0px 0px 20% 0px",
  amount: 0.12,
} as const;
