// Oddiy xotiradagi "baza". Keyinchalik MongoDB/PostgreSQL bilan almashtiriladi.
import { categories, listings, reviews } from './seed.js';

export const db = {
  categories,
  listings: [...listings],
  reviews,
  users: [],
  codes: new Map(),
};
