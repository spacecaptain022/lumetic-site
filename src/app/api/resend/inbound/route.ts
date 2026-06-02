import { Resend, type EmailReceivedEvent } from "resend";
import { NextRequest, NextResponse } from "next/server";
import {
  formatTelegramInboundNotification,
  resolveClientIdentity,
  shouldIgnoreInboundSender,
} from "@/lib/inbound-email-message";
import { sendTelegramMessage } from "@/lib/telegram";

const INBOUND_TO = ["hello@lumetic.io"];
const RECEIVING_FETCH_ATTEMPTS = 4;
const RECEIVING_FETCH_DELAY_MS = 750;

function isInboundTarget(to: string[]): boolean {
  const normalized = to.map((address) => address.toLowerCase());
  return INBOUND_TO.some((address) => normalized.includes(address));
}

async function fetchReceivingEmail(resend: Resend, emailId: string) {
  let lastError: { message?: string } | null = null;

  for (let attempt = 0; attempt < RECEIVING_FETCH_ATTEMPTS; attempt++) {
    const { data, error } = await resend.emails.receiving.get(emailId);
    if (data) return { data, error: null };

    lastError = error;
    if (attempt < RECEIVING_FETCH_ATTEMPTS - 1) {
      await new Promise((resolve) => setTimeout(resolve, RECEIVING_FETCH_DELAY_MS * (attempt + 1)));
    }
  }

  return { data: null, error: lastError };
}

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET?.trim();
  const resendKey = process.env.RESEND_API_KEY?.trim();

  if (!resendKey) {
    return NextResponse.json({ error: "Resend is not configured." }, { status: 500 });
  }

  const resend = new Resend(resendKey);

  let event: EmailReceivedEvent;

  try {
    if (webhookSecret) {
      event = resend.webhooks.verify({
        payload,
        headers: {
          id: req.headers.get("svix-id") ?? "",
          timestamp: req.headers.get("svix-timestamp") ?? "",
          signature: req.headers.get("svix-signature") ?? "",
        },
        webhookSecret,
      }) as EmailReceivedEvent;
    } else if (process.env.NODE_ENV === "development") {
      event = JSON.parse(payload) as EmailReceivedEvent;
    } else {
      return NextResponse.json({ error: "Webhook secret is not configured." }, { status: 500 });
    }
  } catch (error) {
    console.error("Resend webhook verification failed:", error);
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  if (event.type !== "email.received") {
    return NextResponse.json({ ok: true, skipped: "not email.received" });
  }

  const { from, to, subject, email_id: emailId, attachments } = event.data;

  if (!isInboundTarget(to)) {
    return NextResponse.json({ ok: true, skipped: "not a monitored inbox address" });
  }

  if (shouldIgnoreInboundSender(from)) {
    return NextResponse.json({ ok: true, skipped: "ignored sender" });
  }

  const { data: email, error: fetchError } = await fetchReceivingEmail(resend, emailId);

  let body: string;

  if (fetchError || !email) {
    console.error("Resend inbound fetch error:", fetchError);
    body = [
      "(Email body could not be loaded from Resend.)",
      fetchError?.message ? `Error: ${fetchError.message}` : "",
      "Check the Resend inbox or verify RESEND_API_KEY matches your Resend account.",
    ]
      .filter(Boolean)
      .join("\n");
  } else {
    body = email.text?.trim() || stripHtml(email.html ?? "") || "(empty message)";
  }

  const { email: fromEmail, name: fromName } = resolveClientIdentity(from, body);

  const telegramText = formatTelegramInboundNotification({
    from: fromEmail,
    fromName: fromName,
    subject: email?.subject || subject,
    body,
    attachmentCount: attachments.length,
  });

  const telegram = await sendTelegramMessage(telegramText);

  if (!telegram.ok) {
    console.error("Resend inbound Telegram error:", telegram.error);
    return NextResponse.json({ error: telegram.error }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    telegram: "sent",
    bodyLoaded: Boolean(email),
  });
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}
