import repo from '../data/repo/index.js';
import { readToken } from '../utils/token.js';

export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const data = readToken(header.startsWith('Bearer ') ? header.slice(7) : '');
    const user = data && (await repo.getUser(data.id));
    if (!user) return res.status(401).json({ message: 'Avval tizimga kiring' });
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
