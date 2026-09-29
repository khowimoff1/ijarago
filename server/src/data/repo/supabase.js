import { createClient } from '@supabase/supabase-js';
import WebSocketImpl from 'ws';
import { bookingListing } from '../shapes.js';

let client;
// Netlify Functions muhitida native WebSocket yo'q (Node 20 runtime) — supabase-js
// har doim RealtimeClient'ni qurishga urinadi va shu sabab konstruktorda xato beradi,
// hech qanday realtime funksiya ishlatmasak ham. 'ws' bilan qo'lda ta'minlaymiz.
const sb = () => (client ??= createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { transport: WebSocketImpl },
}));

const check = ({ data, error }) => {
  if (error) throw new Error(`Supabase: ${error.message}`);
  return data;
};

const LISTING_SELECT = '*, owner:users!owner_id(id,name,rating,deals,verified,created_at)';
const BOOKING_SELECT = '*, listing:listings(id,title,category,district,images,price_per_day)';

const userFrom = (r) => r && ({
  id: r.id, phone: r.phone, name: r.name, bio: r.bio, district: r.district, verified: r.verified,
  rating: Number(r.rating), deals: r.deals, createdAt: r.created_at,
});

const listingFrom = (r) => r && ({
  id: r.id, title: r.title, category: r.category, pricePerDay: r.price_per_day, deposit: r.deposit,
  city: r.city, district: r.district, description: r.description, minDays: r.min_days,
  condition: r.condition, features: r.features, images: r.images, rating: Number(r.rating),
  reviews: r.reviews_count, createdAt: r.created_at,
  owner: {
    id: r.owner.id, name: r.owner.name, rating: Number(r.owner.rating), deals: r.owner.deals,
    verified: r.owner.verified, since: String(new Date(r.owner.created_at).getFullYear()),
  },
});

const bookingFrom = (r) => r && ({
  id: r.id, listingId: r.listing_id, ownerId: r.owner_id, renterId: r.renter_id, renterName: r.renter_name,
  from: r.date_from, to: r.date_to, days: r.days, total: r.total, status: r.status, createdAt: r.created_at,
  listing: r.listing
    ? bookingListing({ ...r.listing, pricePerDay: r.listing.price_per_day })
    : null,
});

const SORTS = {
  new: ['created_at', false],
  cheap: ['price_per_day', true],
  expensive: ['price_per_day', false],
  rating: ['rating', false],
};

// PostgREST filtr sintaksisini buzadigan belgilarni olib tashlaymiz
const cleanSearch = (s) => s.replace(/[,()%*\\]/g, ' ').trim();

