import crypto from 'node:crypto';
import repo from '../data/repo/index.js';
import { privateUser } from '../data/shapes.js';
import { createToken } from '../utils/token.js';

const CODE_TTL_MS = 5 * 60 * 1000;
// Haqiqiy SMS/Telegram ulanmaguncha kod doim 123456. Productionda DEMO_AUTH=false qiling.
const DEMO = process.env.DEMO_AUTH !== 'false';

// "+998 90 123 45 67", "901234567" va h.k. — bir xil ko'rinishga keltiriladi
const normalizePhone = (raw = '') => {
  let digits = String(raw).replace(/\D/g, '');
  if (digits.length === 9) digits = '998' + digits;
  return digits.length === 12 && digits.startsWith('998') ? '+' + digits : null;
};

export const sendCode = async (req, res) => {
  const phone = normalizePhone(req.body.phone);
  if (!phone) return res.status(400).json({ message: "Telefon raqam noto'g'ri" });
  if (!DEMO) return res.status(503).json({ message: "SMS xizmati hali ulanmagan" });
  await repo.saveCode(phone, '123456', Date.now() + CODE_TTL_MS);
  res.json({ ok: true, hint: 'Demo kod: 123456' });
};

export const verifyCode = async (req, res) => {
  const phone = normalizePhone(req.body.phone);
  const { code, name } = req.body;
  const saved = phone && (await repo.takeCode(phone));
  const ok = saved && code && saved.length === String(code).length &&
    crypto.timingSafeEqual(Buffer.from(saved), Buffer.from(String(code)));
  if (!ok) return res.status(400).json({ message: "Kod noto'g'ri yoki eskirgan. Qayta kod oling" });

  const user = (await repo.getUserByPhone(phone)) ||
    (await repo.createUser({ phone, name: String(name || '').trim().slice(0, 40) || 'Foydalanuvchi' }));
  res.json({ user: privateUser(user), token: createToken(user) });
};
