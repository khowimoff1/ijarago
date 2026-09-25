import { db } from '../data/store.js';

const DAY = 864e5;
const STATUSES = ['confirmed', 'rejected', 'cancelled'];

const withListing = (b) => {
  const l = db.listings.find((x) => x.id === b.listingId);
  return { ...b, listing: l ? { id: l.id, title: l.title, category: l.category, district: l.district, images: l.images, pricePerDay: l.pricePerDay } : null };
};

export const createBooking = (req, res) => {
  const { listingId, from, to } = req.body;
  const listing = db.listings.find((l) => l.id === listingId);
  if (!listing) return res.status(404).json({ message: "E'lon topilmadi" });
  if (listing.owner.id === req.user.id) return res.status(400).json({ message: "O'z e'loningizni band qila olmaysiz" });

  const start = new Date(from);
  const end = new Date(to);
  const days = Math.round((end - start) / DAY);
  if (Number.isNaN(days) || days < (listing.minDays || 1)) {
    return res.status(400).json({ message: `Minimal ijara muddati: ${listing.minDays || 1} kun` });
  }

  const rent = days * listing.pricePerDay;
  const booking = {
    id: 'b' + Date.now(),
    listingId,
    ownerId: listing.owner.id,
    renterId: req.user.id,
    renterName: req.user.name,
    from, to, days,
    total: rent + Math.round(rent * 0.05) + listing.deposit,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  db.bookings.unshift(booking);
  res.status(201).json(withListing(booking));
};

export const getMyBookings = (req, res) => {
  res.json(db.bookings.filter((b) => b.renterId === req.user.id).map(withListing));
};

export const getIncomingBookings = (req, res) => {
  res.json(db.bookings.filter((b) => b.ownerId === req.user.id).map(withListing));
};

export const updateBooking = (req, res) => {
  const booking = db.bookings.find((b) => b.id === req.params.id);
  const { status } = req.body;
  if (!booking) return res.status(404).json({ message: "So'rov topilmadi" });
  if (!STATUSES.includes(status)) return res.status(400).json({ message: "Noto'g'ri holat" });
  if (booking.status !== 'pending') return res.status(400).json({ message: "So'rov allaqachon ko'rib chiqilgan" });

  // Egasi tasdiqlaydi/rad etadi, band qilgan kishi faqat bekor qiladi
  const allowed = status === 'cancelled' ? booking.renterId === req.user.id : booking.ownerId === req.user.id;
  if (!allowed) return res.status(403).json({ message: "Ruxsat yo'q" });

  booking.status = status;
  res.json(withListing(booking));
};
