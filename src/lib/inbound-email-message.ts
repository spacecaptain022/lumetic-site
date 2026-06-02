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

function isPlausibleClientName(name: string): boolean {
  if (!name || name.length < 2 || name.length > 80) return false;
  if (/@/.test(name)) return false;
  if (/^(there|hello|hi|thanks|yes|no|client)$/i.test(name)) return false;
  return true;
}

export function parseEmailAddress(raw: string): { email: string; name: string } {
  const angle = raw.match(/^(.+?)\s*<([^>]+)>$/);
  if (angle) {
    const name = angle[1].replace(/^["']|["']$/g, "").trim();
    return { name: name || "there", email: angle[2].trim() };
  }

  return { name: "there", email: raw.trim() };
}

export function extractClientNameFromEmailBody(body: string): string | null {
  if (!body?.trim()) return null;

  const patterns = [
    /(?:^|\n)(?:>\s*)*Hi\s+([^,\n<]+),/im,
    /Hi\s+([^,\n<]+),[\s\S]{0,240}Lumetic Studio/i,
    /(?:^|\n)Name:\s*(.+)$/im,
  ];

  for (const pattern of patterns) {
    const match = body.match(pattern);
    const candidate = match?.[1]?.trim();
    if (candidate && isPlausibleClientName(candidate)) {
      return candidate;
    }
  }

  return null;
}

export function resolveClientIdentity(fromHeader: string, body?: string): { email: string; name: string } {
  const parsed = parseEmailAddress(fromHeader);

  if (parsed.name !== "there") {
    return parsed;
  }

  const fromBody = body ? extractClientNameFromEmailBody(body) : null;
  if (fromBody) {
    return { email: parsed.email, name: fromBody };
  }

  return parsed;
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

  const clientName = payload.fromName.trim() || "Client";

  return [
    `📨 Client email reply — ${clientName}`,
    "",
    `Name: ${clientName}`,
    `Email: ${payload.from}`,
    `From: ${clientName} <${payload.from}>`,
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
