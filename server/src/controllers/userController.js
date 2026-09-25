import { db, publicUser, privateUser, ownerOf } from '../data/store.js';

export const getMe = (req, res) => {
  res.json(privateUser(req.user));
};

export const updateMe = (req, res) => {
  const { name, bio, district } = req.body;
  if (name !== undefined) {
    const clean = String(name).trim().slice(0, 40);
    if (clean.length < 2) return res.status(400).json({ message: "Ism kamida 2 ta harf bo'lsin" });
    req.user.name = clean;
  }
  if (bio !== undefined) req.user.bio = String(bio).trim().slice(0, 300);
  if (district !== undefined) req.user.district = String(district).trim().slice(0, 40);

  // E'lonlardagi egasi ma'lumoti ham yangilansin
  const owner = ownerOf(req.user);
  db.listings.filter((l) => l.owner.id === req.user.id).forEach((l) => { l.owner = owner; });
  res.json(privateUser(req.user));
};

export const getMyListings = (req, res) => {
  res.json(db.listings.filter((l) => l.owner.id === req.user.id));
};

// Ochiq profil: seed'dagi egalar ham (ular db.users'da yo'q) e'lonlaridan tiklanadi
export const getUserProfile = (req, res) => {
  const { id } = req.params;
  const listings = db.listings.filter((l) => l.owner.id === id);
  const stored = db.users.find((u) => u.id === id);
  const seedOwner = listings[0]?.owner;
  if (!stored && !seedOwner) return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });

  const user = stored
    ? publicUser(stored)
    : { id, name: seedOwner.name, bio: '', district: listings[0].district, verified: seedOwner.verified, createdAt: `${seedOwner.since}-01-01T00:00:00.000Z` };
  const owner = stored ? ownerOf(stored) : seedOwner;

  res.json({
    user,
    stats: { listings: listings.length, deals: owner.deals, rating: owner.rating },
    listings,
  });
};
