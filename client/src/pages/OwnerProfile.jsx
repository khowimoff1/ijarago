import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BadgeCheck, CalendarDays, ChevronLeft, MapPin } from 'lucide-react';
import { api } from '../lib/api.js';
import Avatar from '../components/Avatar.jsx';
import ListingCard from '../components/ListingCard.jsx';

export default function OwnerProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setData(null); setError('');
    api.userProfile(id).then(setData).catch((e) => setError(e.message));
  }, [id]);

  if (error) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-2xl font-bold">{error}</h1>
        <Link to="/katalog" className="btn-primary mt-6">Katalogga qaytish</Link>
      </div>
    );
  }
  if (!data) return <div className="container-page py-24 text-center text-muted">Yuklanmoqda...</div>;

  const { user, stats, listings } = data;
  return (
    <div className="container-page py-10">
      <Link to="/katalog" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> Katalog
      </Link>

      <div className="card mt-6 flex flex-wrap items-center justify-between gap-6 p-6 sm:p-8">
        <div className="flex items-center gap-5">
          <Avatar name={user.name} className="h-20 w-20 text-3xl" />
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {user.name}
              {user.verified && <BadgeCheck className="h-5 w-5 text-mint" />}
            </h1>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
              {user.district && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {user.district}</span>}
              <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> {new Date(user.createdAt).getFullYear()}-yildan beri</span>
            </div>
            {user.bio && <p className="mt-3 max-w-xl text-sm text-muted">{user.bio}</p>}
          </div>
        </div>
        <div className="flex gap-3 text-center">
          <div className="rounded-2xl bg-sand px-5 py-3"><p className="text-xl font-extrabold">{stats.listings}</p><p className="text-xs text-muted">e'lon</p></div>
          <div className="rounded-2xl bg-sand px-5 py-3"><p className="text-xl font-extrabold">{stats.deals}</p><p className="text-xs text-muted">ijara</p></div>
          {stats.rating > 0 && <div className="rounded-2xl bg-sand px-5 py-3"><p className="text-xl font-extrabold">★ {stats.rating}</p><p className="text-xs text-muted">reyting</p></div>}
        </div>
      </div>

      <h2 className="mb-6 mt-12 text-2xl font-extrabold tracking-tight">{user.name.split(' ')[0]}ning e'lonlari</h2>
      {listings.length === 0 ? (
        <p className="text-muted">Hozircha faol e'lon yo'q.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {listings.map((it) => <ListingCard key={it.id} item={it} />)}
        </div>
      )}
    </div>
  );
}
