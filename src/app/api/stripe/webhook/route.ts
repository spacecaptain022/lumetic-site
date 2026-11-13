import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { escapeHtml } from "@/lib/escape-html";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { describeStripeEvent, formatNoticeText, isHandledStripeEvent, type StripeNotice } from "@/lib/stripe-notify";
import { isTelegramConfigured, sendTelegramMessage } from "@/lib/telegram";

// Signature verification needs the raw body and Node crypto.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NOTIFY_EMAIL = "Lumetic.io@gmail.com";

// Stripe can deliver the same event more than once. There is no database, so this
// best-effort cache only stops duplicates that hit the same warm server instance.
const recentEventIds = new Set<string>();
const MAX_REMEMBERED_EVENTS = 500;

function remember(eventId: string) {
  recentEventIds.add(eventId);
  if (recentEventIds.size > MAX_REMEMBERED_EVENTS) {
    const oldest = recentEventIds.values().next().value;
    if (oldest) recentEventIds.delete(oldest);
  }
}

async function sendEmail(notice: StripeNotice): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) return false;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const rows = notice.rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:12px;color:#999;width:120px;">${escapeHtml(label)}</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;">${escapeHtml(value)}</td></tr>`
    )
    .join("");
  const link = notice.link
    ? `<p style="margin-top:24px;"><a href="${escapeHtml(notice.link.url)}" style="color:#111;">${escapeHtml(notice.link.label)} →</a></p>`
    : "";

  const { error } = await resend.emails.send({
    from: "Lumetic Payments <hello@lumetic.io>",
    to: NOTIFY_EMAIL,
    subject: notice.title,
    text: formatNoticeText(notice),
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111;">
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#999;margin-bottom:24px;">Lumetic: Stripe</p>
        <p style="font-size:18px;margin-bottom:16px;">${escapeHtml(notice.title)}</p>
        <table style="width:100%;border-collapse:collapse;">${rows}</table>
        ${link}
        <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
        <p style="font-size:11px;color:#bbb;">✳ Lumetic Studio · lumetic.io</p>
      </div>
    `,
  });
  if (error) console.error("Stripe webhook email error:", error);
  return !error;
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!isStripeConfigured() || !secret) {
    console.error("Stripe webhook called but STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET is not set.");
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  // Always verify the signature against the untouched raw body before trusting anything.
  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error("Stripe webhook signature check failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (!isHandledStripeEvent(event.type) || recentEventIds.has(event.id)) {
    return NextResponse.json({ received: true });
  }

  const notice = describeStripeEvent(event);
  if (!notice) return NextResponse.json({ received: true });

  const [telegramOk, emailOk] = await Promise.all([
    isTelegramConfigured()
      ? sendTelegramMessage(formatNoticeText(notice)).then((r) => {
          if (!r.ok) console.error("Stripe webhook Telegram error:", r.error);
          return r.ok;
        })
      : Promise.resolve(false),
    sendEmail(notice).catch((err) => {
      console.error("Stripe webhook email error:", err);
      return false;
    }),
  ]);

  // If nothing reached you, return 500 so Stripe retries the event later.
  if (!telegramOk && !emailOk) {
    return NextResponse.json({ error: "No notification channel succeeded." }, { status: 500 });
  }

  remember(event.id);
  return NextResponse.json({ received: true, telegram: telegramOk, email: emailOk });
}
