/**
 * Check production Resend inbound config (requires TELEGRAM_SETUP_SECRET in .env.local).
 *
 * Usage: npm run resend:health
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

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
const setupSecret = env.TELEGRAM_SETUP_SECRET;
const siteUrl = (env.NEXT_PUBLIC_SITE_URL ?? "https://www.lumetic.io")
  .replace(/\/$/, "")
  .replace(/^https:\/\/lumetic\.io/, "https://www.lumetic.io");

if (!setupSecret) {
  console.error("Need TELEGRAM_SETUP_SECRET in .env.local");
  process.exit(1);
}

const res = await fetch(`${siteUrl}/api/resend/health`, {
  headers: { Authorization: `Bearer ${setupSecret}` },
});

const data = await res.json();
console.log(JSON.stringify(data, null, 2));

if (!res.ok) process.exit(1);

if (!data.receivingListOk) {
  console.error("\n⚠️  Production RESEND_API_KEY cannot read inbound emails.");
  console.error("   Copy RESEND_API_KEY from .env.local into Vercel exactly, then redeploy.");
  process.exit(1);
}
