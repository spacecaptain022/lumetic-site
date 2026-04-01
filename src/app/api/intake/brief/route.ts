import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

const BRIEF_PROMPT = `Based on the following client intake conversation, generate a comprehensive, well-structured project brief for the Lumetic creative team.

Format the brief with these exact sections using **Section Title** markdown bold for headers:
**Client Overview**
**Project Scope**
**Goals & Success Metrics**
**Target Audience**
**Competitive Landscape**
**Tone & Aesthetic Direction**
**Timeline**
**Budget**
**Constraints & Must-Haves**
**Initial Recommendations**

Be professional, concise, and actionable. Initial Recommendations should include 2–3 strategic suggestions from Lumetic's perspective. If a section has no information, write "Not discussed."`;

export async function POST(req: NextRequest) {
  const { messages, clientName, clientEmail } = await req.json();

  if (!messages || !clientEmail) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const conversationText = messages
    .map((m: { role: string; content: string }) =>
      `${m.role === "user" ? "Client" : "Lumetic"}: ${m.content}`
    )
    .join("\n\n");

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `${BRIEF_PROMPT}\n\n---\n\nINTAKE CONVERSATION:\n\n${conversationText}`,
        },
      ],
    });

    const brief = response.content[0].type === "text" ? response.content[0].text : "";

    // Convert to HTML
    const briefHtml = brief
      .split("\n")
      .map((line) => {
        const boldHeader = line.match(/^\*\*(.+)\*\*$/);
        if (boldHeader) {
          return `<h3 style="font-size:11px;text-transform:uppercase;letter-spacing:0.18em;color:#999;margin:32px 0 10px;font-family:sans-serif;">${boldHeader[1]}</h3>`;
        }
        if (line.startsWith("- ")) {
          return `<p style="font-size:14px;line-height:1.7;color:#333;margin:0 0 6px;padding-left:16px;font-family:sans-serif;">• ${line.slice(2)}</p>`;
        }
        if (line.trim() === "") return "";
        return `<p style="font-size:14px;line-height:1.7;color:#333;margin:0 0 8px;font-family:sans-serif;">${line}</p>`;
      })
      .join("");

    await resend.emails.send({
      from: "Lumetic Intake <hello@lumetic.io>",
      to: "Lumetic.io@gmail.com",
      replyTo: clientEmail,
      subject: `New Client Brief — ${clientName || clientEmail}`,
      html: `
        <div style="font-family:sans-serif;max-width:680px;margin:0 auto;color:#111;padding:40px 0;">
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.18em;color:#999;margin:0 0 6px;">Lumetic — AI Intake Brief</p>
          <p style="font-size:12px;color:#bbb;margin:0 0 32px;">From: ${clientName || "Unknown"} &lt;${clientEmail}&gt;</p>
          <hr style="border:none;border-top:1px solid #eee;margin:0 0 32px;" />
          ${briefHtml}
          <hr style="border:none;border-top:1px solid #eee;margin:40px 0 24px;" />
          <p style="font-size:11px;color:#bbb;margin:0;">✳ Lumetic Studio — lumetic.io</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Brief error:", err);
    return NextResponse.json({ error: "Failed to generate brief." }, { status: 500 });
  }
}
