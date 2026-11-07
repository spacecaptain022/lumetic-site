import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/*
 * "Resolve your brand": a visitor's company name, pulled out of a field of pixel noise.
 * Rendered on the server so the preview on the page and the file in their inbox are the same image.
 */

export const RESOLVE_SIZE = { width: 1080, height: 1350 } as const;
export const RESOLVE_STYLES = ["ink", "paper", "mauve"] as const;
export type ResolveStyle = (typeof RESOLVE_STYLES)[number];

const PALETTES: Record<ResolveStyle, { bg: string; fg: string; noise: string[]; accent: string; wordmark: "paper" | "ink" }> = {
  ink: { bg: "#0a0a0a", fg: "#f5f4f0", noise: ["245,244,240"], accent: "#d595af", wordmark: "paper" },
  paper: { bg: "#f5f4f0", fg: "#0a0a0a", noise: ["10,10,10"], accent: "#d595af", wordmark: "ink" },
  mauve: { bg: "#d595af", fg: "#0a0a0a", noise: ["10,10,10", "245,244,240"], accent: "#f5f4f0", wordmark: "ink" },
};

/** Trims, collapses spaces, drops control characters and caps the length. Empty means invalid. */
export function cleanResolveName(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const name = raw
    .normalize("NFKC")
    .replace(/[\p{C}]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 32)
    .trim();
  return /[\p{L}\p{N}]/u.test(name) ? name : "";
}

export function parseResolveStyle(raw: unknown): ResolveStyle {
  return RESOLVE_STYLES.includes(raw as ResolveStyle) ? (raw as ResolveStyle) : "ink";
}

/** Same name, same noise: a tiny seeded PRNG keeps every render of a name identical. */
function seededRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

/** Fits the name to the frame: short names go huge, long names wrap to two lines. */
function nameFontSize(name: string) {
  const longestWord = Math.max(...name.split(" ").map((w) => w.length));
  const lineChars = name.length <= 12 ? name.length : Math.max(longestWord, Math.ceil(name.length / 2));
  return Math.round(Math.min(300, Math.max(88, 936 / (Math.max(lineChars, 3) * 0.6))));
}

let assets: Promise<{ inter: Buffer; instrument: Buffer; wordmarks: Record<"paper" | "ink", string> }> | null = null;

function loadAssets() {
  assets ??= (async () => {
    const dir = join(process.cwd(), "src/assets");
    const [inter, instrument, paper, ink] = await Promise.all([
      readFile(join(dir, "fonts/Inter-Bold.ttf")),
      readFile(join(dir, "fonts/InstrumentSans-Medium.ttf")),
      readFile(join(dir, "brand/wordmark-paper.png")),
      readFile(join(dir, "brand/wordmark-ink.png")),
    ]);
    const png = (b: Buffer) => `data:image/png;base64,${b.toString("base64")}`;
    return { inter, instrument, wordmarks: { paper: png(paper), ink: png(ink) } };
  })();
  return assets;
}

const COLS = 12;
const ROWS = 8;

export async function renderResolvedImage(name: string, style: ResolveStyle, init?: ResponseInit) {
  const { inter, instrument, wordmarks } = await loadAssets();
  const p = PALETTES[style];
  const random = seededRandom(`${name.toLowerCase()}|${style}`);

  // Noise thins out row by row as it falls toward the name: noise above, clarity below.
  const cells = Array.from({ length: COLS * ROWS }, (_, i) => {
    const row = Math.floor(i / COLS);
    const density = 0.92 - (row / ROWS) * 0.78;
    if (random() > density) return null;
    if (random() < 0.06) return p.accent;
    const rgb = p.noise[Math.floor(random() * p.noise.length)];
    return `rgba(${rgb},${(0.08 + random() * 0.55).toFixed(2)})`;
  });

  const label = { fontFamily: "Instrument", fontSize: 22, letterSpacing: "0.03em", textTransform: "uppercase" as const };
  const cell = 72;
  const gap = 6;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: 72, background: p.bg, color: p.fg }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", ...label }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
          <img src={wordmarks[p.wordmark]} width={182} height={34} alt="" />
          <span>( Resolved )</span>
          <span>lumetic.io</span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap, marginTop: 64, width: COLS * cell + (COLS - 1) * gap }}>
          {cells.map((color, i) => (
            <div key={i} style={{ width: cell, height: cell, borderRadius: 6, background: color ?? "transparent" }} />
          ))}
        </div>

        <div style={{ display: "flex", flex: 1 }} />

        <div style={{ display: "flex", fontFamily: "Inter", fontSize: nameFontSize(name), lineHeight: 0.92, letterSpacing: "-0.045em" }}>
          {name}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, opacity: 0.62, ...label }}>
          <span>Out of the noise</span>
          <span>Resolved by Lumetic</span>
        </div>
      </div>
    ),
    {
      ...RESOLVE_SIZE,
      fonts: [
        { name: "Inter", data: inter, weight: 700, style: "normal" },
        { name: "Instrument", data: instrument, weight: 500, style: "normal" },
      ],
      ...init,
    }
  );
}
