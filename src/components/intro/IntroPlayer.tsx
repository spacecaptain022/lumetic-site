"use client";

import { useEffect, useRef, useState } from "react";
import { MARK_HEIGHT, MARK_PATHS, MARK_WIDTH } from "@/components/ui/Mark";
import { markIntroDone } from "@/lib/intro";
import { INTRO_SEEN_KEY } from "@/lib/intro-gate";

/** Mosaic columns across the mark, coarse to sharp (0): the same rhythm as the site's image reveals. */
const STEPS = [3, 4, 6, 9, 14, 22, 34, 56, 0];
const LEAD_MS = 260; // noise alone before the mark starts to resolve
const STEP_MS = 115;
const HOLD_MS = 560; // the sharp mark, before the hand-off
const EXIT_MS = 820; // matches the .intro exit transition in globals.css
const HANDOFF_MS = 240; // into the exit, when the hero starts its entrance
const LATE_MS = 4500; // if the page took this long to come alive, skip the intro
const RESOLVE_END = LEAD_MS + STEPS.length * STEP_MS;
const WORDS = ["Clarity.", "Over.", "Noise."];

const PAPER = "245 244 240";
const MAUVE = "213 149 175";

/** Matches .intro-words' position in globals.css: the mark's height in CSS pixels. */
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
 * Lumetic, out of the noise: the mark resolves from coarse pixels while the static around it
 * clears, then the screen settles into the hero's frame. Plays once per session, on the home page.
 */
export default function IntroPlayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const wordsRef = useRef<HTMLParagraphElement>(null);
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
      if (counterRef.current) counterRef.current.textContent = "100";
      wordsRef.current?.querySelectorAll("span").forEach((w) => w.setAttribute("data-lit", ""));
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
      let lastNoise = -Infinity;
      let lastStep = -1;

      buildMosaics()
        .then(({ sharp, steps }) => {
          if (exiting) return;
          const start = performance.now();

          const render = (now: number) => {
            const t = Math.max(0, now - start);
            const step = Math.min(STEPS.length - 1, Math.max(0, Math.floor((t - LEAD_MS) / STEP_MS)));
            // Static flickers on its own clock; the mark changes on each step.
            if (step === lastStep && now - lastNoise < 70) {
              frame = requestAnimationFrame(render);
              return;
            }
            lastStep = step;
            lastNoise = now;

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
            const y0 = vh * 0.46 - h / 2;

            // Noise on the same grid as the mark's current pixels, thinning out as it sharpens.
            const cols = STEPS[step] || STEPS[STEPS.length - 2];
            const cell = w / cols;
            const clarity = t < LEAD_MS ? 0 : step / (STEPS.length - 1);
            const density = 0.14 * Math.pow(1 - clarity, 1.6);
            if (density > 0.002) {
              const inset = cell * 0.08;
              const gx = x0 - Math.ceil(x0 / cell) * cell;
              const gy = y0 - Math.ceil(y0 / cell) * cell;
              for (let y = gy; y < vh; y += cell) {
                for (let x = gx; x < vw; x += cell) {
                  if (Math.random() > density) continue;
                  // Keep the mark, the words under it and the corner labels clean.
                  if (x > x0 - w * 0.25 - cell && x < x0 + w * 1.25 && y > y0 - cell && y < y0 + h + 64) continue;
                  if ((y < 64 || y > vh - 64 - cell) && (x < 200 || x > vw - 200 - cell)) continue;
                  const mauve = Math.random() < 0.12;
                  ctx.fillStyle = mauve
                    ? `rgb(${MAUVE} / ${0.35 + Math.random() * 0.35})`
                    : `rgb(${PAPER} / ${0.04 + Math.random() * 0.14})`;
                  ctx.fillRect(x + inset, y + inset, cell - inset * 2, cell - inset * 2);
                }
              }
            }

            // The mark: a mosaic at this step, or sharp on the last.
            if (t >= LEAD_MS * 0.5) {
              const mosaic = STEPS[step] ? steps.get(STEPS[step]) : undefined;
              ctx.imageSmoothingEnabled = !mosaic;
              ctx.imageSmoothingQuality = "high";
              ctx.drawImage(mosaic ?? sharp, x0, y0, w, h);
            }

            const progress = Math.min(1, t / (RESOLVE_END + HOLD_MS * 0.5));
            if (counterRef.current) counterRef.current.textContent = String(Math.round(progress * 100)).padStart(3, "0");
            wordsRef.current?.querySelectorAll("span").forEach((word, i) => {
              if (progress >= (i + 1) / (WORDS.length + 1)) word.setAttribute("data-lit", "");
            });

            if (t >= RESOLVE_END + HOLD_MS) {
              exit();
              return;
            }
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

        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-5 text-paper/60 md:px-8 md:pt-7">
          <span className="label-mono">{"(    LUMETIC    )"}</span>
          <span className="label">Branding studio</span>
        </div>

        <p ref={wordsRef} className="intro-words">
          {WORDS.map((word) => (
            <span key={word}>{word}</span>
          ))}
        </p>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 pb-5 text-paper/60 md:px-8 md:pb-7">
          <span className="label-mono">
            {"(    "}
            <span ref={counterRef}>000</span>
            {"    )"}
          </span>
          <span className="label">USA / Hong Kong</span>
        </div>
      </div>
    </div>
  );
}
