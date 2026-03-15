"use client";

import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const frameRef = useRef<number>(0);
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    // Track hover state on interactive elements
    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a, button, [role='button'], input, textarea, select, label")) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };
    document.addEventListener("mouseover", onOver);

    function tick() {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.1;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.1;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`;
      }

      frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);

    setMounted(true);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  // Never render on server; hide on touch devices
  if (!mounted || !window.matchMedia("(pointer: fine)").matches) return null;

  return (
    <>
      {/* Dot — snaps instantly */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{
          width: hovering ? 6 : 5,
          height: hovering ? 6 : 5,
          borderRadius: "50%",
          background: "#fff",
          mixBlendMode: "difference",
          opacity: hidden ? 0 : 1,
          transition: "width 0.2s, height 0.2s, opacity 0.2s",
          willChange: "transform",
        }}
      />

      {/* Ring — lags behind */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{
          width: hovering ? 44 : 32,
          height: hovering ? 44 : 32,
          borderRadius: "50%",
          border: "1px solid #fff",
          mixBlendMode: "difference",
          opacity: hidden ? 0 : 1,
          transition: "width 0.25s cubic-bezier(0.22,1,0.36,1), height 0.25s cubic-bezier(0.22,1,0.36,1), opacity 0.2s",
          willChange: "transform",
        }}
      />
    </>
  );
}
