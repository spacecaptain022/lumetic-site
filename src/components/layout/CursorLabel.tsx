"use client";

import { useEffect, useRef, useState } from "react";
import { MOTION_EASE_CSS_SWIFT } from "@/lib/motion";

const LABEL_SELECTOR = "[data-cursor-label]";

export default function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const frameRef = useRef(0);
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(LABEL_SELECTOR);
      if (el) {
        setLabel(el.dataset.cursorLabel ?? "");
        setVisible(true);
      }
    };

    const onOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (related?.closest(LABEL_SELECTOR)) return;
      setVisible(false);
    };

    function tick() {
      if (ref.current) {
        ref.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y + 28}px, 0) translate(-50%, 0)`;
      }
      frameRef.current = requestAnimationFrame(tick);
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    frameRef.current = requestAnimationFrame(tick);
    setMounted(true);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  if (!mounted || !label) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9997] whitespace-nowrap rounded-full bg-foreground px-3 py-1.5 font-sans text-[0.62rem] font-medium uppercase tracking-[0.16em] text-background"
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity 220ms ${MOTION_EASE_CSS_SWIFT}`,
        willChange: "transform, opacity",
      }}
    >
      {label}
    </div>
  );
}
