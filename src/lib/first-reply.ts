import Anthropic from "@anthropic-ai/sdk";
import { ENGAGEMENTS } from "@/data/studio";
import { featuredProjects } from "@/data/featuredProjects";
import { escapeHtml } from "@/lib/escape-html";
import { withoutEmDashes } from "@/lib/no-em-dash";
import type { InquiryPayload } from "@/lib/inquiry-message";
import { sendTelegramMessage } from "@/lib/telegram";

/*
 * Instant first reply: when a brief arrives, Claude drafts a tailored reply and posts it to
 * the studio's Telegram with a Send button. Nothing reaches the client until an admin taps it.
 * The Telegram message carries everything the webhook needs, so no storage is involved.
 */

const MODEL = "claude-opus-5-5";

const SYSTEM_PROMPT = `You write the first reply from Lumetic, an autonomous, agentic builder that makes whatever its clients can imagine (brands, websites, software, systems that run on their own), to someone who just sent a project inquiry through lumetic.io. Someone at the studio reads your draft and sends it from their own inbox, so it should read like they sat down and wrote it themselves: a thoughtful studio lead replying personally, not a company sending a template.

What Lumetic does:
${featuredProjects.map((s) => `- ${s.title}: ${s.excerpt}`).join("\n")}

How clients work with Lumetic:
${ENGAGEMENTS.map((e) => `- ${e.title} (${e.timing}): ${e.description}`).join("\n")}

What a good reply does:
- Opens with a genuine, specific reaction to their project, something only their message could prompt. Not a thank-you for reaching out.
- Shows you understood what they need, in your own words rather than repeating theirs back.
- Suggests the way of working that fits and why, woven into the conversation rather than announced. If two could fit, say what would decide it.
- Sketches what you would focus on first, in a sentence or two. Use a short list only if they asked for several distinct things.
- Asks one or two real questions a designer would want answered, the kind that show you are already thinking about their brand.
- Ends with an easy next step, like a quick call, and asks for a couple of times that suit them.

How it should sound:
- Like a person: warm, relaxed, confident, a little conversational. Use "I" naturally, and refer to Lumetic by name instead of "we", "us" or "our".
- Match their tone and length. A two-line note gets a short, friendly reply; a detailed brief earns a fuller one. Stay under 160 words either way.
- Plain sentences in two to four short paragraphs. Vary your openings from one email to the next.
- Avoid stock phrases that make an email feel automated: "Thanks for reaching out", "I hope this finds you well", "We'd love to", "excited to", "elevate", "seamless", "cutting-edge", "take your brand to the next level", "Great question". No em dashes, at most one exclamation mark, no emoji.

Rules: plain text only. No greeting line and no sign-off, because the email template adds "Hi {first name}," and the signature. Never quote prices, discounts or specific calendar dates, never promise anything not described above, and never use the word "AI" or mention that this was drafted.

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

  return { kind: "draft", text: withoutEmDashes(text) };
}

/* ---------- Telegram message ---------- */

const DRAFT_START = "──── draft ────";
const DRAFT_END = "──── end ────";
export const SEND_DRAFT_CALLBACK = "send_first_reply";

export function formatTelegramDraft(inquiry: InquiryPayload, draft: string): string {
  return [
    `✶ First reply drafted: ${inquiry.name.trim()}`,
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

/** Drafts the first reply and posts it under the inquiry in Telegram, with a Send button. */
export async function postFirstReplyDraft(
  inquiry: InquiryPayload,
  inquiryMessageId: number
) {
  try {
    const draft = await draftFirstReply(inquiry);
    if (draft.kind === "skip") {
      await sendTelegramMessage(formatTelegramDraftSkipped(inquiry, draft.reason), undefined, {
        replyToMessageId: inquiryMessageId,
      });
      return;
    }
    await sendTelegramMessage(formatTelegramDraft(inquiry, draft.text), undefined, {
      replyToMessageId: inquiryMessageId,
      replyMarkup: { inline_keyboard: [[{ text: "✶ Send this reply", callback_data: SEND_DRAFT_CALLBACK }]] },
    });
  } catch (err) {
    console.error("First reply draft error:", err);
    await sendTelegramMessage(
      formatTelegramDraftSkipped(inquiry, "drafting failed, see server logs"),
      undefined,
      { replyToMessageId: inquiryMessageId }
    );
  }
}

/* ---------- Client email ---------- */

/** "maya chen" → "Maya", so the greeting reads like a person wrote it. */
export function greetingName(name: string): string {
  const first = name.trim().split(/\s+/)[0]?.replace(/[^\p{L}\p{M}'-]/gu, "") ?? "";
  if (!first || first.toLowerCase() === "there") return "there";
  const oneCase = first === first.toLowerCase() || first === first.toUpperCase();
  return oneCase ? first[0].toUpperCase() + first.slice(1).toLowerCase() : first;
}

/**
 * The email a client receives from the studio, written to look like a personal reply.
 * REPLY_SIGNER_NAME (for example "Preston") signs it from a person; without it, from the studio.
 * `system` adds the quiet mark for replies drafted by the system.
 */
export function buildClientReplyEmail({ name, body, system }: { name: string; body: string; system: boolean }) {
  const greeting = greetingName(name);
  const signer = process.env.REPLY_SIGNER_NAME?.trim();
  const signature = signer ? [signer, "Lumetic Studio · lumetic.io"] : ["Lumetic Studio", "lumetic.io"];
  const mark = "✶ Drafted by the Lumetic system, reviewed and sent by the studio.";

  return {
    subject: "Re: Your inquiry to Lumetic",
    text: [`Hi ${greeting},`, "", body, "", ...signature, ...(system ? ["", mark] : [])].join("\n"),
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;max-width:560px;color:#111;font-size:15px;line-height:1.6;">
        <p style="margin:0 0 16px;">Hi ${escapeHtml(greeting)},</p>
        <p style="margin:0 0 20px;white-space:pre-wrap;">${escapeHtml(body)}</p>
        <p style="margin:0;">${signature.map(escapeHtml).join("<br />")}</p>
        ${system ? `<p style="font-size:11px;color:#aaa;margin:28px 0 0;">${mark}</p>` : ""}
      </div>
    `,
  };
}
