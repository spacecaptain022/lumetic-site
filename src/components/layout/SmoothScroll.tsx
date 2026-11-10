"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { LazyMotion, domAnimation } from "framer-motion";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const firstPath = useRef(true);
  const historyNav = useRef(false);

  useEffect(() => {
    // Back and forward should land where the visitor left off, so those navigations are marked.
    const onPopState = () => {
      historyNav.current = true;
    };
    window.addEventListener("popstate", onPopState);

    // Native scroll on touch devices and for anyone who asked for less motion.
    if (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => window.removeEventListener("popstate", onPopState);
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: true,
    });
    lenisRef.current = lenis;

    // A click on a link to another page stops any glide right away, before the page changes.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link || link.target === "_blank" || link.origin !== location.origin) return;
      if (link.pathname === location.pathname) return;
      lenis.stop();
      lenis.start();
    };
    document.addEventListener("click", onClick, true);

    let frameId = 0;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    return () => {
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onClick, true);
      cancelAnimationFrame(frameId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Every new page opens at the top. Without this, a click made while the page is still gliding
  // from a wheel scroll carries that glide into the next page and opens it partway down.
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    const lenis = lenisRef.current;

    if (historyNav.current) {
      historyNav.current = false;
      // Let the browser restore the old position; just stop any leftover glide.
      lenis?.stop();
      lenis?.start();
      return;
    }

    const hash = window.location.hash.slice(1);
    const target = hash ? document.getElementById(decodeURIComponent(hash)) : null;
    if (!lenis) {
      if (!target) window.scrollTo(0, 0);
      return;
    }
    // Lenis still holds the previous page's height until it re-measures, which would cap a jump
    // to a section further down this page.
    const jump = () => {
      lenis.resize();
      lenis.scrollTo(target ?? 0, { immediate: true, force: true });
    };
    // Once now, then again after Next.js has finished its own scroll handling.
    jump();
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(jump);
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [pathname]);

  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
