import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email, service, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "Lumetic Contact <hello@lumetic.io>",
    to: "Lumetic.io@gmail.com",
    replyTo: email,
    subject: `New inquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nService: ${service || "Not specified"}\n\n${message}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111;">
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#999;margin-bottom:24px;">Lumetic — New Contact Form Submission</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:12px;color:#999;width:100px;">Name</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;">${name}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:12px;color:#999;">Email</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;"><a href="mailto:${email}" style="color:#111;">${email}</a></td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:12px;color:#999;">Service</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;">${service || "Not specified"}</td></tr>
        </table>
        <p style="font-size:12px;color:#999;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.1em;">Message</p>
        <p style="font-size:14px;line-height:1.7;white-space:pre-wrap;">${message}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
        <p style="font-size:11px;color:#bbb;">✳ Lumetic Studio — lumetic.io</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
