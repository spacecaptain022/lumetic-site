import Stripe from "stripe";

/**
 * Server-only Stripe client. Never import this from a client component:
 * it reads STRIPE_SECRET_KEY, which must stay on the server.
 *
 * Locally the key comes from .env.local (a sandbox key). In production it is a
 * live restricted key (rk_live_) stored as a sensitive Vercel environment variable.
 */
export const STRIPE_API_VERSION = "2026-09-30.endive" as const;

let client: Stripe | null = null;

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set.");
  if (!client) {
    client = new Stripe(key, {
      apiVersion: STRIPE_API_VERSION,
      appInfo: { name: "lumetic-site", url: "https://lumetic.io" },
    });
  }
  return client;
}

/** Formats a Stripe amount in minor units, e.g. 250000 usd -> "$2,500.00". */
export function formatStripeAmount(amount: number, currency: string): string {
  const upper = currency.toUpperCase();
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: upper }).format(amount / 100);
  } catch {
    return `${(amount / 100).toFixed(2)} ${upper}`;
  }
}
