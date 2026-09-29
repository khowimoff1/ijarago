export const ownerOf = (u) => ({
  id: u.id,
  name: u.name,
  rating: Number(u.rating) || 0,
  deals: u.deals || 0,
  verified: u.verified,
  since: String(new Date(u.createdAt).getFullYear()),
});

export const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  bio: u.bio || '',
  district: u.district || '',
  verified: u.verified,
  createdAt: u.createdAt,
});

export const privateUser = (u) => ({ ...publicUser(u), telegramUsername: u.telegramUsername || null });

export const bookingListing = (l) => l && ({
  id: l.id, title: l.title, category: l.category, district: l.district, images: l.images, pricePerDay: l.pricePerDay,
});
