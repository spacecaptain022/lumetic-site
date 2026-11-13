/**
 * Shared by the /pay form (client) and /api/checkout (server).
 * Keys match the `lumetic_service` metadata on the Stripe Products.
 */
export const PAY_SERVICES = [
  { key: "brand", title: "Brand Identity & Strategy" },
  { key: "web", title: "Web Design & E-commerce" },
  { key: "motion", title: "Motion & Visual Content" },
  { key: "systems", title: "Autonomous Systems & Software" },
] as const;

export type PayServiceKey = (typeof PAY_SERVICES)[number]["key"];

export function isPayServiceKey(value: unknown): value is PayServiceKey {
  return PAY_SERVICES.some((s) => s.key === value);
}

/** Dollar limits for a single payment. The floor keeps card-testing bots away. */
export const PAY_MIN_USD = 50;
export const PAY_MAX_USD = 25_000;
export const PAY_PROJECT_MAX_LENGTH = 120;

/** Parses "2,500.00" or "$2500" into whole cents, or null if it isn't a valid amount. */
export function parseUsdToCents(input: string): number | null {
  const cleaned = input.replace(/[$,\s]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  const cents = Math.round(Number(cleaned) * 100);
  return Number.isSafeInteger(cents) ? cents : null;
}
