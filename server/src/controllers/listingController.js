import repo from '../data/repo/index.js';

const num = (v) => (v !== undefined && v !== '' && Number.isFinite(Number(v)) ? Number(v) : undefined);

export const getCategories = async (req, res) => res.json(await repo.categories());
export const getStats = async (req, res) => res.json(await repo.stats());
export const getDistricts = async (req, res) => res.json(await repo.districts());

export const getListings = async (req, res) => {
  const { q, category, district, sort, minPrice, maxPrice, limit } = req.query;
  res.json(await repo.listListings({
    q: typeof q === 'string' ? q : '',
    category: typeof category === 'string' ? category : '',
    district: typeof district === 'string' ? district : '',
    sort: typeof sort === 'string' ? sort : 'new',
    minPrice: num(minPrice),
    maxPrice: num(maxPrice),
    limit: num(limit),
  }));
};

export const getListing = async (req, res) => {
  const item = await repo.getListing(req.params.id);
  if (!item) return res.status(404).json({ message: "E'lon topilmadi" });
  const [reviewList, similar] = await Promise.all([repo.reviewsFor(item.id), repo.similarListings(item)]);
  res.json({ ...item, reviewList, similar });
};

export const createListing = async (req, res) => {
  const { title, category, pricePerDay, deposit, district, description, minDays } = req.body;
  const price = Math.round(Number(pricePerDay));
  const categories = await repo.categories();
  if (!String(title || '').trim() || !categories.some((c) => c.id === category) || !district || !(price > 0)) {
    return res.status(400).json({ message: "Majburiy maydonlarni to'ldiring" });
  }
  const item = await repo.createListing({
    title: title.trim().slice(0, 100),
    category,
    pricePerDay: price,
    deposit: Math.max(Math.round(Number(deposit)) || 0, 0),
    district: String(district).slice(0, 60),
    description: String(description || '').slice(0, 2000),
    minDays: Math.max(Math.round(Number(minDays)) || 1, 1),
    condition: 'Yaxshi',
  }, req.user.id);
  res.status(201).json(item);
};

export const deleteListing = async (req, res) => {
  const item = await repo.getListing(req.params.id);
  if (!item) return res.status(404).json({ message: "E'lon topilmadi" });
  if (item.owner.id !== req.user.id) return res.status(403).json({ message: "Ruxsat yo'q" });
  await repo.deleteListing(item.id);
  res.json({ ok: true });
};
