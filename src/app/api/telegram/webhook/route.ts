import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { buildClientReplyEmail, parseDraftFromTelegram, SEND_DRAFT_CALLBACK } from "@/lib/first-reply";
import { parseClientFromNotification } from "@/lib/inbound-email-message";
import {
  answerTelegramCallback,
  getTelegramAdminIds,
  removeTelegramButtons,
  sendTelegramMessage,
} from "@/lib/telegram";

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
  callback_query?: {
    id: string;
    data?: string;
    from: { id: number };
    message?: { message_id: number; text?: string; chat: { id: number } };
  };
};

type Client = { name: string; email: string };

/** Emails a reply to the client from hello@lumetic.io. Returns an error message, or null when sent. */
async function emailClient(client: Client, body: string, system: boolean): Promise<string | null> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return "Email is not configured on the server, so the reply was not sent.";

  const { error } = await new Resend(resendKey).emails.send({
    from: "Lumetic <hello@lumetic.io>",
    to: client.email,
    replyTo: "hello@lumetic.io",
    ...buildClientReplyEmail({ name: client.name, body, system }),
  });

  if (error) {
    console.error("Telegram reply email error:", error);
    return `Failed to email ${client.email}. Check server logs and try again.`;
  }
  return null;
}

function clientLabel(client: Client) {
  return client.name !== "there" ? `${client.name} · ${client.email}` : client.email;
}

/** The ✶ Send button under a drafted first reply. */
async function handleSendDraft(query: NonNullable<TelegramUpdate["callback_query"]>) {
  const message = query.message;
  if (!message?.text) {
    await answerTelegramCallback(query.id, "That draft is no longer available.");
    return;
  }
  const chatId = String(message.chat.id);

  if (!getTelegramAdminIds().includes(String(query.from.id))) {
    await answerTelegramCallback(query.id, "Only Lumetic admins can send replies.");
    return;
  }

  const client = parseClientFromNotification(message.text);
  const draft = parseDraftFromTelegram(message.text);
  if (!client || !draft) {
    await answerTelegramCallback(query.id, "Could not read the client or the draft from this message.");
    return;
  }

  // Taking the button away first means a double tap cannot send twice.
  const lock = await removeTelegramButtons(chatId, message.message_id);
  if (!lock.ok) {
    await answerTelegramCallback(query.id, "Already sent.");
    return;
  }

  const error = await emailClient(client, draft, true);
  if (error) {
    await answerTelegramCallback(query.id, "Send failed.");
    await sendTelegramMessage(`${error} Reply to the draft with the text to retry.`, chatId, {
      replyToMessageId: message.message_id,
    });
    return;
  }

  await answerTelegramCallback(query.id, "Sent.");
  await sendTelegramMessage(`✅ Sent to ${clientLabel(client)}`, chatId, { replyToMessageId: message.message_id });
}

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

  if (update.callback_query) {
    if (update.callback_query.data === SEND_DRAFT_CALLBACK) {
      await handleSendDraft(update.callback_query);
    } else {
      await answerTelegramCallback(update.callback_query.id);
    }
    return NextResponse.json({ ok: true });
  }

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

  const replyBody = message.text.trim();
  const error = await emailClient(inquiry, replyBody, false);
  if (error) {
    await sendTelegramMessage(error, String(message.chat.id));
    return NextResponse.json({ ok: true });
  }

  await sendTelegramMessage(
    [`✅ Sent to ${clientLabel(inquiry)}`, "", replyBody].join("\n"),
    String(message.chat.id)
  );

  return NextResponse.json({ ok: true });
}
