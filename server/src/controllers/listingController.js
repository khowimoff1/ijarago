import { db, ownerOf } from '../data/store.js';

export const getCategories = (req, res) => {
  const withCount = db.categories.map((c) => ({
    ...c,
    count: db.listings.filter((l) => l.category === c.id).length,
  }));
  res.json(withCount);
};

export const getStats = (req, res) => {
  res.json({
    listings: db.listings.length,
    categories: db.categories.length,
    owners: new Set(db.listings.map((l) => l.owner.id)).size,
    districts: new Set(db.listings.map((l) => l.district)).size,
  });
};

export const getListings = (req, res) => {
  const { q, category, district, minPrice, maxPrice, sort = 'new', limit } = req.query;
  let items = [...db.listings];

  if (q) {
    const s = q.toLowerCase();
    items = items.filter((l) => l.title.toLowerCase().includes(s) || l.description.toLowerCase().includes(s));
  }
  if (category) items = items.filter((l) => l.category === category);
  if (district) items = items.filter((l) => l.district === district);
  if (minPrice) items = items.filter((l) => l.pricePerDay >= Number(minPrice));
  if (maxPrice) items = items.filter((l) => l.pricePerDay <= Number(maxPrice));

  const sorters = {
    new: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    cheap: (a, b) => a.pricePerDay - b.pricePerDay,
    expensive: (a, b) => b.pricePerDay - a.pricePerDay,
    rating: (a, b) => b.rating - a.rating,
  };
  items.sort(sorters[sort] || sorters.new);

  const total = items.length;
  if (limit) items = items.slice(0, Number(limit));
  res.json({ total, items });
};

export const getListing = (req, res) => {
  const item = db.listings.find((l) => l.id === req.params.id);
  if (!item) return res.status(404).json({ message: "E'lon topilmadi" });
  const reviews = db.reviews.filter((r) => r.listingId === item.id);
  const similar = db.listings.filter((l) => l.category === item.category && l.id !== item.id).slice(0, 4);
  res.json({ ...item, reviewList: reviews, similar });
};

export const getDistricts = (req, res) => {
  res.json([...new Set(db.listings.map((l) => l.district))].sort());
};

export const createListing = (req, res) => {
  const { title, category, pricePerDay, deposit, district, description, minDays } = req.body;
  const price = Number(pricePerDay);
  if (!title?.trim() || !db.categories.some((c) => c.id === category) || !district || !(price > 0)) {
    return res.status(400).json({ message: "Majburiy maydonlarni to'ldiring" });
  }
  const item = {
    id: String(Date.now()),
    title: title.trim().slice(0, 100),
    category,
    pricePerDay: price,
    deposit: Math.max(Number(deposit) || 0, 0),
    city: 'Toshkent',
    district,
    description: String(description || '').slice(0, 2000),
    minDays: Math.max(Number(minDays) || 1, 1),
    condition: 'Yaxshi',
    features: [],
    images: [],
    rating: 0,
    reviews: 0,
    owner: ownerOf(req.user),
    createdAt: new Date().toISOString(),
  };
  db.listings.unshift(item);
  res.status(201).json(item);
};

export const deleteListing = (req, res) => {
  const index = db.listings.findIndex((l) => l.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "E'lon topilmadi" });
  if (db.listings[index].owner.id !== req.user.id) return res.status(403).json({ message: "Ruxsat yo'q" });
  db.listings.splice(index, 1);
  res.json({ ok: true });
};
