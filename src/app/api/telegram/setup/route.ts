import { NextRequest, NextResponse } from "next/server";
import { isTelegramConfigured, registerTelegramWebhook } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  const setupSecret = process.env.TELEGRAM_SETUP_SECRET;
  if (!setupSecret) {
    return NextResponse.json({ error: "TELEGRAM_SETUP_SECRET is not configured." }, { status: 500 });
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${setupSecret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!isTelegramConfigured()) {
    return NextResponse.json(
      {
        error:
          "Missing TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, or TELEGRAM_ADMIN_IDS.",
      },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "TELEGRAM_WEBHOOK_SECRET is not configured." }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumetic.io";
  const webhookUrl = `${siteUrl.replace(/\/$/, "")}/api/telegram/webhook`;

  const result = await registerTelegramWebhook(webhookUrl, webhookSecret);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    webhookUrl,
    message: "Telegram webhook registered.",
  });
}
