/**
 * Process queued Telegram replies once (local dev server required).
 * Use when you replied but didn't run telegram:poll.
 *
 * Usage: npm run dev   (terminal 1)
 *        npm run telegram:catchup   (terminal 2)
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
const webhook = "http://localhost:3000/api/telegram/webhook";

if (!token?.includes(":") || !secret) {
  console.error("Need TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET");
  process.exit(1);
}

await fetch(`https://api.telegram.org/bot${token}/deleteWebhook`);

const updates = await (
  await fetch(`https://api.telegram.org/bot${token}/getUpdates`)
).json();

if (!updates.ok) {
  console.error(updates.description);
  process.exit(1);
}

let processed = 0;

for (const update of updates.result ?? []) {
  const msg = update.message;
  if (!msg?.reply_to_message?.text || !msg.text) continue;

  const res = await fetch(webhook, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-telegram-bot-api-secret-token": secret,
    },
    body: JSON.stringify(update),
  });

  if (res.ok) {
    processed++;
    console.log(`✓ Emailed reply: ${msg.text.slice(0, 50)}…`);
  } else {
    const body = await res.text();
    console.log(`✗ Failed (${res.status}): ${body.slice(0, 120)}`);
    console.log("   Is npm run dev running on port 3000?");
    process.exit(1);
  }
}

console.log(`\nDone. Processed ${processed} reply(s).`);
console.log("Re-register production webhook: npm run telegram:webhook");
