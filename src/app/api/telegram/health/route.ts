import { NextRequest, NextResponse } from "next/server";
import { isTelegramConfigured } from "@/lib/telegram";

export async function GET(req: NextRequest) {
  const setupSecret = process.env.TELEGRAM_SETUP_SECRET;
  if (!setupSecret || req.headers.get("authorization") !== `Bearer ${setupSecret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const chatId = process.env.TELEGRAM_CHAT_ID ?? "";

  return NextResponse.json({
    configured: isTelegramConfigured(),
    hasToken: Boolean(process.env.TELEGRAM_BOT_TOKEN?.includes(":")),
    hasChatId: Boolean(chatId.trim()),
    chatIdIsGroup: chatId.startsWith("-100"),
    hasAdminIds: Boolean(process.env.TELEGRAM_ADMIN_IDS?.trim()),
    hasWebhookSecret: Boolean(process.env.TELEGRAM_WEBHOOK_SECRET?.trim()),
    hasResend: Boolean(process.env.RESEND_API_KEY?.trim()),
  });
}
