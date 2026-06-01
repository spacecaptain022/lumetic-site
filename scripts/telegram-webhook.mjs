/**
 * Registers the Telegram webhook on your live site.
 * Requires TELEGRAM_* vars in .env.local and deployed /api/telegram/webhook.
 *
 * Usage: npm run telegram:webhook
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
const siteUrl = (env.NEXT_PUBLIC_SITE_URL ?? "https://lumetic.io").replace(/\/$/, "");
const setupSecret = env.TELEGRAM_SETUP_SECRET;

if (!setupSecret) {
  console.error("Missing TELEGRAM_SETUP_SECRET in .env.local");
  process.exit(1);
}

const res = await fetch(`${siteUrl}/api/telegram/setup`, {
  method: "POST",
  headers: { Authorization: `Bearer ${setupSecret}` },
});

const data = await res.json().catch(() => ({}));
console.log(res.status, data);

if (!res.ok) {
  console.error("\nDeploy the site first, then add Telegram env vars in Vercel.");
  process.exit(1);
}

console.log("\nWebhook active. Reply to inquiry messages in your Telegram group to email clients.");
