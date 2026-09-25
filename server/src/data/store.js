// Oddiy xotiradagi "baza". Keyinchalik MongoDB/PostgreSQL bilan almashtiriladi.
import { categories, listings, reviews } from './seed.js';

export const db = {
  categories,
  listings: [...listings],
  reviews,
  users: [],
  bookings: [],
  codes: new Map(),
};

export const ownerOf = (user) => ({
  id: user.id,
  name: user.name,
  rating: 0,
  deals: db.bookings.filter((b) => b.ownerId === user.id && b.status === 'confirmed').length,
  verified: user.verified,
  since: String(new Date(user.createdAt).getFullYear()),
});

export const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  bio: user.bio || '',
  district: user.district || '',
  verified: user.verified,
  createdAt: user.createdAt,
});

export const privateUser = (user) => ({ ...publicUser(user), phone: user.phone });
