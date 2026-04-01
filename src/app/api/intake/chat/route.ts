import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are Lumetic's client intake assistant. Lumetic is a premium branding studio and capital connector. Your job is to conduct a warm, professional discovery conversation to understand a new client's project needs.

Ask ONE question at a time. Be concise, warm, and premium in tone — like a high-end agency, not a chatbot. Keep responses short.

Collect the following through natural conversation:
1. Client's name and company or project name
2. What they're building, launching, or rebranding
3. Their primary goals — what does success look like?
4. Target audience — who are they trying to reach?
5. 2–3 competitors or brands they admire, and why
6. Tone and aesthetic direction — words, feelings, reference brands
7. Timeline — when do they need this?
8. Budget range (optional — skip if they seem hesitant)
9. Any hard constraints or must-haves

Once you have covered all areas, or the client indicates they have nothing more to add, end your final message with exactly: [READY_TO_BRIEF]

Do not mention [READY_TO_BRIEF] until you are truly done collecting information. Never ask more than one question per message.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  if (!Array.isArray(messages)) {
    return NextResponse.json({ error: "Invalid messages." }, { status: 400 });
  }

  // If no messages yet, start the conversation
  const conversationMessages = messages.length === 0
    ? [{ role: "user" as const, content: "Hello, I'd like to start a project with Lumetic." }]
    : messages;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: conversationMessages,
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const isReady = text.includes("[READY_TO_BRIEF]");
    const cleanText = text.replace("[READY_TO_BRIEF]", "").trim();

    return NextResponse.json({ response: cleanText, isReady });
  } catch (err) {
    console.error("Anthropic error:", err);
    return NextResponse.json({ error: "AI error." }, { status: 500 });
  }
}
