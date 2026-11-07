import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { escapeHtml } from "@/lib/escape-html";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { cleanResolveName, parseResolveStyle, renderResolvedImage } from "@/lib/resolve-image";
import { isTelegramConfigured, sendTelegramMessage } from "@/lib/telegram";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Emails a visitor their resolved image and adds them to the Lumetic list.
 * The image is rendered here from the name alone, so this can't be used to mail arbitrary content.
 */
export async function POST(req: NextRequest) {
  if (!checkRateLimit(`resolve:${getClientIp(req)}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests. Try again in a few minutes." }, { status: 429 });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = cleanResolveName(body.name);
  const style = parseResolveStyle(body.style);
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!name) return NextResponse.json({ error: "Add your company name first." }, { status: 400 });
  if (!emailRe.test(email)) return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return NextResponse.json({ error: "Email isn't set up right now." }, { status: 500 });
  const resend = new Resend(resendKey);

  const png = Buffer.from(await (await renderResolvedImage(name, style)).arrayBuffer());
  const filename = `${name.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").toLowerCase() || "brand"}-resolved.png`;
  const safeName = escapeHtml(name);

  const { error } = await resend.emails.send({
    from: "Lumetic <hello@lumetic.io>",
    to: email,
    replyTo: "hello@lumetic.io",
    subject: `${name}, out of the noise`,
    attachments: [
      { filename, content: png, contentType: "image/png" },
      { filename: "resolved.png", content: png, contentType: "image/png", contentId: "resolved" },
    ],
    text: [
      `Here's ${name}, resolved. The full-size image is attached (1080 × 1350, made for Instagram).`,
      "",
      `If ${name} could use more than a pixel effect, a whole identity that stays this clear everywhere, just reply to this email and tell us what you're building.`,
      "",
      "Lumetic Studio",
      "lumetic.io",
      "",
      "You're getting this because you asked for your image on lumetic.io. We send occasional studio notes; reply \"unsubscribe\" any time to stop them.",
    ].join("\n"),
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;max-width:560px;color:#111;font-size:15px;line-height:1.6;">
        <p style="margin:0 0 16px;">Here's ${safeName}, resolved. The full-size image is attached (1080 × 1350, made for Instagram).</p>
        <img src="cid:resolved" alt="${safeName}, resolved by Lumetic" width="360" style="display:block;width:360px;max-width:100%;border-radius:12px;margin:0 0 20px;" />
        <p style="margin:0 0 20px;">If ${safeName} could use more than a pixel effect, a whole identity that stays this clear everywhere, just reply to this email and tell us what you're building.</p>
        <p style="margin:0;">Lumetic Studio<br /><a href="https://www.lumetic.io" style="color:#111;">lumetic.io</a></p>
        <p style="font-size:11px;color:#999;margin:28px 0 0;">You're getting this because you asked for your image on lumetic.io. We send occasional studio notes; reply "unsubscribe" any time to stop them.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resolve email error:", error);
    return NextResponse.json({ error: "We couldn't send it. Try again in a minute." }, { status: 500 });
  }

  // Add them to the list. RESEND_RESOLVE_SEGMENT_ID files them under a segment when set.
  const segment = process.env.RESEND_RESOLVE_SEGMENT_ID;
  const contact = await resend.contacts.create({ email, ...(segment ? { segments: [{ id: segment }] } : {}) });
  if (contact.error && !/already exists/i.test(contact.error.message)) {
    console.error("Resolve contact error:", contact.error);
  }

  if (isTelegramConfigured()) {
    await sendTelegramMessage(
      [`✶ Brand resolved: ${name}`, "", `Company: ${name}`, `Email: ${email}`, `Style: ${style}`, "", "↩️ Reply to this message to email them."].join("\n")
    );
  }

  return NextResponse.json({ success: true });
}
