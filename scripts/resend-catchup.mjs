/**
 * Forward missed Resend inbound emails to Telegram.
 * Use when webhooks failed (e.g. before deploy) but emails are in Resend inbox.
 *
 * Usage: npm run resend:catchup
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");
const INBOUND_TO = ["hello@lumetic.io"];
const IGNORE_FROM = [
  /hello@lumetic\.io/i,
  /lumetic\.io@gmail\.com/i,
  /mailer-daemon/i,
  /noreply/i,
  /no-reply/i,
];

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

function parseEmailAddress(raw) {
  const angle = raw.match(/^(.+?)\s*<([^>]+)>$/);
  if (angle) {
    const name = angle[1].replace(/^["']|["']$/g, "").trim();
    return { name: name || "there", email: angle[2].trim() };
  }
  return { name: "there", email: raw.trim() };
}

function shouldIgnore(from) {
  const { email } = parseEmailAddress(from);
  return IGNORE_FROM.some((pattern) => pattern.test(email));
}

function stripHtml(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatNotification({ from, fromName, subject, body, attachmentCount }) {
  const maxBody = 3500;
  let text = body.trim() || "(empty message)";
  if (text.length > maxBody) text = `${text.slice(0, maxBody)}\n\n… (truncated)`;

  const attachmentNote =
    attachmentCount > 0 ? `\nAttachments: ${attachmentCount} (view in Resend inbox)\n` : "";

  return [
    "📨 Client email reply",
    "",
    `From: ${fromName} <${from}>`,
    `Email: ${from}`,
    `Subject: ${subject.trim() || "(no subject)"}`,
    attachmentNote,
    "Message:",
    text,
    "",
    "↩️ Reply to this message (thread) and your text will be emailed to them.",
  ].join("\n");
}

async function sendTelegram(text, token, chatId) {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
  });
  const data = await res.json();
  return data.ok;
}

const env = loadEnv();
const resendKey = env.RESEND_API_KEY;
const token = env.TELEGRAM_BOT_TOKEN;
const chatId = env.TELEGRAM_CHAT_ID;

if (!resendKey?.startsWith("re_") || !token?.includes(":") || !chatId) {
  console.error("Need RESEND_API_KEY, TELEGRAM_BOT_TOKEN, and TELEGRAM_CHAT_ID in .env.local");
  process.exit(1);
}

const resend = new Resend(resendKey);
const { data, error } = await resend.emails.receiving.list();

if (error) {
  console.error("List error:", error);
  process.exit(1);
}

const candidates = (data?.data ?? []).filter((email) => {
  const to = (email.to ?? []).map((address) => address.toLowerCase());
  return INBOUND_TO.some((address) => to.includes(address)) && !shouldIgnore(email.from);
});

if (candidates.length === 0) {
  console.log("No hello@lumetic.io client replies to forward.");
  process.exit(0);
}

console.log(`Found ${candidates.length} inbound email(s) to forward.\n`);

let sent = 0;
for (const summary of candidates) {
  const { data: email, error: fetchError } = await resend.emails.receiving.get(summary.id);
  if (fetchError || !email) {
    console.log(`✗ ${summary.id}: fetch failed`);
    continue;
  }

  const { email: fromEmail, name: fromName } = parseEmailAddress(email.from);
  const body = email.text?.trim() || stripHtml(email.html ?? "") || "(empty message)";
  const text = formatNotification({
    from: fromEmail,
    fromName,
    subject: email.subject ?? summary.subject,
    body,
    attachmentCount: email.attachments?.length ?? 0,
  });

  const ok = await sendTelegram(text, token, chatId);
  if (ok) {
    sent++;
    console.log(`✓ ${fromEmail} — ${email.subject ?? summary.subject}`);
  } else {
    console.log(`✗ Telegram failed for ${fromEmail}`);
  }
}

console.log(`\nDone. Sent ${sent}/${candidates.length} to Telegram.`);
