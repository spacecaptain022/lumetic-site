import { NextRequest, NextResponse } from "next/server";
import { nextDockTurn, parseDockMessages } from "@/lib/dock-brief";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

/** One turn of the project dock's conversation: the next reply and the brief so far. */
export async function POST(req: NextRequest) {
  if (!checkRateLimit(`dock-chat:${getClientIp(req)}`, 40, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Lots of messages at once. Give it a minute and try again." }, { status: 429 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "The assistant is offline. Use the contact form instead." }, { status: 503 });
  }

  const body = (await req.json().catch(() => ({}))) as { messages?: unknown; context?: unknown };
  const messages = parseDockMessages(body.messages);
  if (!messages) return NextResponse.json({ error: "Invalid conversation." }, { status: 400 });
  const context = typeof body.context === "string" ? body.context : "";

  try {
    return NextResponse.json(await nextDockTurn(messages, context));
  } catch (err) {
    console.error("Dock chat error:", err);
    return NextResponse.json({ error: "Something went wrong. Try again, or use the contact form." }, { status: 500 });
  }
}
