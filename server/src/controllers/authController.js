import crypto from 'node:crypto';
import repo from '../data/repo/index.js';
import { privateUser } from '../data/shapes.js';
import { createToken } from '../utils/token.js';
import { sendMessage, requestContactKeyboard, removeKeyboard } from '../utils/telegramBot.js';

const BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;
const TOKEN_TTL_MS = 10 * 60 * 1000;

// Sayt: tugma bosilganda yangi kirish so'rovi yaratiladi
export const startTelegramLogin = async (req, res) => {
  if (!BOT_USERNAME) return res.status(503).json({ message: 'Telegram kirish hali sozlanmagan' });
  const token = crypto.randomBytes(20).toString('hex');
  await repo.createPendingLogin(token, new Date(Date.now() + TOKEN_TTL_MS));
  res.json({ token, botUrl: `https://t.me/${BOT_USERNAME}?start=${token}` });
};

// Sayt: har 2 soniyada shu holatni so'raydi
export const getTelegramLoginStatus = async (req, res) => {
  const pending = await repo.getPendingLogin(req.params.token);
  if (!pending || pending.expiresAt < Date.now()) return res.json({ status: 'expired' });
  if (pending.status === 'confirmed') {
    const user = await repo.getUser(pending.userId);
    if (!user) return res.json({ status: 'expired' });
    return res.json({ status: 'confirmed', user: privateUser(user), token: createToken(user) });
  }
  res.json({ status: pending.status });
};

// Telegram: bot bilan bo'lgan har bir xabar shu yerga keladi
export const telegramWebhook = async (req, res) => {
  // Netlify Functions'da javobdan keyingi kod kafolatlanmaydi (funksiya to'xtab qolishi mumkin),
  // shuning uchun avval ishni tugatamiz, keyin javob qaytaramiz.
  if (WEBHOOK_SECRET && req.headers['x-telegram-bot-api-secret-token'] !== WEBHOOK_SECRET) return res.status(200).end();
  const message = req.body?.message;
  if (!message) return res.status(200).end();
  const chatId = message.chat.id;

  try {
    if (typeof message.text === 'string' && message.text.startsWith('/start')) {
      const token = message.text.split(' ')[1];
      const pending = token && (await repo.getPendingLogin(token));
      if (!pending || pending.expiresAt < Date.now()) {
        await sendMessage(chatId, "Havola eskirgan. Saytga qaytib, qaytadan urinib ko'ring.");
        return;
      }
      await repo.attachChatToLogin(token, chatId);
      await sendMessage(
        chatId,
        "Ijara.go'ga kirish uchun raqamingizni tasdiqlang. Faqat sizning o'z raqamingiz yuboriladi.",
        requestContactKeyboard,
      );
      return;
    }

    if (message.contact) {
      if (message.contact.user_id && message.contact.user_id !== message.from.id) return; // faqat o'z kontakti
      const telegramId = message.from.id;
      const name = [message.from.first_name, message.from.last_name].filter(Boolean).join(' ').trim().slice(0, 40) ||
        message.from.username || 'Foydalanuvchi';

      let user = await repo.getUserByTelegramId(telegramId);
      if (!user) {
        user = await repo.createUser({
          telegramId, telegramUsername: message.from.username || null, name, phone: message.contact.phone_number,
        });
      }
      const confirmed = await repo.confirmLogin(chatId, user.id);
      await sendMessage(
        chatId,
        confirmed ? "Tasdiqlandi! Endi saytga qaytishingiz mumkin." : "Havola eskirgan. Saytga qaytib, qaytadan urinib ko'ring.",
        removeKeyboard,
      );
    }
  } catch (err) {
    console.error('Telegram webhook xatosi:', err);
  } finally {
    res.status(200).end();
  }
};
