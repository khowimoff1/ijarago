import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BadgeCheck, CalendarDays, Heart, LogOut, MapPin, Package, Phone, Plus, Trash2, Inbox, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api.js';
import { som } from '../lib/format.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import Avatar from '../components/Avatar.jsx';
import ListingCard from '../components/ListingCard.jsx';
import ProductVisual from '../components/ProductVisual.jsx';

const TABS = [
  { id: 'listings', label: "E'lonlarim", icon: Package },
  { id: 'bookings', label: 'Bandlarim', icon: CalendarDays },
  { id: 'requests', label: "So'rovlar", icon: Inbox },
  { id: 'favorites', label: 'Sevimlilar', icon: Heart },
  { id: 'settings', label: 'Sozlamalar', icon: CheckCircle2 },
];

const STATUS = {
  pending: { label: 'Kutilmoqda', cls: 'bg-sun-soft text-[#8a5d00]' },
  confirmed: { label: 'Tasdiqlangan', cls: 'bg-[#dcf5ec] text-[#0d7a5a]' },
  rejected: { label: 'Rad etilgan', cls: 'bg-[#fde6e0] text-coral' },
  cancelled: { label: 'Bekor qilingan', cls: 'bg-sand text-muted' },
};

const fmtDate = (d) => new Date(d).toLocaleDateString('ru-RU');

