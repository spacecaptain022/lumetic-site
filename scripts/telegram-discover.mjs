/**
 * Discovers Telegram group chat ID from recent bot updates and updates .env.local.
 * Usage: node scripts/telegram-discover.mjs
 * While this runs, send any message in your private group (bot must be a member).
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const envPath = resolve(root, ".env.local");

function loadEnv() {
  const raw = readFileSync(envPath, "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    env[t.slice(0, i)] = t.slice(i + 1);
  }
  return { raw, env };
}

function pickGroupChat(updates) {
  const candidates = [];

  for (const u of updates) {
    const msg = u.message;
    const sources = [
      msg?.chat,
      msg?.sender_chat,
      msg?.forward_from_chat,
      u.my_chat_member?.chat,
      u.chat_member?.chat,
      u.channel_post?.chat,
    ].filter(Boolean);

    for (const chat of sources) {
      const type = chat.type;
      if (type !== "group" && type !== "supergroup") continue;
      candidates.push({
        id: chat.id,
        title: chat.title ?? "Group",
        type,
        date: msg?.date ?? u.my_chat_member?.date ?? 0,
      });
    }
  }

  if (!candidates.length) return null;
  candidates.sort((a, b) => b.date - a.date);
  return candidates[0];
}

function updateEnvChatId(raw, chatId) {
  const line = `TELEGRAM_CHAT_ID=${chatId}`;
  if (/^TELEGRAM_CHAT_ID=.*/m.test(raw)) {
    return raw.replace(/^TELEGRAM_CHAT_ID=.*/m, line);
  }
  return `${raw.trimEnd()}\n${line}\n`;
}

async function getUpdates(token, offset) {
  const url = new URL(`https://api.telegram.org/bot${token}/getUpdates`);
  url.searchParams.set("timeout", "25");
  url.searchParams.set("allowed_updates", JSON.stringify(["message", "my_chat_member", "chat_member"]));
  if (offset) url.searchParams.set("offset", String(offset));

  const res = await fetch(url);
  return res.json();
}

async function sendDm(token, chatId, text) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

async function testGroup(token, chatId) {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: "✅ Lumetic group connected. Contact form inquiries will appear here.",
    }),
  });
  return res.json();
}

async function main() {
  const { raw, env } = loadEnv();
  const token = env.TELEGRAM_BOT_TOKEN;
  const adminId = env.TELEGRAM_ADMIN_IDS?.split(",")[0]?.trim();

  if (!token?.includes(":")) {
    console.error("Missing TELEGRAM_BOT_TOKEN in .env.local");
    process.exit(1);
  }

  await fetch(`https://api.telegram.org/bot${token}/deleteWebhook`);

  if (adminId) {
    await sendDm(
      token,
      adminId,
      "⏳ Linking your Lumetic group…\n\nOption A: Send “connect” in the group (bot must be added).\n\nOption B (easiest): Forward any message FROM your group to this chat."
    );
  }

  console.log("Waiting up to 90s…");
  console.log("→ Forward a message from your group to @lumeticclients_bot");
  console.log("  OR send “connect” in the group (privacy off).\n");

  let offset = 0;
  const deadline = Date.now() + 90_000;

  while (Date.now() < deadline) {
    const data = await getUpdates(token, offset || undefined);

    if (!data.ok) {
      console.error("Telegram error:", data.description);
      process.exit(1);
    }

    for (const u of data.result ?? []) {
      offset = Math.max(offset, u.update_id + 1);
    }

    const group = pickGroupChat(data.result ?? []);
    if (group) {
      writeFileSync(envPath, updateEnvChatId(raw, group.id), "utf8");
      console.log(`Found group: ${group.title} (${group.type})`);
      console.log(`Updated .env.local → TELEGRAM_CHAT_ID=${group.id}`);

      const test = await testGroup(token, group.id);
      if (test.ok) {
        console.log("Test message sent to the group.");
      } else {
        console.warn("Could not post to group:", test.description);
        console.warn("Make the bot an admin in the group, or disable Group Privacy in @BotFather.");
      }

      if (adminId) {
        await sendDm(
          token,
          adminId,
          `✅ Group linked: ${group.title}\nTELEGRAM_CHAT_ID=${group.id}\n\nRestart npm run dev, then test the contact form.`
        );
      }

      process.exit(0);
    }

    process.stdout.write(".");
  }

  console.log("\n\nNo group detected.");
  console.log("1. Add @lumeticclients_bot to your private group");
  console.log("2. In @BotFather: Group Privacy → Turn off");
  console.log("3. Forward any group message to @lumeticclients_bot in DM");
  console.log("   OR send “connect” in the group");
  console.log("4. Run: npm run telegram:discover");
  process.exit(1);
}

main();
