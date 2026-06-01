"use client";

import { useState, useEffect, useRef } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";
import Image from "next/image";
import LinkCharShift from "@/components/layout/LinkCharShift";
import { MOTION_EASE_SWIFT, motionTransition, MOTION_DURATION } from "@/lib/motion";
import { sectionIdFromHref, useActiveSection } from "@/lib/useActiveSection";

const navLeft = [
  { label: "X", href: "https://x.com/LumeticStudio" },
  { label: "Services", href: "/#services" },
];
const navRight = [
  { label: "About", href: "/#about" },
  { label: "Work", href: "/work" },
  { label: "Contact", href: "/#contact" },
];

function navLinkClass(isActive: boolean) {
  return `text-[10px] uppercase tracking-[0.2em] font-sans font-medium transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
    isActive ? "text-foreground" : "text-foreground/55 hover:text-foreground"
  }`;
}

function mobileNavLinkClass(isActive: boolean) {
  return `text-3xl font-sans font-medium tracking-tight transition-colors sm:text-4xl ${
    isActive ? "text-foreground" : "text-foreground/55 hover:text-foreground/80"
  }`;
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const activeSection = useActiveSection();

  useEffect(() => {
    if (!menuOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const menuEl = menuRef.current;
    const focusable = menuEl
      ? Array.from(
          menuEl.querySelectorAll<HTMLElement>(
            'a[href], button, [tabindex]:not([tabindex="-1"])'
          )
        )
      : [];
    focusable[0]?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (e.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [menuOpen]);

  const navBg = "bg-background/78";
  const navBorder = "border-foreground/[0.07]";

  return (
    <>
      {/* Desktop nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center px-5 py-4 md:px-12 md:py-5 backdrop-blur-sm border-b transition-colors duration-500 ${navBg} ${navBorder}`}>
        {/* Left links */}
        <ul className="hidden md:flex items-center gap-10 flex-1">
          {navLeft.map((item) => {
            const sectionId = sectionIdFromHref(item.href);
            const isActive = sectionId !== null && activeSection === sectionId;
            return (
            <li key={item.label}>
              <LinkCharShift
                href={item.href}
                className={navLinkClass(isActive)}
                aria-current={isActive ? "true" : undefined}
              >
                {item.label}
              </LinkCharShift>
            </li>
            );
          })}
        </ul>

        {/* Center: logo mark only (desktop), truly centered */}
        <a href="/" className="hidden md:flex justify-center select-none flex-shrink-0" aria-label="Lumetic home">
          <Image
            src="/Lumetic logo black no text.png"
            alt="Lumetic"
            width={36}
            height={36}
            priority
            className="w-8 h-8 md:w-9 md:h-9 transition-all duration-500"
          />
        </a>

        {/* Right links */}
        <ul className="hidden md:flex items-center justify-end gap-10 flex-1">
          {navRight.map((item) => {
            const sectionId = sectionIdFromHref(item.href);
            const isActive = sectionId !== null && activeSection === sectionId;
            return (
            <li key={item.label}>
              <LinkCharShift
                href={item.href}
                className={navLinkClass(isActive)}
                aria-current={isActive ? "true" : undefined}
              >
                {item.label}
              </LinkCharShift>
            </li>
            );
          })}
        </ul>

        {/* Mobile: logo left, hamburger right */}
        <div className="md:hidden flex items-center justify-between w-full">
          <a href="/" aria-label="Lumetic home">
            <Image
              src="/Lumetic logo black no text.png"
              alt="Lumetic"
              width={32}
              height={32}
              priority
              className="w-8 h-8"
            />
          </a>
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 -mr-2 text-foreground/60 transition-colors hover:text-foreground"
            aria-label="Open menu"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: MOTION_EASE_SWIFT }}
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            className="fixed inset-0 z-[100] flex flex-col bg-background px-5 py-4 sm:px-8 sm:py-5"
          >
            <div className="flex items-center justify-between mb-10 sm:mb-16">
              <Image
                src="/Lumetic logo black no text.png"
                alt="Lumetic"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <button
                onClick={() => setMenuOpen(false)}
                className="text-foreground/60 transition-colors hover:text-foreground"
                aria-label="Close menu"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <ul className="flex flex-col gap-8">
              {[...navLeft, ...navRight].map((item, i) => {
                const sectionId = sectionIdFromHref(item.href);
                const isActive = sectionId !== null && activeSection === sectionId;
                return (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={motionTransition(MOTION_DURATION.fast, MOTION_EASE_SWIFT, i * 0.06)}
                >
                  <LinkCharShift
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={mobileNavLinkClass(isActive)}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {item.label}
                  </LinkCharShift>
                </motion.li>
                );
              })}
            </ul>

            <div className="mt-auto">
              <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                © 2026 Lumetic
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
