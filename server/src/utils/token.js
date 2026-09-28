import crypto from 'node:crypto';

const SECRET = process.env.AUTH_SECRET || 'ijarago-dev-secret-change-me';
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

const sign = (body) => crypto.createHmac('sha256', SECRET).update(body).digest('base64url');

export const createToken = (user) => {
  const body = Buffer.from(JSON.stringify({ id: user.id, exp: Date.now() + TTL_MS })).toString('base64url');
  return `${body}.${sign(body)}`;
};

export const readToken = (token) => {
  if (typeof token !== 'string') return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(body));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString());
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
};
