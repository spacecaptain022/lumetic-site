/**
 * Local dev: poll Telegram for replies and forward to your local webhook.
 * Run alongside `npm run dev`. Do not use while production webhook is active.
 *
 * Usage: npm run telegram:poll
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
const secret = env.TELEGRAM_WEBHOOK_SECRET;
const localWebhook = "http://localhost:3000/api/telegram/webhook";

if (!token?.includes(":") || !secret) {
  console.error("Need TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET in .env.local");
  process.exit(1);
}

await fetch(`https://api.telegram.org/bot${token}/deleteWebhook`);
console.log("Webhook cleared for local polling.");
console.log("Reply to a 📩 inquiry in Telegram. Ctrl+C to stop.\n");

let offset = 0;

while (true) {
  const url = new URL(`https://api.telegram.org/bot${token}/getUpdates`);
  url.searchParams.set("timeout", "30");
  url.searchParams.set("offset", String(offset));

  const data = await (await fetch(url)).json();
  if (!data.ok) {
    console.error(data.description);
    process.exit(1);
  }

  for (const update of data.result ?? []) {
    offset = update.update_id + 1;
    const msg = update.message;
    if (!msg?.reply_to_message?.text || !msg.text) continue;

    const res = await fetch(localWebhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-telegram-bot-api-secret-token": secret,
      },
      body: JSON.stringify(update),
    });

    console.log(
      res.ok ? `Processed reply: ${msg.text.slice(0, 60)}…` : `Webhook error ${res.status}`
    );
  }
}
