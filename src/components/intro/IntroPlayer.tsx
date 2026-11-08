"use client";

import { useEffect, useRef, useState } from "react";
import { MARK_HEIGHT, MARK_PATHS, MARK_WIDTH } from "@/components/ui/Mark";
import { markIntroDone } from "@/lib/intro";
import { INTRO_SEEN_KEY } from "@/lib/intro-gate";

/** Mosaic columns across the mark, coarse to sharp (0): the same rhythm as the site's image reveals. */
const STEPS = [3, 4, 6, 9, 14, 22, 34, 56, 0];
const LEAD_MS = 260; // the coarsest frame holds a beat before it starts to resolve
const STEP_MS = 115;
const HOLD_MS = 560; // the sharp mark, before the hand-off
const EXIT_MS = 820; // matches the .intro exit transition in globals.css
const HANDOFF_MS = 240; // into the exit, when the hero starts its entrance
const LATE_MS = 4500; // if the page took this long to come alive, skip the intro
const RESOLVE_END = LEAD_MS + STEPS.length * STEP_MS;

const PAPER = "245 244 240";

/** The mark's height in CSS pixels. */
const markHeight = () => Math.min(window.innerHeight * 0.28, window.innerWidth * 0.4);

/** Rasterises the mark once, then makes an area-averaged mosaic for each step. */
async function buildMosaics(): Promise<{ sharp: HTMLCanvasElement; steps: Map<number, HTMLCanvasElement> }> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK_WIDTH} ${MARK_HEIGHT}" width="${MARK_WIDTH}" height="${MARK_HEIGHT}" fill="rgb(${PAPER})">${MARK_PATHS.map((d) => `<path fill-rule="evenodd" d="${d}"/>`).join("")}</svg>`;
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  await img.decode();

  const sharp = document.createElement("canvas");
  sharp.width = 686;
  sharp.height = Math.round((686 * MARK_HEIGHT) / MARK_WIDTH);
  sharp.getContext("2d")?.drawImage(img, 0, 0, sharp.width, sharp.height);

  const steps = new Map<number, HTMLCanvasElement>();
  for (const cols of STEPS.filter(Boolean)) {
    const rows = Math.max(1, Math.round((cols * MARK_HEIGHT) / MARK_WIDTH));
    // Halve repeatedly so every cell is a true average, not a lucky sample.
    let src: HTMLCanvasElement = sharp;
    while (src.width / 2 > cols) {
      const half = document.createElement("canvas");
      half.width = Math.max(cols, Math.round(src.width / 2));
      half.height = Math.max(rows, Math.round(src.height / 2));
      half.getContext("2d")?.drawImage(src, 0, 0, half.width, half.height);
      src = half;
    }
    const out = document.createElement("canvas");
    out.width = cols;
    out.height = rows;
    out.getContext("2d")?.drawImage(src, 0, 0, cols, rows);
    steps.set(cols, out);
  }
  return { sharp, steps };
}

/**
 * Lumetic, out of the noise: the mark alone on ink, resolving from coarse pixels to sharp,
 * then the screen settles into the hero's frame. Plays once per session, on the home page.
 */
export default function IntroPlayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"play" | "exit" | "gone">("play");

  useEffect(() => {
    const root = document.documentElement;
    // Opened in a background tab, or slow to come alive: go straight to the page.
    if (root.dataset.intro !== "play" || document.visibilityState === "hidden" || performance.now() > LATE_MS) {
      // CSS hides the overlay once the gate says skip; nothing else to do.
      root.dataset.intro = "skip";
      markIntroDone();
      return;
    }

    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {}
    root.style.overflow = "hidden";

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let frame = 0;
    let exiting = false;
    const timers: number[] = [];

    const exit = () => {
      if (exiting) return;
      exiting = true;
      cancelAnimationFrame(frame);
      setPhase("exit");
      timers.push(window.setTimeout(markIntroDone, HANDOFF_MS));
      timers.push(
        window.setTimeout(() => {
          root.style.overflow = "";
          setPhase("gone");
        }, EXIT_MS)
      );
    };

    // Any input skips straight to the hand-off.
    const skip = () => exit();
    const events = ["pointerdown", "keydown", "wheel", "touchmove"] as const;
    events.forEach((e) => window.addEventListener(e, skip, { passive: true }));

    if (!canvas || !ctx) {
      exit();
    } else {
      let lastStep = -1;

      buildMosaics()
        .then(({ sharp, steps }) => {
          if (exiting) return;
          const start = performance.now();

          const render = (now: number) => {
            const t = Math.max(0, now - start);
            const step = Math.min(STEPS.length - 1, Math.max(0, Math.floor((t - LEAD_MS) / STEP_MS)));
            if (t >= RESOLVE_END + HOLD_MS) {
              exit();
              return;
            }
            // Only redraw when the mark changes step.
            if (step === lastStep) {
              frame = requestAnimationFrame(render);
              return;
            }
            lastStep = step;

            const dpr = Math.min(2, window.devicePixelRatio || 1);
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            if (canvas.width !== Math.round(vw * dpr) || canvas.height !== Math.round(vh * dpr)) {
              canvas.width = Math.round(vw * dpr);
              canvas.height = Math.round(vh * dpr);
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, vw, vh);

            const h = markHeight();
            const w = (h * MARK_WIDTH) / MARK_HEIGHT;
            const x0 = (vw - w) / 2;
            const y0 = (vh - h) / 2;

            // The mark: a mosaic at this step, or sharp on the last.
            const mosaic = STEPS[step] ? steps.get(STEPS[step]) : undefined;
            ctx.imageSmoothingEnabled = !mosaic;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(mosaic ?? sharp, x0, y0, w, h);

            frame = requestAnimationFrame(render);
          };
          frame = requestAnimationFrame(render);
        })
        .catch(exit);
    }

    return () => {
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
      events.forEach((e) => window.removeEventListener(e, skip));
      root.style.overflow = "";
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div className="intro" data-phase={phase} aria-hidden data-lenis-prevent>
      <div className="intro-content">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      </div>
    </div>
  );
}
