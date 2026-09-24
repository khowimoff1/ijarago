import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { api } from '../lib/api.js';
import { useFavorites } from '../context/FavoritesContext.jsx';
import ListingCard from '../components/ListingCard.jsx';

export default function Favorites() {
  const { ids } = useFavorites();
  const [all, setAll] = useState(null);

  useEffect(() => {
    api.listings().then((d) => setAll(d.items)).catch(() => setAll([]));
  }, []);

  const items = (all || []).filter((i) => ids.includes(i.id));

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Sevimlilar</h1>
      <p className="mt-2 text-muted">{ids.length} ta saqlangan e'lon</p>

      {all !== null && items.length === 0 ? (
        <div className="card mt-10 grid place-items-center px-6 py-20 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-gradient text-white shadow-glow"><Heart className="h-7 w-7" /></span>
          <p className="mt-5 text-lg font-bold">Hozircha bo'sh</p>
          <p className="mt-2 max-w-sm text-muted">Yoqqan e'lonlardagi yurakcha belgisini bosing — ular shu yerda saqlanadi.</p>
          <Link to="/katalog" className="btn-primary mt-6">Katalogni ko'rish</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => <ListingCard key={it.id} item={it} />)}
        </div>
      )}
    </div>
  );
}
