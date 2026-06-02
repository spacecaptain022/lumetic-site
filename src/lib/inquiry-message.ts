export type InquiryPayload = {
  name: string;
  email: string;
  service: string;
  message: string;
};

export { parseClientFromNotification } from "@/lib/inbound-email-message";
import { parseClientFromNotification } from "@/lib/inbound-email-message";

export function formatTelegramInquiryNotification(inquiry: InquiryPayload): string {
  const service = inquiry.service.trim() || "Not specified";

  const clientName = inquiry.name.trim();

  return [
    `📩 New inquiry — ${clientName}`,
    "",
    `Name: ${clientName}`,
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
  return parseClientFromNotification(text);
}
