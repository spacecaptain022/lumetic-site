"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m as motion } from "framer-motion";
import BlockLink from "@/components/ui/BlockLink";
import Mark from "@/components/ui/Mark";
import { MOTION_EASE_SWIFT } from "@/lib/motion";
import { useActiveSection } from "@/lib/useActiveSection";

/** The centre of the pill names where you are. */
const SECTION_LABELS: Record<string, string> = {
  studio: "What is Lumetic",
  work: "Selected work",
  services: "Four practices",
  system: "From idea to system",
  about: "Lumetic today",
  approach: "Engagements",
  faq: "Questions",
  contact: "Start a project",
};
const SECTIONS = Object.keys(SECTION_LABELS);

const LINKS = [
  { label: "Work", href: "/work", section: null },
  { label: "Services", href: "/#services", section: "services" },
  { label: "About", href: "/#about", section: "about" },
  { label: "Approach", href: "/#approach", section: "approach" },
  { label: "Contact", href: "/#contact", section: "contact" },
] as const;

function routeLabel(pathname: string) {
  if (pathname === "/work") return "Work";
  if (pathname.startsWith("/work/")) return "Case study";
  if (pathname === "/privacy") return "Privacy";
  if (pathname === "/terms") return "Terms";
  return "Clarity over noise";
}

/** Floating pill navigation with a dot-grid toggle that unfolds the menu inside the pill. */
export default function SiteNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const activeSection = useActiveSection(SECTIONS);
  const [open, setOpen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);

  const centre = isHome ? SECTION_LABELS[activeSection] ?? "Clarity over noise" : routeLabel(pathname);

  useEffect(() => {
    if (!open) return;
    const panel = shellRef.current;
    panel?.querySelector<HTMLElement>("[data-menu] a")?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onPointer(e: PointerEvent) {
      if (panel && !panel.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 md:top-[22px]">
      <a
        href="#main"
        className="label pointer-events-auto absolute left-3 top-0 -translate-y-24 rounded-md bg-ink px-3 py-2 text-paper focus:translate-y-0"
      >
        Skip to content
      </a>

      <div
        ref={shellRef}
        className="pointer-events-auto w-full max-w-[29rem] overflow-hidden rounded-[12px] bg-ink/80 text-paper shadow-[0_10px_40px_rgb(0_0_0/0.18)] backdrop-blur-xl"
      >
        <div className="flex h-11 items-center justify-between pl-3.5 pr-1.5">
          <Link href="/" aria-label="Lumetic home" onClick={() => setOpen(false)}>
            <Mark className="h-[1.15rem] w-auto" />
          </Link>

          <span className="relative h-4 flex-1 overflow-hidden text-center" aria-hidden>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={open ? "menu" : centre}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-110%", opacity: 0 }}
                transition={{ duration: 0.45, ease: MOTION_EASE_SWIFT }}
                className="label absolute inset-x-0 block"
              >
                {open ? "Menu" : centre}
              </motion.span>
            </AnimatePresence>
          </span>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-8 w-8 items-center justify-center rounded-[8px] transition-colors hover:bg-paper/12"
          >
            <span className="relative block h-3 w-3">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="absolute h-[4px] w-[4px] rounded-[0.5px] bg-paper transition-[transform,opacity] duration-500 ease-swift"
                  style={{
                    left: i % 2 ? 8 : 0,
                    top: i < 2 ? 0 : 8,
                    opacity: open ? 0 : 1,
                    transform: open ? `translate(${i % 2 ? -4 : 4}px, ${i < 2 ? 4 : -4}px) scale(0.2)` : "none",
                  }}
                />
              ))}
              {/* Dots gather into the centre and a close mark takes their place */}
              {[45, -45].map((deg) => (
                <span
                  key={deg}
                  className="absolute left-1/2 top-1/2 h-[1.5px] w-[13px] -translate-x-1/2 -translate-y-1/2 bg-paper transition-[transform,opacity] duration-500 ease-swift"
                  style={{
                    opacity: open ? 1 : 0,
                    transform: `translate(-50%, -50%) rotate(${open ? deg : 0}deg) scaleX(${open ? 1 : 0})`,
                  }}
                />
              ))}
            </span>
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.nav
              id="site-menu"
              data-menu
              aria-label="Main"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: MOTION_EASE_SWIFT }}
            >
              <ul className="px-3.5 pt-2">
                {LINKS.map((link) => {
                  const href = isHome && link.section ? `#${link.section}` : link.href;
                  const current = link.section ? isHome && activeSection === link.section : pathname.startsWith("/work");
                  const cls =
                    "group flex items-baseline justify-between border-t border-paper/12 py-3 text-[1.75rem] font-semibold leading-none tracking-[-0.03em]";
                  const content = (
                    <>
                      <span className={current ? "" : "opacity-70 transition-opacity group-hover:opacity-100"}>
                        {link.label}
                      </span>
                    </>
                  );
                  return (
                    <li key={link.label}>
                      {href.startsWith("#") ? (
                        <a href={href} className={cls} onClick={() => setOpen(false)} aria-current={current ? "true" : undefined}>
                          {content}
                        </a>
                      ) : (
                        <Link href={href} className={cls} onClick={() => setOpen(false)} aria-current={current ? "true" : undefined}>
                          {content}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className="mt-2 flex items-center justify-between gap-3 border-t border-paper/12 px-3.5 py-3">
                <a href="mailto:hello@lumetic.io" className="text-[0.85rem] text-paper/70 hover:text-paper">
                  hello@lumetic.io
                </a>
                <BlockLink href={isHome ? "#contact" : "/#contact"} tone="paper" size="sm" onClick={() => setOpen(false)}>
                  Start a project
                </BlockLink>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
