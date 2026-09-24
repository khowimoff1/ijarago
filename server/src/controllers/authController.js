import { db } from '../data/store.js';

// Demo: SMS o'rniga kod har doim 123456
export const sendCode = (req, res) => {
  const { phone } = req.body;
  if (!phone || phone.replace(/\D/g, '').length < 9) {
    return res.status(400).json({ message: "Telefon raqam noto'g'ri" });
  }
  db.codes.set(phone, '123456');
  res.json({ ok: true, hint: 'Demo kod: 123456' });
};

export const verifyCode = (req, res) => {
  const { phone, code, name } = req.body;
  if (db.codes.get(phone) !== code) return res.status(400).json({ message: "Kod noto'g'ri" });
  let user = db.users.find((u) => u.phone === phone);
  if (!user) {
    user = { id: 'u' + Date.now(), phone, name: name || 'Foydalanuvchi', verified: false };
    db.users.push(user);
  }
  res.json({ user, token: 'demo-' + user.id });
};
