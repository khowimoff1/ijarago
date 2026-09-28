import repo from '../data/repo/index.js';

const DAY = 864e5;
const STATUSES = ['confirmed', 'rejected', 'cancelled'];
const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s)) && !Number.isNaN(Date.parse(s));

export const createBooking = async (req, res) => {
  const { listingId, from, to } = req.body;
  const listing = await repo.getListing(String(listingId));
  if (!listing) return res.status(404).json({ message: "E'lon topilmadi" });
  if (listing.owner.id === req.user.id) return res.status(400).json({ message: "O'z e'loningizni band qila olmaysiz" });

  const days = isDate(from) && isDate(to) ? Math.round((Date.parse(to) - Date.parse(from)) / DAY) : 0;
  if (days < (listing.minDays || 1)) {
    return res.status(400).json({ message: `Minimal ijara muddati: ${listing.minDays || 1} kun` });
  }

  const rent = days * listing.pricePerDay;
  const booking = await repo.createBooking({
    listingId: listing.id,
    ownerId: listing.owner.id,
    renterId: req.user.id,
    renterName: req.user.name,
    from, to, days,
    total: rent + Math.round(rent * 0.05) + listing.deposit,
  });
  res.status(201).json(booking);
};

export const getMyBookings = async (req, res) => {
  res.json(await repo.bookingsByRenter(req.user.id));
};

export const getIncomingBookings = async (req, res) => {
  res.json(await repo.bookingsByOwner(req.user.id));
};

export const updateBooking = async (req, res) => {
  const { status } = req.body;
  const booking = await repo.getBooking(req.params.id);
  if (!booking) return res.status(404).json({ message: "So'rov topilmadi" });
  if (!STATUSES.includes(status)) return res.status(400).json({ message: "Noto'g'ri holat" });
  if (booking.status !== 'pending') return res.status(400).json({ message: "So'rov allaqachon ko'rib chiqilgan" });

  // Egasi tasdiqlaydi/rad etadi, band qilgan kishi faqat bekor qiladi
  const allowed = status === 'cancelled' ? booking.renterId === req.user.id : booking.ownerId === req.user.id;
  if (!allowed) return res.status(403).json({ message: "Ruxsat yo'q" });

  const updated = await repo.updateBookingStatus(booking.id, status);
  if (!updated) return res.status(409).json({ message: "So'rov allaqachon ko'rib chiqilgan" });
  res.json(updated);
};