function Empty({ icon: Icon, title, text, action }) {
  return (
    <div className="card grid place-items-center px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-gradient text-white shadow-glow"><Icon className="h-6 w-6" /></span>
      <p className="mt-4 text-lg font-bold">{title}</p>
      <p className="mt-1 max-w-sm text-muted">{text}</p>
      {action}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-sand px-5 py-4">
      <p className="text-2xl font-extrabold tracking-tight">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.pending;
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${s.cls}`}>{s.label}</span>;
}

function BookingRow({ booking, who, actions }) {
  const l = booking.listing;
  return (
    <div className="card flex flex-wrap items-center gap-4 p-3">
      <div className="h-20 w-28 shrink-0 overflow-hidden rounded-2xl">
        {l ? <ProductVisual item={l} iconSize="h-8 w-8" /> : <div className="h-full w-full bg-sand" />}
      </div>
      <div className="min-w-0 flex-1">
        {l ? <Link to={`/elon/${l.id}`} className="line-clamp-1 font-bold hover:text-brand-600">{l.title}</Link> : <p className="font-bold text-muted">E'lon o'chirilgan</p>}
        <p className="mt-1 text-sm text-muted">{fmtDate(booking.from)} — {fmtDate(booking.to)} · {booking.days} kun{who ? ` · ${who}` : ''}</p>
        <p className="text-sm font-semibold">{som(booking.total)}</p>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={booking.status} />
        {actions}
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const { ids } = useFavorites();
  const navigate = useNavigate();
  const [tab, setTab] = useState('listings');
  const [listings, setListings] = useState(null);
  const [bookings, setBookings] = useState(null);
  const [requests, setRequests] = useState(null);
  const [all, setAll] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [form, setForm] = useState({ name: user.name, bio: user.bio || '', district: user.district || '' });
  const [saveState, setSaveState] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.myListings().then(setListings).catch(() => setListings([]));
    api.myBookings().then(setBookings).catch(() => setBookings([]));
    api.myRequests().then(setRequests).catch(() => setRequests([]));
    api.listings().then((d) => setAll(d.items)).catch(() => setAll([]));
    api.districts().then(setDistricts).catch(() => {});
    // Sessiya eskirgan/yangilangan bo'lsa server ma'lumotini olamiz
    api.me().then(updateUser).catch(() => {});
  }, []);

  const favorites = (all || []).filter((i) => ids.includes(i.id));
  const pendingCount = (requests || []).filter((r) => r.status === 'pending').length;
  const counts = { listings: listings?.length, bookings: bookings?.length, requests: pendingCount, favorites: ids.length };

  const removeListing = async (id) => {
    if (!window.confirm("Bu e'lonni o'chirmoqchimisiz?")) return;
    try {
      await api.deleteListing(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (e) { setError(e.message); }
  };

  const setStatus = async (setter, id, status) => {
    try {
      const updated = await api.updateBooking(id, status);
      setter((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (e) { setError(e.message); }
  };

  const save = async (e) => {
    e.preventDefault();
    setError(''); setSaveState('saving');
    try {
      updateUser(await api.updateMe(form));
      setSaveState('saved');
    } catch (err) { setError(err.message); setSaveState(''); }
  };

  const memberSince = new Date(user.createdAt || Date.now()).getFullYear();

  return (
    <div className="container-page py-10">
      <div className="card flex flex-wrap items-center justify-between gap-6 p-6 sm:p-8">
        <div className="flex items-center gap-5">
          <Avatar name={user.name} className="h-20 w-20 text-3xl" />
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {user.name}
              {user.verified && <BadgeCheck className="h-5 w-5 text-mint" />}
            </h1>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
              <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" /> {user.phone}</span>
              {user.district && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {user.district}</span>}
              <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> {memberSince}-yildan beri</span>
            </div>
            {user.bio && <p className="mt-3 max-w-xl text-sm text-muted">{user.bio}</p>}
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/elon-berish" className="btn-primary"><Plus className="h-4 w-4" /> E'lon berish</Link>
          <button onClick={() => { logout(); navigate('/'); }} className="btn-ghost"><LogOut className="h-4 w-4" /> Chiqish</button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="E'lonlar" value={counts.listings ?? '—'} />
        <Stat label="Band qilganlarim" value={counts.bookings ?? '—'} />
        <Stat label="Yangi so'rovlar" value={counts.requests ?? '—'} />
        <Stat label="Sevimlilar" value={counts.favorites} />
      </div>

      <div className="mt-8 flex gap-1 overflow-x-auto border-b border-line">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setTab(id); setError(''); }}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
              tab === id ? 'border-brand-600 text-brand-700' : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
            {id === 'requests' && pendingCount > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-amber px-1 text-[11px] font-bold text-white">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {error && <p className="mt-6 rounded-xl bg-[#fde6e0] px-4 py-3 text-sm font-medium text-coral">{error}</p>}

      <div className="mt-8">
        {tab === 'listings' && (
          listings === null ? <p className="text-muted">Yuklanmoqda...</p>
          : listings.length === 0 ? (
            <Empty icon={Package} title="Hali e'lon yo'q" text="Ishlatilmayotgan buyumingizni ijaraga qo'yib, daromad qiling."
              action={<Link to="/elon-berish" className="btn-primary mt-6"><Plus className="h-4 w-4" /> E'lon berish</Link>} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {listings.map((it) => (
                <div key={it.id} className="relative">
                  <ListingCard item={it} />
                  <button
                    onClick={() => removeListing(it.id)}
                    className="absolute right-[66px] top-[22px] grid h-9 w-9 place-items-center rounded-full bg-white/90 text-coral backdrop-blur-md transition hover:scale-110 hover:bg-[#fde6e0]"
                    aria-label="O'chirish"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'bookings' && (
          bookings === null ? <p className="text-muted">Yuklanmoqda...</p>
          : bookings.length === 0 ? (
            <Empty icon={CalendarDays} title="Band qilingan buyum yo'q" text="Katalogdan kerakli buyumni tanlab, sanani belgilang."
              action={<Link to="/katalog" className="btn-primary mt-6">Katalogni ko'rish</Link>} />
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <BookingRow key={b.id} booking={b} actions={
                  b.status === 'pending' && (
                    <button onClick={() => setStatus(setBookings, b.id, 'cancelled')} className="btn-ghost py-2">Bekor qilish</button>
                  )
                } />
              ))}
            </div>
          )
        )}

        {tab === 'requests' && (
          requests === null ? <p className="text-muted">Yuklanmoqda...</p>
          : requests.length === 0 ? (
            <Empty icon={Inbox} title="So'rovlar yo'q" text="Buyumingizni band qilmoqchi bo'lganlar shu yerda ko'rinadi." />
          ) : (
            <div className="space-y-3">
              {requests.map((r) => (
                <BookingRow key={r.id} booking={r} who={r.renterName} actions={
                  r.status === 'pending' && (
                    <>
                      <button onClick={() => setStatus(setRequests, r.id, 'confirmed')} className="btn-primary py-2">Tasdiqlash</button>
                      <button onClick={() => setStatus(setRequests, r.id, 'rejected')} className="btn-ghost py-2">Rad etish</button>
                    </>
                  )
                } />
              ))}
            </div>
          )
        )}

        {tab === 'favorites' && (
          all === null ? <p className="text-muted">Yuklanmoqda...</p>
          : favorites.length === 0 ? (
            <Empty icon={Heart} title="Hozircha bo'sh" text="Yoqqan e'lonlardagi yurakcha belgisini bosing — ular shu yerda saqlanadi."
              action={<Link to="/katalog" className="btn-primary mt-6">Katalogni ko'rish</Link>} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {favorites.map((it) => <ListingCard key={it.id} item={it} />)}
            </div>
          )
        )}

        {tab === 'settings' && (
          <form onSubmit={save} className="card max-w-xl space-y-5 p-6 sm:p-8">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Ism</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={40} className="input" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Telefon</span>
              <input value={user.phone} disabled className="input opacity-60" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Tuman</span>
              <select value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="input">
                <option value="">Tanlanmagan</option>
                {districts.map((d) => <option key={d}>{d}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">O'zingiz haqingizda</span>
              <textarea rows="4" maxLength={300} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Qisqacha tanishtiring..." className="input resize-none" />
              <span className="mt-1 block text-right text-xs text-muted">{form.bio.length}/300</span>
            </label>
            <div className="flex items-center gap-4">
              <button disabled={saveState === 'saving'} className="btn-primary">{saveState === 'saving' ? 'Saqlanmoqda...' : 'Saqlash'}</button>
              {saveState === 'saved' && <span className="text-sm font-semibold text-mint">Saqlandi</span>}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
