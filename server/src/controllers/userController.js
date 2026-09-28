import repo from '../data/repo/index.js';
import { publicUser, privateUser } from '../data/shapes.js';

export const getMe = (req, res) => {
  res.json(privateUser(req.user));
};

export const updateMe = async (req, res) => {
  const { name, bio, district } = req.body;
  const patch = {};
  if (name !== undefined) {
    const clean = String(name).trim().slice(0, 40);
    if (clean.length < 2) return res.status(400).json({ message: "Ism kamida 2 ta harf bo'lsin" });
    patch.name = clean;
  }
  if (bio !== undefined) patch.bio = String(bio).trim().slice(0, 300);
  if (district !== undefined) patch.district = String(district).trim().slice(0, 40);

  res.json(privateUser(await repo.updateUser(req.user.id, patch)));
};

export const getMyListings = async (req, res) => {
  res.json(await repo.listingsByOwner(req.user.id));
};

export const getUserProfile = async (req, res) => {
  const user = await repo.getUser(req.params.id);
  if (!user) return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
  const listings = await repo.listingsByOwner(user.id);
  res.json({
    user: publicUser(user),
    stats: { listings: listings.length, deals: user.deals || 0, rating: Number(user.rating) || 0 },
    listings,
  });
};
