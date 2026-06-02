import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { parseClientFromNotification } from "@/lib/inbound-email-message";
import { escapeHtml } from "@/lib/escape-html";
import { getTelegramAdminIds, sendTelegramMessage } from "@/lib/telegram";

type TelegramUpdate = {
  message?: {
    message_id: number;
    text?: string;
    chat: { id: number };
    from?: { id: number };
    reply_to_message?: {
      text?: string;
    };
  };
};

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret is not configured." }, { status: 500 });
  }

  const incomingSecret = req.headers.get("x-telegram-bot-api-secret-token");
  if (incomingSecret !== webhookSecret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const update = (await req.json()) as TelegramUpdate;
  const message = update.message;

  if (!message?.text?.trim() || !message.reply_to_message?.text) {
    return NextResponse.json({ ok: true });
  }

  const adminIds = getTelegramAdminIds();
  const senderId = message.from?.id;

  if (!senderId || !adminIds.includes(String(senderId))) {
    await sendTelegramMessage(
      "Only authorized Lumetic admins can reply to client inquiries from this bot.",
      String(message.chat.id)
    );
    return NextResponse.json({ ok: true });
  }

  const inquiry = parseClientFromNotification(message.reply_to_message.text);
  if (!inquiry) {
    await sendTelegramMessage(
      "Could not find a client email on the message you replied to. Reply directly to a Lumetic inquiry or client reply notification.",
      String(message.chat.id)
    );
    return NextResponse.json({ ok: true });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    await sendTelegramMessage(
      "Email is not configured on the server, so the reply was not sent.",
      String(message.chat.id)
    );
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(resendKey);
  const replyBody = message.text.trim();
  const safeName = escapeHtml(inquiry.name);
  const safeReplyBody = escapeHtml(replyBody);

  const { error } = await resend.emails.send({
    from: "Lumetic <hello@lumetic.io>",
    to: inquiry.email,
    replyTo: "hello@lumetic.io",
    subject: "Re: Your inquiry to Lumetic",
    text: [
      `Hi ${inquiry.name},`,
      "",
      replyBody,
      "",
      "—",
      "Lumetic Studio",
      "hello@lumetic.io",
      "lumetic.io",
    ].join("\n"),
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111;">
        <p style="font-size:14px;line-height:1.7;">Hi ${safeName},</p>
        <p style="font-size:14px;line-height:1.7;white-space:pre-wrap;">${safeReplyBody}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:28px 0;" />
        <p style="font-size:13px;color:#666;margin:0;">Lumetic Studio<br />hello@lumetic.io · lumetic.io</p>
      </div>
    `,
  });

  if (error) {
    console.error("Telegram reply email error:", error);
    await sendTelegramMessage(
      `Failed to email ${inquiry.email}. Check server logs and try again.`,
      String(message.chat.id)
    );
    return NextResponse.json({ ok: true });
  }

  const clientLabel =
    inquiry.name !== "there" ? `${inquiry.name} · ${inquiry.email}` : inquiry.email;

  await sendTelegramMessage(
    [`✅ Sent to ${clientLabel}`, "", replyBody].join("\n"),
    String(message.chat.id)
  );

  return NextResponse.json({ ok: true });
}
