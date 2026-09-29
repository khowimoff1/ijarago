import crypto from 'node:crypto';
import repo from '../data/repo/index.js';
import { privateUser } from '../data/shapes.js';
import { createToken } from '../utils/token.js';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const AUTH_MAX_AGE_MS = 24 * 60 * 60 * 1000;

// Telegram Login Widget imzosini tekshiradi: https://core.telegram.org/widgets/login#checking-authorization
const verifyTelegramAuth = (data) => {
  if (!BOT_TOKEN) return false;
  const { hash, ...rest } = data;
  if (!hash) return false;
  const checkString = Object.keys(rest)
    .filter((k) => rest[k] !== undefined && rest[k] !== null)
    .sort()
    .map((k) => `${k}=${rest[k]}`)
    .join('\n');
  const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest();
  const expected = crypto.createHmac('sha256', secret).update(checkString).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(String(hash));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  return Date.now() - Number(data.auth_date) * 1000 < AUTH_MAX_AGE_MS;
};

export const telegramAuth = async (req, res) => {
  if (!verifyTelegramAuth(req.body)) {
    return res.status(400).json({ message: "Telegram orqali tasdiqlash muvaffaqiyatsiz. Qaytadan urining" });
  }
  const { id, first_name, last_name, username } = req.body;
  const telegramId = Number(id);
  const name = [first_name, last_name].filter(Boolean).join(' ').trim().slice(0, 40) ||
    username || 'Foydalanuvchi';

  let user = await repo.getUserByTelegramId(telegramId);
  if (!user) {
    user = await repo.createUser({ telegramId, telegramUsername: username || null, name });
  } else if (username !== user.telegramUsername) {
    user = await repo.updateUser(user.id, { telegramUsername: username || null });
  }
  res.json({ user: privateUser(user), token: createToken(user) });
};
