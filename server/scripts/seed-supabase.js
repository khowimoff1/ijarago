// Namunaviy e'lonlarni Supabase'ga yuklaydi: npm run seed --prefix server
// Qayta ishga tushirsa ham xavfsiz (upsert): mavjud yozuvlar yangilanadi, yangi e'lonlar o'chmaydi.
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { categories, listings, reviews } from '../src/data/seed.js';

const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('server/.env ichida SUPABASE_URL va SUPABASE_SERVICE_KEY bo\'lishi kerak');
  process.exit(1);
}
const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } });

const run = async (label, promise) => {
  const { error } = await promise;
  if (error) {
    console.error(`${label}: ${error.message}`);
    process.exit(1);
  }
  console.log(`${label}: ok`);
};

const owners = new Map();
listings.forEach((l) => owners.set(l.owner.id, { owner: l.owner, district: l.district }));

await run('categories', sb.from('categories').upsert(categories.map((c) => ({ id: c.id, name: c.name, icon: c.icon, image: c.image }))));

await run('users', sb.from('users').upsert([...owners.values()].map(({ owner, district }) => ({
  id: owner.id,
  phone: `seed-${owner.id}`,
  name: owner.name,
  district,
  verified: owner.verified,
  rating: owner.rating,
  deals: owner.deals,
  created_at: `${owner.since}-01-01T00:00:00Z`,
}))));

await run('listings', sb.from('listings').upsert(listings.map((l) => ({
  id: l.id,
  title: l.title,
  category: l.category,
  price_per_day: l.pricePerDay,
  deposit: l.deposit,
  city: l.city,
  district: l.district,
  description: l.description,
  min_days: l.minDays,
  condition: l.condition,
  features: l.features || [],
  images: l.images,
  rating: l.rating,
  reviews_count: l.reviews,
  owner_id: l.owner.id,
  created_at: l.createdAt,
}))));

await run('reviews', sb.from('reviews').upsert(reviews.map((r) => ({
  id: r.id, listing_id: r.listingId, author: r.author, rating: r.rating, text: r.text, date: r.date,
}))));
