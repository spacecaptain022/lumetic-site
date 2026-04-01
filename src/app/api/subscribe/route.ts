import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string" || !emailRe.test(email.trim())) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

  const clean = email.trim();

  const { error } = await resend.emails.send({
    from: "Lumetic <hello@lumetic.io>",
    to: "Lumetic.io@gmail.com",
    replyTo: clean,
    subject: "New quick contact lead",
    text: `Email: ${clean}\nSource: floating contact bar`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111;">
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#999;margin-bottom:16px;">Lumetic — Quick Contact</p>
        <p style="font-size:14px;"><a href="mailto:${clean}" style="color:#111;">${clean}</a></p>
        <p style="font-size:12px;color:#999;margin-top:24px;">Submitted via site floating bar.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend quick contact error:", error);
    return NextResponse.json({ error: "Could not send. Try again later." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
