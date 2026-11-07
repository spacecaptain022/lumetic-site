"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Arrow } from "@/components/ui/BlockLink";

const STYLES = [
  { id: "ink", label: "Ink", swatch: "bg-ink" },
  { id: "paper", label: "Paper", swatch: "bg-paper ring-1 ring-ink/15" },
  { id: "mauve", label: "Mauve", swatch: "bg-mauve" },
] as const;
type Style = (typeof STYLES)[number]["id"];

/** Mosaic columns, coarse to sharp (0). Same rhythm as the image reveals across the site. */
const STEPS = [4, 6, 9, 14, 22, 34, 54, 86, 0];
const STEP_MS = 130;
const PLACEHOLDER = "Your brand";

const inputCls =
  "h-12 w-full rounded-[10px] border border-transparent bg-card px-4 text-[1rem] outline-none transition-colors duration-200 placeholder:text-ink/45 hover:bg-white focus:border-ink focus:bg-white";

const imageUrl = (name: string, style: Style) =>
  `/api/resolve/image?name=${encodeURIComponent(name)}&style=${style}`;

export default function ResolveTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [name, setName] = useState("");
  const [style, setStyle] = useState<Style>("ink");
  const [resolved, setResolved] = useState<{ name: string; style: Style } | null>(null);
  const [phase, setPhase] = useState<"idle" | "loading" | "resolving" | "done">("idle");
  const [email, setEmail] = useState("");
  const [send, setSend] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  /** Draws the image at `cols` square cells across, or sharp when cols is 0. */
  const draw = useCallback((img: HTMLImageElement, cols: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth * dpr;
    const h = canvas.clientHeight * dpr;
    canvas.width = w;
    canvas.height = h;
    if (!cols) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w, h);
      return;
    }
    const rows = Math.round((cols * img.naturalHeight) / img.naturalWidth);
    const small = document.createElement("canvas");
    small.width = cols;
    small.height = rows;
    small.getContext("2d")?.drawImage(img, 0, 0, cols, rows);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(small, 0, 0, w, h);
  }, []);

  /** Loads the rendered image, then steps it from noise to clarity. */
  const run = useCallback(
    (target: string, targetStyle: Style, animate: boolean) => {
      window.clearInterval(timer.current);
      const img = new Image();
      img.onload = () => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!animate) {
          draw(img, 8);
          setPhase("idle");
          return;
        }
        if (reduced) {
          draw(img, 0);
          setPhase("done");
          return;
        }
        setPhase("resolving");
        let step = 0;
        draw(img, STEPS[0]);
        timer.current = window.setInterval(() => {
          step += 1;
          draw(img, STEPS[step]);
          if (step >= STEPS.length - 1) {
            window.clearInterval(timer.current);
            setPhase("done");
          }
        }, STEP_MS);
      };
      img.onerror = () => {
        setPhase("idle");
        setError("That name didn't render. Try another.");
      };
      img.src = imageUrl(target, targetStyle);
    },
    [draw]
  );

  // A coarse teaser before anyone types.
  useEffect(() => {
    run(PLACEHOLDER, "ink", false);
    const current = timer;
    return () => window.clearInterval(current.current);
  }, [run]);

  function handleResolve(e: React.FormEvent) {
    e.preventDefault();
    const target = name.trim();
    if (!target) {
      setError("Type your company or project name.");
      return;
    }
    setError("");
    setSend("idle");
    setResolved({ name: target, style });
    setPhase("loading");
    run(target, style, true);
  }

  function pickStyle(next: Style) {
    setStyle(next);
    if (resolved) {
      setResolved({ name: resolved.name, style: next });
      setPhase("loading");
      run(resolved.name, next, true);
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!resolved) return;
    setSend("sending");
    setError("");
    try {
      const res = await fetch("/api/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: resolved.name, style: resolved.style, email }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setSend("sent");
    } catch (err) {
      setSend("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const done = phase === "done" && resolved;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-12">
      <div className="flex flex-col gap-8 lg:col-span-5 lg:col-start-1 lg:row-start-1">
        <div>
          <p className="label-mono mb-6">{"(    RESOLVE YOUR BRAND    )"}</p>
          <h1 className="h-big max-w-[8em]">Your name, out of the noise.</h1>
          <p className="lede mt-6 max-w-[26rem] text-ink/70">
            Type your company or project name and watch it come into focus. Then we&apos;ll send you
            the full-size image.
          </p>
        </div>

        <form onSubmit={handleResolve} noValidate className="flex flex-col gap-5">
          <div>
            <label htmlFor="resolve-name" className="label mb-2 block opacity-70">
              Company or project name
            </label>
            <div className="flex gap-2">
              <input
                id="resolve-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={32}
                autoComplete="organization"
                placeholder="Northwind"
                className={inputCls}
              />
              <button
                type="submit"
                disabled={phase === "loading" || phase === "resolving"}
                className="group inline-flex h-12 shrink-0 items-center gap-3 rounded-[10px] bg-ink pl-4 pr-1.5 text-[0.92rem] font-medium text-paper transition-colors hover:bg-ink/88 disabled:opacity-60"
              >
                Resolve
                <span className="flex h-9 w-9 items-center justify-center rounded-[7px] bg-paper/14 transition-colors group-hover:bg-paper group-hover:text-ink">
                  <Arrow dir="right" />
                </span>
              </button>
            </div>
          </div>

          <fieldset>
            <legend className="label mb-2.5 opacity-70">Style</legend>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => pickStyle(s.id)}
                  aria-pressed={style === s.id}
                  className="flex min-h-10 items-center gap-2.5 rounded-[8px] bg-card px-3.5 py-2 text-[0.9rem] transition-colors hover:bg-white aria-pressed:bg-ink aria-pressed:text-paper"
                >
                  <span aria-hidden className={`h-3.5 w-3.5 rounded-[3px] ${s.swatch}`} />
                  {s.label}
                </button>
              ))}
            </div>
          </fieldset>
        </form>
      </div>

      {/* Phones see the image before the email card; desktop keeps the card under the form. */}
      <div className="flex flex-col gap-8 lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-start">
        {done && (
          <div className="rounded-[16px] bg-card p-5 md:p-6">
            {send === "sent" ? (
              <div role="status">
                <p className="label mb-3 opacity-60">Sent</p>
                <p className="text-[1.25rem] font-semibold leading-snug tracking-[-0.02em]">
                  Check your inbox for {resolved.name}.
                </p>
                <p className="mt-2 text-[0.95rem] text-ink/70">
                  If it isn&apos;t there in a minute, look in promotions or spam.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSend} noValidate className="flex flex-col gap-4">
                <div>
                  <p className="text-[1.25rem] font-semibold leading-snug tracking-[-0.02em]">
                    Get the full-size image.
                  </p>
                  <p className="mt-1.5 text-[0.95rem] text-ink/70">1080 × 1350, ready to post.</p>
                </div>
                <div className="flex gap-2">
                  <label htmlFor="resolve-email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="resolve-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="you@company.com"
                    className={inputCls.replace("bg-card", "bg-paper")}
                  />
                  <button
                    type="submit"
                    disabled={send === "sending"}
                    className="h-12 shrink-0 rounded-[10px] bg-ink px-5 text-[0.92rem] font-medium text-paper transition-colors hover:bg-ink/88 disabled:opacity-60"
                  >
                    {send === "sending" ? "Sending" : "Send it"}
                  </button>
                </div>
                <p className="text-[0.8rem] leading-snug text-ink/55">
                  We&apos;ll email your image and the occasional studio note. Unsubscribe any time.
                </p>
              </form>
            )}
          </div>
        )}

        {error && (
          <p role="alert" className="rounded-[10px] bg-ink px-4 py-3 text-[0.92rem] text-paper">
            {error}
          </p>
        )}
      </div>

      <div className="row-start-2 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
        {/* On desktop the whole 4:5 image fits the screen height, so the name is never below the fold. */}
        <div className="relative mx-auto w-full overflow-hidden rounded-[16px] bg-ink md:rounded-[20px] lg:mr-0 lg:max-w-[calc((100svh-var(--nav-h)-7rem)*0.8)]">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={resolved ? `${resolved.name}, resolved by Lumetic` : "A pixelated preview waiting for a name"}
            className="block aspect-[4/5] w-full"
            style={{ imageRendering: phase === "done" ? "auto" : "pixelated" }}
          />
          {phase === "idle" && !resolved && (
            <span className="label absolute bottom-4 left-4 rounded-[8px] bg-ink/60 px-3 py-2 text-paper backdrop-blur-md">
              Waiting for a name
            </span>
          )}
        </div>
        <p aria-live="polite" className="sr-only">
          {done ? `${resolved.name} resolved.` : ""}
        </p>
      </div>
    </div>
  );
}
