import { Resend } from "resend";
import { after, NextRequest, NextResponse } from "next/server";
import { BRIEF_FIELDS, cleanBrief, formatBriefText, parseDockMessages } from "@/lib/dock-brief";
import { escapeHtml } from "@/lib/escape-html";
import { isFirstReplyConfigured, postFirstReplyDraft } from "@/lib/first-reply";
import { formatTelegramInquiryNotification } from "@/lib/inquiry-message";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { isTelegramConfigured, sendTelegramMessage } from "@/lib/telegram";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Sends a brief from the project dock to the studio: an email, a Telegram inquiry, and the
 * usual drafted first reply under it. Same path as the contact form, so replies work the same way.
 */
export async function POST(req: NextRequest) {
  if (!checkRateLimit(`dock-brief:${getClientIp(req)}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many submissions. Try again in a few minutes." }, { status: 429 });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const conversation = parseDockMessages(
    Array.isArray(body.messages) && (body.messages as { role?: string }[]).at(-1)?.role === "assistant"
      ? (body.messages as unknown[]).slice(0, -1)
      : body.messages
  );
  const brief = cleanBrief(body.brief);

  if (!name) return NextResponse.json({ error: "Add your name." }, { status: 400 });
  if (!emailRe.test(email)) return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
  if (!conversation) return NextResponse.json({ error: "Tell the assistant about your project first." }, { status: 400 });

  const briefText = formatBriefText(brief, conversation);
  const service = brief.engagement || "Not sure yet";

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const rows = BRIEF_FIELDS.filter((f) => brief[f.key])
      .map(
        (f) =>
          `<tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:12px;color:#999;width:130px;">${f.label}</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;">${escapeHtml(brief[f.key])}</td></tr>`
      )
      .join("");
    const said = conversation
      .filter((m) => m.role === "user")
      .map((m) => `<p style="font-size:14px;line-height:1.6;margin:0 0 10px;">${escapeHtml(m.content)}</p>`)
      .join("");

    const { error } = await new Resend(resendKey).emails.send({
      from: "Lumetic Contact <hello@lumetic.io>",
      to: "Lumetic.io@gmail.com",
      replyTo: email,
      subject: `New brief from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSource: project dock\n\n${briefText}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111;">
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#999;margin-bottom:24px;">Lumetic: New brief from the project dock</p>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:12px;color:#999;width:130px;">Name</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:12px;color:#999;">Email</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;"><a href="mailto:${escapeHtml(email)}" style="color:#111;">${escapeHtml(email)}</a></td></tr>
            ${rows}
          </table>
          <p style="font-size:12px;color:#999;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.1em;">In their words</p>
          ${said}
        </div>
      `,
    });
    if (error) {
      console.error("Dock brief email error:", error);
      return NextResponse.json({ error: "We couldn't send it. Try again, or email hello@lumetic.io." }, { status: 500 });
    }
  }

  if (isTelegramConfigured()) {
    const inquiry = { name, email, service, message: `(via the project dock)\n\n${briefText}` };
    const sent = await sendTelegramMessage(formatTelegramInquiryNotification(inquiry));
    if (sent.ok && isFirstReplyConfigured()) {
      after(() => postFirstReplyDraft(inquiry, sent.messageId));
    }
  } else if (!resendKey) {
    return NextResponse.json({ error: "Sending isn't set up right now. Email hello@lumetic.io." }, { status: 503 });
  }

  return NextResponse.json({ success: true });
}
