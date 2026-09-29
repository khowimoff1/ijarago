// Xotiradagi baza: Supabase kalitlari yo'q bo'lganda (lokal sinov uchun). Server o'chsa ma'lumot yo'qoladi.
import { categories, listings as seedListings, reviews as seedReviews } from '../seed.js';
import { ownerOf, bookingListing } from '../shapes.js';

const users = [];
for (const l of seedListings) {
  const o = l.owner;
  if (users.some((u) => u.id === o.id)) continue;
  users.push({
    id: o.id, telegramUsername: null, name: o.name, bio: '', district: l.district,
    verified: o.verified, rating: o.rating, deals: o.deals, createdAt: `${o.since}-01-01T00:00:00.000Z`,
  });
}
const listings = seedListings.map(({ owner, ...rest }) => ({ ...rest, ownerId: owner.id }));
const reviews = [...seedReviews];
const bookings = [];

const withOwner = ({ ownerId, ...l }) => ({ ...l, owner: ownerOf(users.find((u) => u.id === ownerId)) });
const withListing = (b) => ({ ...b, listing: bookingListing(listings.find((l) => l.id === b.listingId)) || null });
let seq = 0;
const newId = (p) => `${p}${Date.now()}${seq++}`;

const sorters = {
  new: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  cheap: (a, b) => a.pricePerDay - b.pricePerDay,
  expensive: (a, b) => b.pricePerDay - a.pricePerDay,
  rating: (a, b) => b.rating - a.rating,
};

export default {
  async categories() {
    return categories.map((c) => ({ ...c, count: listings.filter((l) => l.category === c.id).length }));
  },
  async districts() {
    return [...new Set(listings.map((l) => l.district))].sort();
  },
  async stats() {
    return {
      listings: listings.length,
      categories: categories.length,
      owners: new Set(listings.map((l) => l.ownerId)).size,
      districts: new Set(listings.map((l) => l.district)).size,
    };
  },
  async listListings({ q, category, district, minPrice, maxPrice, sort = 'new', limit }) {
    let items = [...listings];
    if (q) {
      const s = q.toLowerCase();
      items = items.filter((l) => l.title.toLowerCase().includes(s) || l.description.toLowerCase().includes(s));
    }
    if (category) items = items.filter((l) => l.category === category);
    if (district) items = items.filter((l) => l.district === district);
    if (minPrice != null) items = items.filter((l) => l.pricePerDay >= minPrice);
    if (maxPrice != null) items = items.filter((l) => l.pricePerDay <= maxPrice);
    items.sort(sorters[sort] || sorters.new);
    const total = items.length;
    if (limit) items = items.slice(0, limit);
    return { total, items: items.map(withOwner) };
  },
  async getListing(id) {
    const l = listings.find((x) => x.id === id);
    return l ? withOwner(l) : null;
  },
  async similarListings(item) {
    return listings.filter((l) => l.category === item.category && l.id !== item.id).slice(0, 4).map(withOwner);
  },
  async reviewsFor(listingId) {
    return reviews.filter((r) => r.listingId === listingId);
  },
  async listingsByOwner(ownerId) {
    return listings.filter((l) => l.ownerId === ownerId).map(withOwner);
  },
  async createListing(data, ownerId) {
    const item = { id: newId('l'), ...data, city: 'Toshkent', features: [], images: [], rating: 0, reviews: 0, ownerId, createdAt: new Date().toISOString() };
    listings.unshift(item);
    return withOwner(item);
  },
  async deleteListing(id) {
    const i = listings.findIndex((l) => l.id === id);
    if (i === -1) return false;
    listings.splice(i, 1);
    return true;
  },

  async getUser(id) { return users.find((u) => u.id === id) || null; },
  async getUserByTelegramId(telegramId) { return users.find((u) => u.telegramId === telegramId) || null; },
  async createUser(data) {
    const u = { id: newId('u'), bio: '', district: '', verified: false, rating: 0, deals: 0, createdAt: new Date().toISOString(), ...data };
    users.push(u);
    return u;
  },
  async updateUser(id, patch) {
    return Object.assign(users.find((u) => u.id === id), patch);
  },

  async createBooking(data) {
    const b = { id: newId('b'), status: 'pending', createdAt: new Date().toISOString(), ...data };
    bookings.unshift(b);
    return withListing(b);
  },
  async getBooking(id) { return bookings.find((b) => b.id === id) || null; },
  async bookingsByRenter(id) { return bookings.filter((b) => b.renterId === id).map(withListing); },
  async bookingsByOwner(id) { return bookings.filter((b) => b.ownerId === id).map(withListing); },
  async updateBookingStatus(id, status) {
    const b = bookings.find((x) => x.id === id);
    b.status = status;
    if (status === 'confirmed') users.find((u) => u.id === b.ownerId).deals += 1;
    return withListing(b);
  },
};
