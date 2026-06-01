"use client";

import { useEffect, useState } from "react";

const DEFAULT_SECTIONS = ["hero", "about", "services", "work", "contact"] as const;

export function sectionIdFromHref(href: string): string | null {
  const match = href.match(/^\/#(.+)$/);
  return match?.[1] ?? null;
}

export function useActiveSection(sectionIds: readonly string[] = DEFAULT_SECTIONS) {
  const [activeSection, setActiveSection] = useState<string>("hero");

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }

        let bestId = "hero";
        let bestRatio = -1;

        for (const id of sectionIds) {
          const ratio = ratios.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        setActiveSection(bestId);
      },
      {
        rootMargin: "-72px 0px -55% 0px",
        threshold: [0, 0.05, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 1],
      }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
}
