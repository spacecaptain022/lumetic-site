"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE =
  "a, button, [role='button'], input, textarea, select, label, summary, [data-cursor='pointer']";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const trail = useRef({ x: -100, y: -100 });
  const frameRef = useRef<number>(0);
  const [hovering, setHovering] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);
    const onDown = () => setPressing(true);
    const onUp = () => setPressing(false);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setHovering(Boolean(el.closest(INTERACTIVE)));
    };
    document.addEventListener("mouseover", onOver);

    function tick() {
      trail.current.x += (mouse.current.x - trail.current.x) * 0.14;
      trail.current.y += (mouse.current.y - trail.current.y) * 0.14;

      const transform = (x: number, y: number) =>
        `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

      if (cursorRef.current) {
        cursorRef.current.style.transform = transform(mouse.current.x, mouse.current.y);
      }
      if (trailRef.current) {
        trailRef.current.style.transform = transform(trail.current.x, trail.current.y);
      }

      frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);

    setMounted(true);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  if (!mounted) return null;
  if (!window.matchMedia("(pointer: fine)").matches) return null;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

  const size = hovering ? 52 : 28;
  const arm = hovering ? 14 : 8;
  const stroke = hovering ? 1.25 : 1;
  const dot = hovering ? 0 : 2;

  const cursorStyle = {
    opacity: hidden ? 0 : 1,
    transition: "opacity 0.25s ease",
    willChange: "transform",
  } as const;

  const contrastFilter =
    "drop-shadow(0 0 1px rgba(255,255,255,0.95)) drop-shadow(0 1px 2px rgba(0,0,0,0.18))";

  return (
    <>
      <div
        ref={trailRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9998]"
        style={cursorStyle}
      >
        <div
          className="rounded-full bg-foreground/10"
          style={{
            width: hovering ? 56 : 36,
            height: hovering ? 56 : 36,
            filter: contrastFilter,
            transition:
              "width 0.35s cubic-bezier(0.22,1,0.36,1), height 0.35s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </div>

      <div
        ref={cursorRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999] text-foreground"
        style={cursorStyle}
      >
        <div
          style={{
            width: size,
            height: size,
            transform: pressing ? "scale(0.9)" : "scale(1)",
            transition:
              "transform 0.15s ease, width 0.35s cubic-bezier(0.22,1,0.36,1), height 0.35s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            fill="none"
            style={{
              filter: contrastFilter,
              transition:
                "width 0.35s cubic-bezier(0.22,1,0.36,1), height 0.35s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <path
              d={`M ${size / 2} ${size / 2 - arm} V ${size / 2 - 3}
                 M ${size / 2} ${size / 2 + 3} V ${size / 2 + arm}
                 M ${size / 2 - arm} ${size / 2} H ${size / 2 - 3}
                 M ${size / 2 + 3} ${size / 2} H ${size / 2 + arm}`}
              stroke="currentColor"
              strokeWidth={stroke}
              strokeLinecap="round"
              style={{
                transition: "stroke-width 0.35s cubic-bezier(0.22,1,0.36,1)",
              }}
            />
            {dot > 0 && (
              <circle cx={size / 2} cy={size / 2} r={dot / 2} fill="currentColor" />
            )}
          </svg>
        </div>
      </div>
    </>
  );
}
