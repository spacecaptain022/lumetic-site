export type InquiryPayload = {
  name: string;
  email: string;
  service: string;
  message: string;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function formatTelegramInquiryNotification(inquiry: InquiryPayload): string {
  const service = inquiry.service.trim() || "Not specified";

  return [
    "📩 New Lumetic inquiry",
    "",
    `Name: ${inquiry.name.trim()}`,
    `Email: ${inquiry.email.trim()}`,
    `Service: ${service}`,
    "",
    "Message:",
    inquiry.message.trim(),
    "",
    "↩️ Reply to this message (thread) and your text will be emailed to them.",
  ].join("\n");
}

export function parseInquiryNotification(text: string): Pick<InquiryPayload, "name" | "email"> | null {
  const email = text.match(/^Email:\s*(.+)$/m)?.[1]?.trim();
  const name = text.match(/^Name:\s*(.+)$/m)?.[1]?.trim();

  if (!email || !emailRe.test(email)) return null;

  return {
    email,
    name: name?.trim() || "there",
  };
}
