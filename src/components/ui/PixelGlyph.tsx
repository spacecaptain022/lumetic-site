/** 5×5 pixel glyphs, one per practice. Built from the same squares as the logo. */
const GLYPHS = {
  brand: ["10000", "10000", "10011", "10011", "11111"],
  web: ["11111", "10001", "11111", "10101", "11111"],
  motion: ["00001", "00010", "00101", "01010", "10100"],
  web3: ["00100", "01010", "10101", "01010", "00100"],
  spark: ["00100", "00100", "11011", "00100", "00100"],
  commerce: ["01110", "01010", "11111", "11111", "11111"],
} as const;

export type GlyphName = keyof typeof GLYPHS;

export default function PixelGlyph({ name, className = "h-14 w-14" }: { name: GlyphName; className?: string }) {
  const rows = GLYPHS[name];
  return (
    <svg viewBox="0 0 5 5" className={className} fill="currentColor" aria-hidden shapeRendering="crispEdges">
      {rows.flatMap((row, y) =>
        row.split("").map((cell, x) =>
          cell === "1" ? <rect key={`${x}-${y}`} x={x + 0.06} y={y + 0.06} width={0.88} height={0.88} /> : null
        )
      )}
    </svg>
  );
}
