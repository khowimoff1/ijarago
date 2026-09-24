import { Link } from 'react-router-dom';
import { Heart, MapPin, Star, BadgeCheck, ArrowUpRight } from 'lucide-react';
import ProductVisual from './ProductVisual.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { som } from '../lib/format.js';

export default function ListingCard({ item }) {
  const { has, toggle } = useFavorites();
  const fav = has(item.id);

  return (
    <Link
      to={`/elon/${item.id}`}
      className="group block rounded-[28px] border border-line bg-white p-2.5 shadow-soft transition duration-300 hover:-translate-y-1.5 hover:border-brand-100 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
        <ProductVisual item={item} className="transition duration-700 ease-out group-hover:scale-110" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80" />

        <button
          onClick={(e) => { e.preventDefault(); toggle(item.id); }}
          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full backdrop-blur-md transition hover:scale-110 ${
            fav ? 'bg-amber text-white' : 'bg-white/85 text-ink'
          }`}
          aria-label="Sevimlilarga qo'shish"
        >
          <Heart className={`h-4 w-4 ${fav ? 'fill-white' : ''}`} />
        </button>

        {item.owner?.verified && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-brand-700 backdrop-blur-md">
            <BadgeCheck className="h-3.5 w-3.5 text-mint" /> Tasdiqlangan
          </span>
        )}

        <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
          <MapPin className="h-3 w-3" /> {item.district}
        </span>
      </div>

      <div className="px-2 pb-2 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 font-bold tracking-tight">{item.title}</h3>
          {item.rating > 0 && (
            <span className="flex shrink-0 items-center gap-1 text-sm font-bold">
              <Star className="h-3.5 w-3.5 fill-sun text-sun" /> {item.rating.toFixed(1)}
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p>
            <span className="text-lg font-extrabold tracking-tight">{som(item.pricePerDay)}</span>
            <span className="text-sm text-muted"> / kun</span>
          </p>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-sand text-ink transition group-hover:bg-brand-gradient group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="animate-pulse rounded-[28px] border border-line bg-white p-2.5">
      <div className="aspect-[4/3] rounded-[20px] bg-sand" />
      <div className="mx-2 mt-4 h-4 w-3/4 rounded bg-sand" />
      <div className="mx-2 mb-3 mt-4 h-5 w-1/2 rounded bg-sand" />
    </div>
  );
}
