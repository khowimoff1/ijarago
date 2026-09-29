const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export const sendMessage = async (chatId, text, replyMarkup) => {
  const res = await fetch(`${API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, reply_markup: replyMarkup }),
  });
  if (!res.ok) console.error('Telegram sendMessage xatosi:', await res.text().catch(() => res.statusText));
};

export const requestContactKeyboard = {
  keyboard: [[{ text: '📱 Raqamni ulashish', request_contact: true }]],
  resize_keyboard: true,
  one_time_keyboard: true,
};

export const removeKeyboard = { remove_keyboard: true };
