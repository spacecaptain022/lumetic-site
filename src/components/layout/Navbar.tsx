"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";
import Image from "next/image";

const navLeft = [
  { label: "X", href: "https://x.com/LUMETICio" },
  { label: "Services", href: "/#services" },
];
const navRight = [
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [inverted, setInverted] = useState(false);

  useEffect(() => {
    const ventures = document.getElementById("ventures");
    if (!ventures) return;

    // Fires when the ventures section occupies the navbar strip (top ~72px)
    const observer = new IntersectionObserver(
      ([entry]) => setInverted(entry.isIntersecting),
      { rootMargin: "-0px 0px -92% 0px" }
    );
    observer.observe(ventures);
    return () => observer.disconnect();
  }, []);

  const navBg = inverted ? "bg-foreground/80" : "bg-background/60";
  const navBorder = inverted ? "border-background/10" : "border-foreground/[0.06]";
  const linkColor = inverted
    ? "text-background/60 hover:text-background"
    : "text-foreground/50 hover:text-foreground";
  const logoInvert = inverted;

  return (
    <>
      {/* Desktop nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center px-5 py-4 md:px-12 md:py-5 backdrop-blur-sm border-b transition-colors duration-500 ${navBg} ${navBorder}`}>
        {/* Left links */}
        <ul className="hidden md:flex items-center gap-10 flex-1">
          {navLeft.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={`text-[10px] uppercase tracking-[0.2em] font-sans font-medium transition-colors duration-500 ${linkColor}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Center — logo mark only (desktop), truly centered */}
        <a href="/" className="hidden md:flex justify-center select-none flex-shrink-0" aria-label="Lumetic home">
          <Image
            src="/Lumetic logo black no text.png"
            alt="Lumetic"
            width={36}
            height={36}
            priority
            className={`w-8 h-8 md:w-9 md:h-9 transition-all duration-500 ${logoInvert ? "invert" : ""}`}
          />
        </a>

        {/* Right links */}
        <ul className="hidden md:flex items-center justify-end gap-10 flex-1">
          {navRight.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={`text-[10px] uppercase tracking-[0.2em] font-sans font-medium transition-colors duration-500 ${linkColor}`}
              >
                {item.label}
              </a>
            </li>
          ))}
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
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
              {[...navLeft, ...navRight].map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3, ease: "easeOut" }}
                >
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-3xl font-display tracking-wider text-foreground transition-colors hover:text-foreground/65 sm:text-4xl"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
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
