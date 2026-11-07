type TelegramSendMessageResult = {
  ok: boolean;
  result?: { message_id: number };
  description?: string;
};

function getTelegramConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return null;

  return { token, chatId };
}

export function getTelegramAdminIds(): string[] {
  return (
    process.env.TELEGRAM_ADMIN_IDS?.split(",")
      .map((id) => id.trim())
      .filter(Boolean) ?? []
  );
}

export function isTelegramConfigured(): boolean {
  return Boolean(getTelegramConfig() && getTelegramAdminIds().length > 0);
}

type InlineKeyboard = { inline_keyboard: { text: string; callback_data: string }[][] };

export async function sendTelegramMessage(
  text: string,
  chatId?: string,
  options: { replyMarkup?: InlineKeyboard; replyToMessageId?: number } = {}
): Promise<{ ok: true; messageId: number } | { ok: false; error: string }> {
  const config = getTelegramConfig();
  if (!config) {
    return { ok: false, error: "Telegram is not configured." };
  }

  const targetChatId = chatId ?? config.chatId;

  const response = await fetch(`https://api.telegram.org/bot${config.token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: targetChatId,
      text,
      disable_web_page_preview: true,
      ...(options.replyMarkup ? { reply_markup: options.replyMarkup } : {}),
      ...(options.replyToMessageId
        ? { reply_parameters: { message_id: options.replyToMessageId, allow_sending_without_reply: true } }
        : {}),
    }),
  });

  const data = (await response.json()) as TelegramSendMessageResult;

  if (!response.ok || !data.ok || !data.result?.message_id) {
    return { ok: false, error: data.description ?? "Failed to send Telegram message." };
  }

  return { ok: true, messageId: data.result.message_id };
}

async function callTelegram(method: string, body: Record<string, unknown>): Promise<{ ok: boolean; description?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { ok: false, description: "TELEGRAM_BOT_TOKEN is not set." };
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await response.json()) as { ok: boolean; description?: string };
}

/** Stops the loading spinner on a tapped inline button, optionally with a short toast. */
export async function answerTelegramCallback(callbackQueryId: string, text?: string) {
  return callTelegram("answerCallbackQuery", { callback_query_id: callbackQueryId, ...(text ? { text } : {}) });
}

/**
 * Removes a message's inline buttons. Telegram rejects the edit when the buttons are already
 * gone, so only the first of two quick taps gets ok: true. That makes it a cheap send-once lock.
 */
export async function removeTelegramButtons(chatId: string, messageId: number) {
  return callTelegram("editMessageReplyMarkup", {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: { inline_keyboard: [] },
  });
}

export async function registerTelegramWebhook(webhookUrl: string, secretToken: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return { ok: false as const, error: "TELEGRAM_BOT_TOKEN is not set." };
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: secretToken,
      allowed_updates: ["message", "callback_query"],
    }),
  });

  const data = (await response.json()) as { ok: boolean; description?: string };
  if (!response.ok || !data.ok) {
    return { ok: false as const, error: data.description ?? "Failed to register webhook." };
  }

  return { ok: true as const };
}
