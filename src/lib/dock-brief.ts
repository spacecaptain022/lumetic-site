import Anthropic from "@anthropic-ai/sdk";
import { ENGAGEMENTS } from "@/data/studio";
import { featuredProjects } from "@/data/featuredProjects";
import { BRIEF_FIELDS, EMPTY_BRIEF, type DockBrief, type DockMessage, type DockTurn } from "@/lib/dock-shared";
import { withoutEmDashes } from "@/lib/no-em-dash";

/*
 * The project dock's assistant: a short, human intake conversation that fills in a brief as it goes.
 * Each turn returns the next reply plus the brief so far, so the page can show it taking shape.
 */

const MODEL = "claude-opus-5-5";

export { BRIEF_FIELDS, EMPTY_BRIEF } from "@/lib/dock-shared";
export type { BriefKey, DockBrief, DockMessage, DockTurn } from "@/lib/dock-shared";

const ENGAGEMENT_NAMES = ENGAGEMENTS.map((e) => e.title);

const SYSTEM_PROMPT = `You are the Lumetic Assistant on lumetic.io, chatting with someone who opened "Start a project". Lumetic is a small branding studio. Your job is a short, friendly conversation that leaves the studio with a useful brief, so the team can reply personally within one business day.

What Lumetic does:
${featuredProjects.map((s) => `- ${s.title}: ${s.excerpt}`).join("\n")}

How clients work with Lumetic:
${ENGAGEMENTS.map((e) => `- ${e.title} (${e.timing}): ${e.description}`).join("\n")}

How to talk:
- Like a sharp, warm person at the studio. React to what they actually said before asking the next thing, so it never feels like a form.
- One question per message, two or three sentences at most. Plain text, no lists, no emoji, no em dashes.
- Aim for three to five exchanges. Cover what they are building, what they need from us, who it is for, and their timing. Reference brands or budget only if they offer them.
- If they ask a question, answer it briefly from the facts above, then keep going. Never quote prices or promise dates beyond the engagement timings above.
- If you are unsure which engagement fits, ask the one question that would decide it.
- E-commerce runs through everything Lumetic does: the store, packaging, product imagery and launch content come from the same team as the brand. If they sell products, learn what they sell and where (their own store, Shopify, marketplaces), and note it in the brief.
- Lumetic also builds AI systems and custom software (agents, automations, internal tools, integrations) and keeps them running on the Build & Run engagement. If that is what they want, learn what the system should do, who uses it, and what tools or data it has to connect to, and note it in the brief.
- You are an assistant, not a person: never claim to be on the team or to have done the work yourself. Don't ask for their name or email; the page collects those.

The brief: after every message, return the brief so far. Write each field in a few plain words from what they told you, and leave it as an empty string until you actually know it. "engagement" is one of ${ENGAGEMENT_NAMES.map((n) => `"${n}"`).join(", ")}, or empty while unclear.

Set "ready" to true once you know the project, what they need and roughly when. In that message, tell them in one line which engagement fits and why, and that they can send the brief below so the studio replies within a business day. Keep chatting naturally if they continue.

If the visitor is clearly not here about a project (spam, a sales pitch, a job application), politely point them to hello@lumetic.io and keep "ready" false.`;

const OUTPUT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["reply", "brief", "ready"],
  properties: {
    reply: { type: "string", description: "Your next message to the visitor." },
    ready: { type: "boolean" },
    brief: {
      type: "object",
      additionalProperties: false,
      required: BRIEF_FIELDS.map((f) => f.key),
      properties: Object.fromEntries(BRIEF_FIELDS.map((f) => [f.key, { type: "string" }])),
    },
  },
} as const;

/** Validates what the browser sends: alternating turns, user first and last, bounded size. */
export function parseDockMessages(raw: unknown): DockMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 30) return null;
  const messages: DockMessage[] = [];
  for (const [i, m] of raw.entries()) {
    const role = i % 2 === 0 ? "user" : "assistant";
    if (!m || typeof m !== "object" || (m as DockMessage).role !== role) return null;
    const content = (m as DockMessage).content;
    if (typeof content !== "string" || !content.trim() || content.length > 2000) return null;
    messages.push({ role, content: content.trim() });
  }
  return messages[messages.length - 1].role === "user" ? messages : null;
}

export function cleanBrief(raw: unknown): DockBrief {
  const brief = { ...EMPTY_BRIEF };
  if (raw && typeof raw === "object") {
    for (const { key } of BRIEF_FIELDS) {
      const value = (raw as Record<string, unknown>)[key];
      if (typeof value === "string") brief[key] = withoutEmDashes(value.trim()).slice(0, 200);
    }
  }
  if (brief.engagement && !ENGAGEMENT_NAMES.includes(brief.engagement as (typeof ENGAGEMENT_NAMES)[number])) {
    brief.engagement = "";
  }
  return brief;
}

export async function nextDockTurn(messages: DockMessage[], context: string): Promise<DockTurn> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const system = context
    ? `${SYSTEM_PROMPT}\n\nWhere they opened the assistant: ${context.slice(0, 200)}. Use it only if it helps.`
    : SYSTEM_PROMPT;

  const params = {
    model: MODEL,
    max_tokens: 3000,
    // Chat should feel quick: low effort keeps replies snappy without losing judgment.
    output_config: { effort: "low" as const, format: { type: "json_schema" as const, schema: OUTPUT_SCHEMA } },
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system,
    messages,
  };

  // `fallbacks` is newer than the installed SDK's types; the SDK sends the body as given.
  const response = await client.beta.messages.create(
    params as unknown as Anthropic.Beta.MessageCreateParamsNonStreaming
  );

  if (response.stop_reason === "refusal") {
    return {
      reply: "I can't help with that one here, but the studio can. Write to hello@lumetic.io.",
      brief: { ...EMPTY_BRIEF },
      ready: false,
    };
  }

  const text = response.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
  const parsed = JSON.parse(text) as { reply?: unknown; brief?: unknown; ready?: unknown };
  return {
    reply: withoutEmDashes(String(parsed.reply ?? "").trim()) || "Tell me a bit more about what you're building?",
    brief: cleanBrief(parsed.brief),
    ready: parsed.ready === true,
  };
}

/** Plain-text brief for the studio's email and Telegram. */
export function formatBriefText(brief: DockBrief, messages: DockMessage[]): string {
  const fields = BRIEF_FIELDS.filter((f) => brief[f.key]).map((f) => `${f.label}: ${brief[f.key]}`);
  const said = messages.filter((m) => m.role === "user").map((m) => `• ${m.content}`);
  return [...fields, "", "In their words:", ...said].join("\n").slice(0, 3500);
}
