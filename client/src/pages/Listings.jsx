import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { api } from '../lib/api.js';
import ListingCard, { ListingCardSkeleton } from '../components/ListingCard.jsx';

const sorts = [
  ['new', 'Eng yangi'],
  ['rating', 'Reyting bo\'yicha'],
  ['cheap', 'Avval arzon'],
  ['expensive', 'Avval qimmat'],
];

export default function Listings() {
  const [params, setParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [data, setData] = useState(null);
  const [q, setQ] = useState(params.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);

  const filters = {
    q: params.get('q') || '',
    category: params.get('category') || '',
    district: params.get('district') || '',
    minPrice: params.get('minPrice') || '',
    maxPrice: params.get('maxPrice') || '',
    sort: params.get('sort') || 'new',
  };

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };

  useEffect(() => {
    api.categories().then(setCategories).catch(() => {});
    api.districts().then(setDistricts).catch(() => {});
  }, []);

  useEffect(() => {
    setData(null);
    api.listings(filters).then(setData).catch(() => setData({ total: 0, items: [] }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.toString()]);

  const activeCat = categories.find((c) => c.id === filters.category);
  const hasFilters = filters.category || filters.district || filters.minPrice || filters.maxPrice || filters.q;

  const FilterPanel = (
    <div className="space-y-7">
      <div>
        <h4 className="mb-3 text-sm font-bold">Kategoriya</h4>
        <div className="flex flex-col gap-1">
          <button onClick={() => update('category', '')} className={`rounded-xl px-3 py-2 text-left text-sm ${!filters.category ? 'bg-brand-gradient font-semibold text-white shadow-glow' : 'hover:bg-white'}`}>
            Barchasi
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => update('category', c.id)}
              className={`flex justify-between rounded-xl px-3 py-2 text-left text-sm ${filters.category === c.id ? 'bg-brand-gradient font-semibold text-white shadow-glow' : 'hover:bg-white'}`}
            >
              {c.name} <span className="opacity-60">{c.count}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-bold">Tuman</h4>
        <select value={filters.district} onChange={(e) => update('district', e.target.value)} className="input">
          <option value="">Barcha tumanlar</option>
          {districts.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-bold">Kunlik narx (so'm)</h4>
        <div className="grid grid-cols-2 gap-2">
          <input key={"min"+filters.minPrice} type="number" placeholder="dan" defaultValue={filters.minPrice} onBlur={(e) => update('minPrice', e.target.value)} className="input" />
          <input key={"max"+filters.maxPrice} type="number" placeholder="gacha" defaultValue={filters.maxPrice} onBlur={(e) => update('maxPrice', e.target.value)} className="input" />
        </div>
      </div>
      {hasFilters && (
        <button onClick={() => { setQ(''); setParams({}); }} className="btn-ghost w-full">
          <X className="h-4 w-4" /> Filtrlarni tozalash
        </button>
      )}
    </div>
  );

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-current" /> Katalog</span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">{activeCat ? activeCat.name : 'Barcha e\'lonlar'}</h1>
        <p className="mt-2 text-muted">{data ? `${data.total} ta e'lon topildi` : 'Yuklanmoqda...'}</p>
      </div>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <form
          onSubmit={(e) => { e.preventDefault(); update('q', q.trim()); }}
          className="flex flex-1 items-center gap-2 rounded-full border border-line bg-white px-5 shadow-soft focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-100"
        >
          <Search className="h-4 w-4 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Qidirish: kamera, velosiped..." className="w-full bg-transparent py-3 text-sm outline-none" />
        </form>
        <div className="flex gap-3">
          <select value={filters.sort} onChange={(e) => update('sort', e.target.value)} className="input w-auto rounded-full">
            {sorts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <button onClick={() => setShowFilters(true)} className="btn-ghost lg:hidden">
            <SlidersHorizontal className="h-4 w-4" /> Filtr
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[270px_1fr]">
        <aside className="hidden lg:block"><div className="sticky top-24 rounded-3xl border border-line bg-white/60 p-4 shadow-soft backdrop-blur">{FilterPanel}</div></aside>

        <div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {data === null
              ? Array.from({ length: 6 }).map((_, i) => <ListingCardSkeleton key={i} />)
              : data.items.map((it) => <ListingCard key={it.id} item={it} />)}
          </div>
          {data?.items.length === 0 && (
            <div className="card grid place-items-center px-6 py-16 text-center">
              <p className="text-lg font-bold">Hech narsa topilmadi</p>
              <p className="mt-2 text-muted">Filtrlarni o'zgartirib ko'ring.</p>
            </div>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setShowFilters(false)} />
          <div className="absolute inset-y-0 right-0 w-[85%] max-w-sm overflow-y-auto bg-cream p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold">Filtrlar</h3>
              <button onClick={() => setShowFilters(false)}><X className="h-5 w-5" /></button>
            </div>
            {FilterPanel}
          </div>
        </div>
      )}
    </div>
  );
}