export default {
  async categories() {
    const cats = check(await sb().from('categories').select('*').order('name'));
    const rows = check(await sb().from('listings').select('category'));
    const counts = {};
    rows.forEach((r) => { counts[r.category] = (counts[r.category] || 0) + 1; });
    return cats.map((c) => ({ ...c, count: counts[c.id] || 0 }));
  },
  async districts() {
    const rows = check(await sb().from('listings').select('district'));
    return [...new Set(rows.map((r) => r.district))].sort();
  },
  async stats() {
    const rows = check(await sb().from('listings').select('owner_id,district'));
    const cats = check(await sb().from('categories').select('id'));
    return {
      listings: rows.length,
      categories: cats.length,
      owners: new Set(rows.map((r) => r.owner_id)).size,
      districts: new Set(rows.map((r) => r.district)).size,
    };
  },
  async listListings({ q, category, district, minPrice, maxPrice, sort = 'new', limit }) {
    let query = sb().from('listings').select(LISTING_SELECT, { count: 'exact' });
    const s = q ? cleanSearch(q) : '';
    if (s) query = query.or(`title.ilike.%${s}%,description.ilike.%${s}%`);
    if (category) query = query.eq('category', category);
    if (district) query = query.eq('district', district);
    if (minPrice != null) query = query.gte('price_per_day', minPrice);
    if (maxPrice != null) query = query.lte('price_per_day', maxPrice);
    const [col, asc] = SORTS[sort] || SORTS.new;
    query = query.order(col, { ascending: asc }).order('id');
    if (limit) query = query.limit(limit);
    const { data, error, count } = await query;
    if (error) throw new Error(`Supabase: ${error.message}`);
    return { total: count, items: data.map(listingFrom) };
  },
  async getListing(id) {
    return listingFrom(check(await sb().from('listings').select(LISTING_SELECT).eq('id', id).maybeSingle()));
  },
  async similarListings(item) {
    const rows = check(await sb().from('listings').select(LISTING_SELECT).eq('category', item.category).neq('id', item.id).limit(4));
    return rows.map(listingFrom);
  },
  async reviewsFor(listingId) {
    const rows = check(await sb().from('reviews').select('*').eq('listing_id', listingId).order('date', { ascending: false }));
    return rows.map((r) => ({ id: r.id, listingId: r.listing_id, author: r.author, rating: r.rating, text: r.text, date: r.date }));
  },
  async listingsByOwner(ownerId) {
    const rows = check(await sb().from('listings').select(LISTING_SELECT).eq('owner_id', ownerId).order('created_at', { ascending: false }));
    return rows.map(listingFrom);
  },
  async createListing(d, ownerId) {
    const row = check(await sb().from('listings').insert({
      title: d.title, category: d.category, price_per_day: d.pricePerDay, deposit: d.deposit,
      district: d.district, description: d.description, min_days: d.minDays, condition: d.condition,
      owner_id: ownerId,
    }).select(LISTING_SELECT).single());
    return listingFrom(row);
  },
  async deleteListing(id) {
    const rows = check(await sb().from('listings').delete().eq('id', id).select('id'));
    return rows.length > 0;
  },

  async getUser(id) {
    return userFrom(check(await sb().from('users').select('*').eq('id', id).maybeSingle()));
  },
  async getUserByPhone(phone) {
    return userFrom(check(await sb().from('users').select('*').eq('phone', phone).maybeSingle()));
  },
  async createUser({ phone, name }) {
    return userFrom(check(await sb().from('users').insert({ phone, name }).select('*').single()));
  },
  async updateUser(id, patch) {
    return userFrom(check(await sb().from('users').update(patch).eq('id', id).select('*').single()));
  },

  async createBooking(d) {
    const row = check(await sb().from('bookings').insert({
      listing_id: d.listingId, owner_id: d.ownerId, renter_id: d.renterId, renter_name: d.renterName,
      date_from: d.from, date_to: d.to, days: d.days, total: d.total,
    }).select(BOOKING_SELECT).single());
    return bookingFrom(row);
  },
  async getBooking(id) {
    return bookingFrom(check(await sb().from('bookings').select(BOOKING_SELECT).eq('id', id).maybeSingle()));
  },
  async bookingsByRenter(id) {
    const rows = check(await sb().from('bookings').select(BOOKING_SELECT).eq('renter_id', id).order('created_at', { ascending: false }));
    return rows.map(bookingFrom);
  },
  async bookingsByOwner(id) {
    const rows = check(await sb().from('bookings').select(BOOKING_SELECT).eq('owner_id', id).order('created_at', { ascending: false }));
    return rows.map(bookingFrom);
  },
  async updateBookingStatus(id, status) {
    // Faqat kutilayotgan so'rov o'zgaradi — ikki marta bosish/poyga holatidan himoya
    const rows = check(await sb().from('bookings').update({ status }).eq('id', id).eq('status', 'pending').select(BOOKING_SELECT));
    if (rows.length === 0) return null;
    if (status === 'confirmed') {
      const owner = check(await sb().from('users').select('deals').eq('id', rows[0].owner_id).single());
      check(await sb().from('users').update({ deals: owner.deals + 1 }).eq('id', rows[0].owner_id));
    }
    return bookingFrom(rows[0]);
  },

  async saveCode(phone, code, expiresAt) {
    check(await sb().from('login_codes').upsert({ phone, code, expires_at: new Date(expiresAt).toISOString() }));
  },
  async takeCode(phone) {
    const rows = check(await sb().from('login_codes').delete().eq('phone', phone).select('code,expires_at'));
    const row = rows[0];
    return row && new Date(row.expires_at) > new Date() ? row.code : null;
  },
};
