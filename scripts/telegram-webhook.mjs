/**
 * Registers Telegram webhook → https://lumetic.io/api/telegram/webhook
 * Run locally. Production must have the same TELEGRAM_* env vars in Vercel.
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
const token = env.TELEGRAM_BOT_TOKEN;
const webhookSecret = env.TELEGRAM_WEBHOOK_SECRET;
const siteUrl = (env.NEXT_PUBLIC_SITE_URL ?? "https://lumetic.io").replace(/\/$/, "");
const webhookUrl = `${siteUrl}/api/telegram/webhook`;

if (!token?.includes(":") || !webhookSecret) {
  console.error("Need TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET in .env.local");
  process.exit(1);
}

const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: webhookUrl,
    secret_token: webhookSecret,
    allowed_updates: ["message"],
    drop_pending_updates: false,
  }),
});

const data = await res.json();
console.log(data);

if (!data.ok) {
  process.exit(1);
}

const info = await (await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`)).json();
console.log("\nWebhook URL:", info.result?.url);
console.log("Pending updates:", info.result?.pending_update_count);
console.log(
  "\n⚠️  Add these env vars in Vercel (Production), redeploy, then replies will work on lumetic.io:"
);
console.log("   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, TELEGRAM_ADMIN_IDS,");
console.log("   TELEGRAM_WEBHOOK_SECRET, RESEND_API_KEY");
