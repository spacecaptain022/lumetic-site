import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { escapeHtml } from "@/lib/escape-html";
import { formatTelegramInquiryNotification } from "@/lib/inquiry-message";
import { isTelegramConfigured, sendTelegramMessage } from "@/lib/telegram";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { name, email, service, message } = await req.json();

  if (!name || !email || !message || typeof email !== "string" || !emailRe.test(email.trim())) {
    return NextResponse.json({ error: "Missing or invalid required fields." }, { status: 400 });
  }

  const safeName = escapeHtml(String(name));
  const safeEmail = escapeHtml(email.trim());
  const safeService = escapeHtml(String(service || "Not specified"));
  const safeMessage = escapeHtml(String(message));

  const { error } = await resend.emails.send({
    from: "Lumetic Contact <hello@lumetic.io>",
    to: "Lumetic.io@gmail.com",
    replyTo: email.trim(),
    subject: `New inquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nService: ${service || "Not specified"}\n\n${message}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111;">
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#999;margin-bottom:24px;">Lumetic: New Contact Form Submission</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:12px;color:#999;width:100px;">Name</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;">${safeName}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:12px;color:#999;">Email</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;"><a href="mailto:${safeEmail}" style="color:#111;">${safeEmail}</a></td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:12px;color:#999;">Service</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;">${safeService}</td></tr>
        </table>
        <p style="font-size:12px;color:#999;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.1em;">Message</p>
        <p style="font-size:14px;line-height:1.7;white-space:pre-wrap;">${safeMessage}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
        <p style="font-size:11px;color:#bbb;">✳ Lumetic Studio · lumetic.io</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }

  let telegram: "sent" | "skipped" | "failed" = "skipped";
  let telegramError: string | undefined;

  if (isTelegramConfigured()) {
    const telegramResult = await sendTelegramMessage(
      formatTelegramInquiryNotification({
        name: String(name),
        email: email.trim(),
        service: String(service || "Not specified"),
        message: String(message),
      })
    );

    if (telegramResult.ok) {
      telegram = "sent";
    } else {
      telegram = "failed";
      telegramError = telegramResult.error;
      console.error("Telegram notification error:", telegramResult.error);
    }
  }

  const chatId = process.env.TELEGRAM_CHAT_ID ?? "";

  return NextResponse.json({
    success: true,
    telegram,
    ...(telegramError ? { telegramError } : {}),
    ...(telegram === "sent"
      ? {
          telegramTarget: chatId.startsWith("-100")
            ? "group"
            : chatId.startsWith("-")
              ? "group"
              : "direct",
        }
      : {}),
  });
}
