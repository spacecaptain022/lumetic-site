/**
 * Shared motion tokens: one easing language across the site.
 */
export const MOTION_EASE_STANDARD = [0.22, 1, 0.36, 1] as const;
export const MOTION_EASE_SWIFT = [0.16, 1, 0.3, 1] as const;

/** For CSS transition / inline style strings */
export const MOTION_EASE_CSS_STANDARD = "cubic-bezier(0.22, 1, 0.36, 1)";
export const MOTION_EASE_CSS_SWIFT = "cubic-bezier(0.16, 1, 0.3, 1)";

export const MOTION_DURATION = {
  instant: 0.15,
  fast: 0.4,
  base: 0.8,
  slow: 1.1,
} as const;

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

export const inViewReveal = {
  once: true as const,
  margin: "0px 0px 20% 0px",
  amount: 0.12,
} as const;

export function motionTransition(
  duration: number = MOTION_DURATION.base,
  ease: readonly [number, number, number, number] = MOTION_EASE_STANDARD,
  delay = 0
) {
  return { duration, ease, delay };
}

/** Scroll-triggered section reveal */
export function fadeUpReveal(delay = 0, y = 36) {
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: scrollRevealViewport,
    transition: motionTransition(MOTION_DURATION.base, MOTION_EASE_STANDARD, delay),
  };
}

/** Softer reveal for footer / secondary blocks */
export function fadeUpRevealSubtle(delay = 0, y = 28) {
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: scrollRevealViewportSubtle,
    transition: motionTransition(MOTION_DURATION.base, MOTION_EASE_STANDARD, delay),
  };
}

/** Mount / hero entrance */
export function fadeUpEnter(delay = 0, y = 56) {
  return {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: motionTransition(MOTION_DURATION.slow, MOTION_EASE_STANDARD, delay),
  };
}

/** Route template / page transitions */
export function pageEnterTransition() {
  return motionTransition(MOTION_DURATION.fast, MOTION_EASE_SWIFT);
}

/** Lenis-friendly spring for scroll-linked UI (progress bar, etc.) */
export const MOTION_SPRING_SCROLL = {
  stiffness: 140,
  damping: 24,
  mass: 0.2,
} as const;

/** Soft spring for letter morph / hover swaps */
export const MOTION_SPRING_MORPH = {
  stiffness: 220,
  damping: 28,
  mass: 0.75,
} as const;
