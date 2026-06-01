import { NextResponse } from "next/server";
import { formatTelegramInquiryNotification } from "@/lib/inquiry-message";
import { isTelegramConfigured, sendTelegramMessage } from "@/lib/telegram";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production." }, { status: 404 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const adminIds = process.env.TELEGRAM_ADMIN_IDS;

  const tokenLooksValid = Boolean(token && /^\d+:[A-Za-z0-9_-]+$/.test(token));
  const chatIdLooksValid = Boolean(chatId && /^-?\d+$/.test(chatId) && !chatId.includes("x"));

  let botUsername: string | null = null;
  let botError: string | null = null;

  if (tokenLooksValid) {
    const meRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const me = (await meRes.json()) as {
      ok: boolean;
      result?: { username?: string };
      description?: string;
    };
    if (me.ok) botUsername = me.result?.username ?? null;
    else botError = me.description ?? "getMe failed";
  }

  if (!isTelegramConfigured()) {
    return NextResponse.json({
      ok: false,
      checks: {
        tokenLooksValid,
        chatIdLooksValid,
        hasAdminIds: Boolean(adminIds?.trim()),
        botUsername,
        botError,
      },
      hint:
        "Set TELEGRAM_BOT_TOKEN=123456789:ABC... (full token from @BotFather), TELEGRAM_CHAT_ID=-100... (from getUpdates), and TELEGRAM_ADMIN_IDS=your user id. Restart npm run dev after changes.",
    });
  }

  const sample = formatTelegramInquiryNotification({
    name: "Test User",
    email: "test@example.com",
    service: "Brand Identity & Strategy",
    message: "This is a test inquiry from /api/telegram/test",
  });

  const result = await sendTelegramMessage(sample);

  return NextResponse.json({
    ok: result.ok,
    checks: {
      tokenLooksValid,
      chatIdLooksValid,
      hasAdminIds: Boolean(adminIds?.trim()),
      botUsername,
      botError,
    },
    telegram: result.ok ? { messageId: result.messageId } : { error: result.error },
  });
}
