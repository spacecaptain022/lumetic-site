import Anthropic from "@anthropic-ai/sdk";
import { ENGAGEMENTS } from "@/data/studio";
import { featuredProjects } from "@/data/featuredProjects";
import { escapeHtml } from "@/lib/escape-html";
import type { InquiryPayload } from "@/lib/inquiry-message";

/*
 * Instant first reply: when a brief arrives, Claude drafts a tailored reply and posts it to
 * the studio's Telegram with a Send button. Nothing reaches the client until an admin taps it.
 * The Telegram message carries everything the webhook needs, so no storage is involved.
 */

const MODEL = "claude-opus-5-5";

const SYSTEM_PROMPT = `You draft the first reply from Lumetic, a branding studio, to someone who just sent a project inquiry through lumetic.io. A person at the studio reads your draft and decides whether to send it, so write the email you would want them to send as-is.

What Lumetic does:
${featuredProjects.map((s) => `- ${s.title}: ${s.excerpt}`).join("\n")}

How clients work with Lumetic:
${ENGAGEMENTS.map((e) => `- ${e.title} (${e.timing}): ${e.description}`).join("\n")}

The reply should:
- Show you read their message: reflect back what they are building and what they need, in a sentence or two, using their specifics.
- Recommend the engagement that fits and say briefly why. If it is genuinely unclear, name the two that could fit and what would decide it.
- Outline a first-pass scope as 3 to 5 short lines starting with "- ", drawn from what they asked for.
- End with one clear next step: ask them to reply with a couple of times for a 20-minute call this week, plus anything they did not cover that you need (for example a launch date or reference brands).

Voice: clear before clever, short and certain, warm without gushing. Plain text, under 180 words. No greeting line and no sign-off, because the email template adds "Hi {name}," and the studio signature. Never quote prices, discounts or specific calendar dates, never promise anything the studio has not offered above, and never claim to be a person or mention that you are an AI.

If the message is spam, a sales pitch to Lumetic, a job application, or has no real project in it, reply with exactly SKIP: followed by a few words on why, and nothing else.`;

export type FirstReplyDraft = { kind: "draft"; text: string } | { kind: "skip"; reason: string };

export function isFirstReplyConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export async function draftFirstReply(inquiry: InquiryPayload): Promise<FirstReplyDraft> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const params = {
    model: MODEL,
    max_tokens: 4000,
    output_config: { effort: "medium" as const },
    // On a policy decline, the API retries on a fallback model it picks by category.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user" as const,
        content: [
          `Name: ${inquiry.name}`,
          `Service they picked: ${inquiry.service || "Not specified"}`,
          "",
          "Their message:",
          inquiry.message,
        ].join("\n"),
      },
    ],
  };

  // `fallbacks` is newer than the installed SDK's types; the SDK sends the body as given.
  const response = await client.beta.messages.create(
    params as unknown as Anthropic.Beta.MessageCreateParamsNonStreaming
  );

  if (response.stop_reason === "refusal") {
    return { kind: "skip", reason: "the model declined to draft this one" };
  }

  const text = response.content
    .flatMap((block) => (block.type === "text" ? [block.text] : []))
    .join("\n")
    .trim();

  if (!text) return { kind: "skip", reason: "the model returned an empty draft" };
  if (text.startsWith("SKIP:")) return { kind: "skip", reason: text.slice(5).trim() || "not a project inquiry" };

  return { kind: "draft", text };
}

/* ---------- Telegram message ---------- */

const DRAFT_START = "──── draft ────";
const DRAFT_END = "──── end ────";
export const SEND_DRAFT_CALLBACK = "send_first_reply";

export function formatTelegramDraft(inquiry: InquiryPayload, draft: string): string {
  return [
    `✶ First reply drafted — ${inquiry.name.trim()}`,
    "",
    `Name: ${inquiry.name.trim()}`,
    `Email: ${inquiry.email.trim()}`,
    "",
    DRAFT_START,
    draft,
    DRAFT_END,
    "",
    "Tap Send to email this now, or reply to this message with your own version.",
  ].join("\n");
}

export function formatTelegramDraftSkipped(inquiry: InquiryPayload, reason: string): string {
  return `✶ No draft for ${inquiry.name.trim()} (${inquiry.email.trim()}): ${reason}. Reply to the inquiry above if it needs an answer.`;
}

export function parseDraftFromTelegram(text: string): string | null {
  const start = text.indexOf(DRAFT_START);
  const end = text.lastIndexOf(DRAFT_END);
  if (start === -1 || end <= start) return null;
  const draft = text.slice(start + DRAFT_START.length, end).trim();
  return draft || null;
}

/* ---------- Client email ---------- */

/** The email a client receives from the studio. `system` adds the quiet mark for system-drafted replies. */
export function buildClientReplyEmail({ name, body, system }: { name: string; body: string; system: boolean }) {
  const safeName = escapeHtml(name);
  const safeBody = escapeHtml(body);
  const mark = "✶ Drafted by the Lumetic system, reviewed and sent by the studio.";

  return {
    subject: "Re: Your inquiry to Lumetic",
    text: [
      `Hi ${name},`,
      "",
      body,
      "",
      "—",
      "Lumetic Studio",
      "hello@lumetic.io",
      "lumetic.io",
      ...(system ? ["", mark] : []),
    ].join("\n"),
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111;">
        <p style="font-size:14px;line-height:1.7;">Hi ${safeName},</p>
        <p style="font-size:14px;line-height:1.7;white-space:pre-wrap;">${safeBody}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:28px 0;" />
        <p style="font-size:13px;color:#666;margin:0;">Lumetic Studio<br />hello@lumetic.io · lumetic.io</p>
        ${system ? `<p style="font-size:11px;color:#aaa;margin:18px 0 0;letter-spacing:0.02em;">${mark}</p>` : ""}
      </div>
    `,
  };
}
