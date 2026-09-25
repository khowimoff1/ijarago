import { db, privateUser } from '../data/store.js';
import { createToken } from '../utils/token.js';

const DEMO_CODE = '123456';

// "+998 90 123 45 67", "901234567" va h.k. — bir xil ko'rinishga keltiriladi
const normalizePhone = (raw = '') => {
  let digits = String(raw).replace(/\D/g, '');
  if (digits.length === 9) digits = '998' + digits;
  return digits.length === 12 && digits.startsWith('998') ? '+' + digits : null;
};

// Demo: SMS o'rniga kod har doim 123456
export const sendCode = (req, res) => {
  const phone = normalizePhone(req.body.phone);
  if (!phone) return res.status(400).json({ message: "Telefon raqam noto'g'ri" });
  db.codes.set(phone, DEMO_CODE);
  res.json({ ok: true, hint: `Demo kod: ${DEMO_CODE}` });
};

export const verifyCode = (req, res) => {
  const phone = normalizePhone(req.body.phone);
  const { code, name } = req.body;
  if (!phone || db.codes.get(phone) !== code) return res.status(400).json({ message: "Kod noto'g'ri" });
  db.codes.delete(phone);

  let user = db.users.find((u) => u.phone === phone);
  if (!user) {
    user = {
      id: 'u' + Date.now(),
      phone,
      name: String(name || '').trim().slice(0, 40) || 'Foydalanuvchi',
      bio: '',
      district: '',
      verified: false,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
  }
  res.json({ user: privateUser(user), token: createToken(user) });
};
