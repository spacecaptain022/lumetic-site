import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const setupSecret = process.env.TELEGRAM_SETUP_SECRET;
  if (!setupSecret || req.headers.get("authorization") !== `Bearer ${setupSecret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const resendKey = process.env.RESEND_API_KEY?.trim() ?? "";
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET?.trim() ?? "";

  const result: Record<string, unknown> = {
    hasResendKey: Boolean(resendKey),
    resendKeyPrefix: resendKey.slice(0, 8),
    hasResendWebhookSecret: Boolean(webhookSecret),
    receivingListOk: false,
    receivingListError: null as string | null,
    recentHelloInbound: 0,
  };

  if (!resendKey) {
    return NextResponse.json(result);
  }

  const resend = new Resend(resendKey);
  const { data, error } = await resend.emails.receiving.list({ limit: 10 });

  if (error) {
    result.receivingListError = error.message ?? "Failed to list inbound emails.";
    return NextResponse.json(result);
  }

  result.receivingListOk = true;
  result.recentHelloInbound =
    data?.data?.filter((email) =>
      email.to?.some((address) => address.toLowerCase() === "hello@lumetic.io")
    ).length ?? 0;

  return NextResponse.json(result);
}
