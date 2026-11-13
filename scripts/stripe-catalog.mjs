#!/usr/bin/env node
/**
 * Creates (or updates) one Stripe Product per Lumetic service line.
 * Products carry no fixed price: each invoice sets its own amount with price_data.
 *
 *   npm run stripe:catalog            # uses STRIPE_SECRET_KEY from .env.local (sandbox)
 *   npm run stripe:catalog -- --live  # required before it will touch a live key
 *
 * Safe to re-run: products are matched by metadata.lumetic_service.
 * Tax codes are left unset on purpose; set them once you've confirmed the right codes.
 */
import Stripe from "stripe";

const SERVICES = [
  {
    key: "brand",
    name: "Brand Identity & Strategy",
    description: "Brand strategy, identity systems and guidelines.",
  },
  {
    key: "web",
    name: "Web Design & E-commerce",
    description: "Headless websites and online stores, designed and built.",
  },
  {
    key: "motion",
    name: "Motion & Visual Content",
    description: "Motion design, video and visual content.",
  },
  {
    key: "systems",
    name: "Autonomous Systems & Software",
    description: "Agents, automations and software that keep the business running.",
  },
];

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("STRIPE_SECRET_KEY is not set. Run with: npm run stripe:catalog");
  process.exit(1);
}
const isLive = /^(sk|rk)_live_/.test(key);
if (isLive && !process.argv.includes("--live")) {
  console.error("This is a LIVE key. Re-run with --live if you really mean to change the live catalog.");
  process.exit(1);
}

const stripe = new Stripe(key, { apiVersion: "2026-09-30.endive" });

const existing = new Map();
for await (const product of stripe.products.list({ limit: 100 })) {
  const service = product.metadata?.lumetic_service;
  if (service) existing.set(service, product);
}

console.log(`Stripe catalog (${isLive ? "LIVE" : "sandbox/test"})`);
for (const service of SERVICES) {
  const fields = {
    name: service.name,
    description: service.description,
    active: true,
    metadata: { lumetic_service: service.key },
  };
  const found = existing.get(service.key);
  const product = found
    ? await stripe.products.update(found.id, fields)
    : await stripe.products.create(fields);
  console.log(`  ${found ? "updated" : "created"}  ${service.key.padEnd(8)} ${product.id}  ${product.name}`);
}
