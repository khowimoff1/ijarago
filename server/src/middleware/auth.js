import { db } from '../data/store.js';
import { readToken } from '../utils/token.js';

// Server qayta ishga tushganda xotira tozalanadi — token to'g'ri bo'lsa foydalanuvchini qayta tiklaymiz
export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const data = readToken(header.startsWith('Bearer ') ? header.slice(7) : '');
  if (!data) return res.status(401).json({ message: 'Avval tizimga kiring' });

  let user = db.users.find((u) => u.id === data.id);
  if (!user) {
    user = { id: data.id, phone: data.phone, name: data.name, bio: '', district: '', verified: false, createdAt: new Date().toISOString() };
    db.users.push(user);
  }
  req.user = user;
  next();
};
