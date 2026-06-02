/**
 * Registers Resend webhook → https://www.lumetic.io/api/resend/inbound
 * Run locally. Add RESEND_WEBHOOK_SECRET to Vercel after creating the webhook.
 *
 * Usage: npm run resend:webhook
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");

function loadEnv() {
  const env = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    env[t.slice(0, i)] = t.slice(i + 1);
  }
  return env;
}

const env = loadEnv();
const resendKey = env.RESEND_API_KEY;
// Use www — bare lumetic.io 307-redirects and Resend treats that as webhook failure
const siteUrl = (env.NEXT_PUBLIC_SITE_URL ?? "https://www.lumetic.io")
  .replace(/\/$/, "")
  .replace(/^https:\/\/lumetic\.io/, "https://www.lumetic.io");
const endpoint = `${siteUrl}/api/resend/inbound`;

if (!resendKey?.startsWith("re_")) {
  console.error("Need RESEND_API_KEY in .env.local");
  process.exit(1);
}

const resend = new Resend(resendKey);

const { data, error } = await resend.webhooks.create({
  endpoint,
  events: ["email.received"],
});

if (error) {
  console.error("Failed to create webhook:", error);
  process.exit(1);
}

console.log("Webhook created:");
console.log("  id:", data.id);
console.log("  endpoint:", endpoint);
console.log("\nAdd to .env.local and Vercel (Production):");
console.log(`  RESEND_WEBHOOK_SECRET=${data.signing_secret}`);
console.log("\nAlso enable inbound email for lumetic.io in Resend → Domains → Receiving (MX records).");
console.log("Redeploy Vercel after adding RESEND_WEBHOOK_SECRET.");
