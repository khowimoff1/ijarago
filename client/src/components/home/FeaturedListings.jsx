import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { api } from '../../lib/api.js';
import ListingCard, { ListingCardSkeleton } from '../ListingCard.jsx';
import SectionHeading from '../SectionHeading.jsx';

const chips = [
  ['', 'Hammasi'], ['kamera', 'Kamera'], ['konsol', 'Konsollar'], ['noutbuk', 'Noutbuklar'], ['velosiped', 'Velosipedlar'], ['kemping', 'Kemping'],
];

export default function FeaturedListings() {
  const [category, setCategory] = useState('');
  const [items, setItems] = useState(null);

  useEffect(() => {
    setItems(null);
    api.listings({ category, limit: 8, sort: 'rating' }).then((d) => setItems(d.items)).catch(() => setItems([]));
  }, [category]);

  return (
    <section className="relative py-24">
      <div className="absolute inset-0 -z-10 bg-dots [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />
      <div className="container-page">
        <SectionHeading
          eyebrow="Mashhur e'lonlar"
          title="Hozir ijaraga olish mumkin"
          action={<Link to="/katalog" className="btn-ghost">Katalogga o'tish <ArrowUpRight className="h-4 w-4" /></Link>}
        />
        <div className="-mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-1">
          {chips.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setCategory(id)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition ${
                category === id ? 'bg-ink text-white shadow-lift' : 'border border-line bg-white text-muted hover:border-brand-200 hover:text-brand-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items === null
            ? Array.from({ length: 4 }).map((_, i) => <ListingCardSkeleton key={i} />)
            : items.map((it) => <ListingCard key={it.id} item={it} />)}
        </div>
        {items?.length === 0 && <p className="text-center text-muted">Bu kategoriyada hozircha e'lon yo'q.</p>}
      </div>
    </section>
  );
}
