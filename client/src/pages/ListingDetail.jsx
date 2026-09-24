import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, Heart, MapPin, Star, BadgeCheck, ShieldCheck, CalendarDays, Check, MessageCircle, Info } from 'lucide-react';
import { api } from '../lib/api.js';
import { som, daysBetween, today } from '../lib/format.js';
import ProductVisual from '../components/ProductVisual.jsx';
import ListingCard from '../components/ListingCard.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ListingDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const [from, setFrom] = useState(today(1));
  const [to, setTo] = useState(today(3));
  const [booked, setBooked] = useState(false);
  const { has, toggle } = useFavorites();
  const { user } = useAuth();

  useEffect(() => {
    setItem(null); setError(''); setBooked(false);
    api.listing(id).then(setItem).catch((e) => setError(e.message));
  }, [id]);

  if (error) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-2xl font-bold">{error}</h1>
        <Link to="/katalog" className="btn-primary mt-6">Katalogga qaytish</Link>
      </div>
    );
  }
  if (!item) return <div className="container-page py-24 text-center text-muted">Yuklanmoqda...</div>;

  const days = daysBetween(from, to);
  const rent = days * item.pricePerDay;
  const service = Math.round(rent * 0.05);
  const tooShort = days < (item.minDays || 1);

  return (
    <div className="container-page py-8">
      <Link to="/katalog" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> Katalog
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
            <div className="aspect-[4/3] overflow-hidden rounded-[28px] shadow-lift sm:row-span-2">
              <ProductVisual item={item} iconSize="h-28 w-28" />
            </div>
            <div className="hidden overflow-hidden rounded-[28px] sm:block"><ProductVisual item={item} index={1} iconSize="h-12 w-12" /></div>
            <div className="hidden overflow-hidden rounded-[28px] sm:block"><ProductVisual item={item} index={2} iconSize="h-12 w-12" /></div>
          </div>

          <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{item.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {item.city}, {item.district}</span>
                {item.rating > 0 && (
                  <span className="flex items-center gap-1 font-semibold text-ink">
                    <Star className="h-4 w-4 fill-sun text-sun" /> {item.rating.toFixed(1)}
                    <span className="font-normal text-muted">({item.reviews} ta sharh)</span>
                  </span>
                )}
                <span>Holati: <b className="text-ink">{item.condition}</b></span>
              </div>
            </div>
            <button onClick={() => toggle(item.id)} className="btn-ghost">
              <Heart className={`h-4 w-4 ${has(item.id) ? 'fill-coral text-coral' : ''}`} />
              {has(item.id) ? 'Saqlangan' : 'Saqlash'}
            </button>
          </div>

          <div className="mt-8 border-t border-line pt-8">
            <h2 className="text-lg font-bold">Tavsif</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-muted">{item.description || "Egasi hozircha tavsif qo'shmagan."}</p>
            {item.features?.length > 0 && (
              <>
                <h3 className="mt-6 font-bold">Komplektda</h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {item.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-mint text-white"><Check className="h-3 w-3" strokeWidth={3} /></span>{f}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="card mt-8 flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-gradient text-lg font-bold text-white">
                {item.owner.name[0]}
              </span>
              <div>
                <p className="flex items-center gap-1.5 font-bold">
                  {item.owner.name}
                  {item.owner.verified && <BadgeCheck className="h-4 w-4 text-mint" />}
                </p>
                <p className="text-sm text-muted">
                  {item.owner.rating > 0 ? `★ ${item.owner.rating} · ${item.owner.deals} ta ijara · ` : ''}{item.owner.since}-yildan beri
                </p>
              </div>
            </div>
            <button className="btn-ghost"><MessageCircle className="h-4 w-4" /> Yozish</button>
          </div>

          {item.reviewList?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold">Sharhlar</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {item.reviewList.map((r) => (
                  <div key={r.id} className="card p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{r.author}</p>
                      <span className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-sun text-sun' : 'text-line'}`} />
                        ))}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{r.text}</p>
                    <p className="mt-3 text-xs text-muted">{r.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside>
          <div className="card sticky top-24 p-6 shadow-lift">
            <p>
              <span className="text-gradient-dark text-3xl font-extrabold">{som(item.pricePerDay)}</span>
              <span className="text-muted"> / kun</span>
            </p>
            <p className="mt-1 text-sm text-muted">Garov: {som(item.deposit)} · qaytariladi</p>

            <div className="mt-6 grid grid-cols-2 overflow-hidden rounded-2xl border border-line">
              <label className="border-r border-line p-3">
                <span className="flex items-center gap-1 text-[11px] font-bold uppercase text-muted"><CalendarDays className="h-3 w-3" /> Olish</span>
                <input type="date" value={from} min={today()} onChange={(e) => setFrom(e.target.value)} className="mt-1 w-full text-sm font-semibold outline-none" />
              </label>
              <label className="p-3">
                <span className="flex items-center gap-1 text-[11px] font-bold uppercase text-muted"><CalendarDays className="h-3 w-3" /> Qaytarish</span>
                <input type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} className="mt-1 w-full text-sm font-semibold outline-none" />
              </label>
            </div>

            {tooShort && (
              <p className="mt-3 flex items-center gap-2 rounded-xl bg-sun-soft px-3 py-2 text-xs font-medium text-[#8a5d00]">
                <Info className="h-4 w-4 shrink-0" /> Minimal ijara muddati: {item.minDays} kun
              </p>
            )}

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted">{som(item.pricePerDay)} × {days} kun</span><span>{som(rent)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Xizmat haqi (5%)</span><span>{som(service)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Garov (qaytariladi)</span><span>{som(item.deposit)}</span></div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-extrabold">
                <span>Jami</span><span>{som(rent + service + item.deposit)}</span>
              </div>
            </div>

            {booked ? (
              <div className="mt-6 rounded-2xl bg-brand-50 p-4 text-sm text-brand-700">
                <p className="font-bold">So'rov yuborildi!</p>
                <p className="mt-1">Egasi tasdiqlagach, sizga xabar keladi.</p>
              </div>
            ) : user ? (
              <button disabled={tooShort || days === 0} onClick={() => setBooked(true)} className="btn-primary mt-6 w-full py-3.5">
                Band qilish
              </button>
            ) : (
              <Link to="/kirish" state={{ from: `/elon/${item.id}` }} className="btn-primary mt-6 w-full py-3.5">
                Band qilish uchun kiring
              </Link>
            )}

            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted">
              <ShieldCheck className="h-4 w-4 text-brand-600" /> To'lov buyum qaytgunga qadar himoyada
            </p>
          </div>
        </aside>
      </div>

      {item.similar?.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 text-2xl font-extrabold tracking-tight">O'xshash e'lonlar</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {item.similar.map((s) => <ListingCard key={s.id} item={s} />)}
          </div>
        </section>
      )}
    </div>
  );
}
