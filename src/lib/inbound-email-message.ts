const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const IGNORE_FROM = [
  /hello@lumetic\.io/i,
  /lumetic\.io@gmail\.com/i,
  /mailer-daemon/i,
  /noreply/i,
  /no-reply/i,
];

export type InboundEmailPayload = {
  from: string;
  fromName: string;
  subject: string;
  body: string;
  attachmentCount: number;
};

export function parseEmailAddress(raw: string): { email: string; name: string } {
  const angle = raw.match(/^(.+?)\s*<([^>]+)>$/);
  if (angle) {
    const name = angle[1].replace(/^["']|["']$/g, "").trim();
    return { name: name || "there", email: angle[2].trim() };
  }

  return { name: "there", email: raw.trim() };
}

export function shouldIgnoreInboundSender(from: string): boolean {
  const { email } = parseEmailAddress(from);
  return IGNORE_FROM.some((pattern) => pattern.test(email));
}

export function formatTelegramInboundNotification(payload: InboundEmailPayload): string {
  const maxBody = 3500;
  let body = payload.body.trim() || "(empty message)";
  if (body.length > maxBody) {
    body = `${body.slice(0, maxBody)}\n\n… (truncated)`;
  }

  const attachmentNote =
    payload.attachmentCount > 0
      ? `\nAttachments: ${payload.attachmentCount} (view in Resend inbox)\n`
      : "";

  return [
    "📨 Client email reply",
    "",
    `From: ${payload.fromName} <${payload.from}>`,
    `Email: ${payload.from}`,
    `Subject: ${payload.subject.trim() || "(no subject)"}`,
    attachmentNote,
    "Message:",
    body,
    "",
    "↩️ Reply to this message (thread) and your text will be emailed to them.",
  ].join("\n");
}

export function parseClientFromNotification(text: string): { email: string; name: string } | null {
  const emailLine = text.match(/^Email:\s*(.+)$/m)?.[1]?.trim();
  const fromLine = text.match(/^From:\s*(.+)$/m)?.[1]?.trim();
  const nameLine = text.match(/^Name:\s*(.+)$/m)?.[1]?.trim();

  let email: string | undefined;
  let name: string | undefined;

  if (emailLine && emailRe.test(emailLine)) {
    email = emailLine;
    name = nameLine;
  } else if (fromLine) {
    const parsed = parseEmailAddress(fromLine);
    email = parsed.email;
    name = parsed.name !== "there" ? parsed.name : nameLine;
  }

  if (!email || !emailRe.test(email)) return null;

  return {
    email,
    name: name?.trim() || "there",
  };
}
