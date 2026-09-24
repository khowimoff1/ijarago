import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ShieldCheck, Star, LayoutGrid, TrendingUp, ChevronDown } from 'lucide-react';
import { api } from '../../lib/api.js';
import { heroShots } from '../../lib/images.js';

const popular = [['kamera', 'Kamera'], ['dron', 'Dron'], ['konsol', 'PlayStation'], ['kemping', 'Kemping']];
const avatars = ['from-[#9923fb] to-[#fea31c]', 'from-[#22c3ee] to-[#5a1dfb]', 'from-[#fee04c] to-[#ff7a1a]', 'from-[#14c294] to-[#22c3ee]'];

function Select({ icon: Icon, value, onChange, children }) {
  return (
    <label className="relative flex items-center gap-2.5 rounded-2xl bg-sand/60 px-4 py-3.5 transition hover:bg-sand">
      <Icon className="h-4 w-4 shrink-0 text-brand-500" />
      <select value={value} onChange={onChange} className="w-full cursor-pointer appearance-none bg-transparent pr-6 text-sm font-medium outline-none">
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-muted" />
    </label>
  );
}

export default function Hero() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [district, setDistrict] = useState('');
  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.categories().then(setCategories).catch(() => {});
    api.districts().then(setDistricts).catch(() => {});
    api.stats().then(setStats).catch(() => {});
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (q) qs.set('q', q);
    if (category) qs.set('category', category);
    if (district) qs.set('district', district);
    navigate('/katalog?' + qs.toString());
  };

  return (
    <section className="relative overflow-hidden bg-night pb-20 pt-[72px] text-white lg:pb-28">
      {/* Aurora fon */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-32 h-[520px] w-[520px] rounded-full bg-brand-600/50 blur-[130px]" />
        <div className="absolute right-[-10%] top-10 h-[460px] w-[460px] rounded-full bg-amber/20 blur-[130px]" />
        <div className="absolute bottom-[-30%] left-1/3 h-[420px] w-[420px] rounded-full bg-sky/20 blur-[130px]" />
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="container-page relative grid items-center gap-14 pt-14 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1.5 pl-1.5 pr-4 text-xs font-semibold text-white/80 backdrop-blur">
            <span className="rounded-full bg-gold-gradient px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-ink">Yangi</span>
            Ijara.go — har narsa ijarada
          </span>

          <h1 className="mt-7 text-[44px] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[68px]">
            Sotib olmang —<br />
            <span className="text-gradient">ijaraga oling.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/65">
            Kamera, dron, konsol yoki kemping jihozi — kerakli narsani yaqin atrofdagilardan kunlik narxda oling.
            O'zingizdagi buyumlarni esa ijaraga berib, daromad qiling.
          </p>

          <form onSubmit={submit} className="mt-9 rounded-[28px] bg-white p-2.5 text-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]">
            <div className="flex items-center gap-2 rounded-2xl px-3">
              <Search className="h-5 w-5 shrink-0 text-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Nima qidiryapsiz? Masalan: Sony kamera"
                className="w-full bg-transparent py-3.5 text-[15px] outline-none placeholder:text-muted/70"
              />
            </div>
            <div className="mt-1 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <Select icon={LayoutGrid} value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Barcha kategoriyalar</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
              <Select icon={MapPin} value={district} onChange={(e) => setDistrict(e.target.value)}>
                <option value="">Barcha tumanlar</option>
                {districts.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
              <button className="btn-primary rounded-2xl px-7 py-3.5">
                <Search className="h-4 w-4" /> Qidirish
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-white/50">
            <span>Ommabop:</span>
            {popular.map(([id, l]) => (
              <button key={id} onClick={() => navigate(`/katalog?category=${id}`)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/80 transition hover:border-white/30 hover:bg-white/10">
                {l}
              </button>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {['J', 'M', 'S', 'A'].map((l, i) => (
                  <span key={l} className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${avatars[i]} text-sm font-bold ring-2 ring-night`}>{l}</span>
                ))}
              </div>
              <div>
                <p className="flex items-center gap-1 text-sm font-bold">
                  {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-3.5 w-3.5 fill-sun text-sun" />)}
                  <span className="ml-1">4.9</span>
                </p>
                <p className="text-xs text-white/50">2 500+ foydalanuvchi ishonadi</p>
              </div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="flex gap-8">
              <div><p className="text-2xl font-extrabold">{stats ? stats.listings : '—'}+</p><p className="text-xs text-white/50">faol e'lon</p></div>
              <div><p className="text-2xl font-extrabold">{stats ? stats.categories : '—'}</p><p className="text-xs text-white/50">kategoriya</p></div>
            </div>
          </div>
        </div>

        {/* O'ng tomon — suratlar kollaji */}
        <div className="relative hidden h-[560px] lg:block">
          <div className="absolute right-0 top-0 h-[400px] w-[78%] overflow-hidden rounded-[36px] ring-1 ring-white/15 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.7)]">
            <img src={heroShots.drone} alt="Dron" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-bl from-night/70 via-transparent to-transparent" />
            <div className="absolute right-5 top-5 text-right">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Hafta tanlovi</p>
              <p className="mt-1 text-xl font-bold">DJI Mini 4 Pro</p>
              <p className="mt-2 inline-block rounded-full bg-gold-gradient px-3 py-1.5 text-sm font-extrabold text-ink">320 000 so'm / kun</p>
            </div>
          </div>

          <div className="absolute bottom-6 left-0 w-[46%] animate-float overflow-hidden rounded-[28px] bg-white p-2 text-ink shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)]">
            <img src={heroShots.camera} alt="Kamera" className="aspect-[4/3] w-full rounded-[20px] object-cover" />
            <div className="flex items-center justify-between px-2 pb-1 pt-3">
              <div>
                <p className="text-sm font-bold">Sony A7 III</p>
                <p className="text-xs text-muted">Yunusobod</p>
              </div>
              <p className="text-sm font-extrabold">250 000<span className="font-medium text-muted"> /kun</span></p>
            </div>
          </div>

          <div className="absolute bottom-0 right-6 w-[34%] animate-float-slow overflow-hidden rounded-[24px] ring-1 ring-white/15 shadow-2xl">
            <img src={heroShots.console} alt="PlayStation" className="aspect-square w-full object-cover" />
          </div>

          <div className="absolute left-0 top-[230px] flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint/20 text-mint"><ShieldCheck className="h-5 w-5" /></span>
            <div>
              <p className="text-xs text-white/60">To'lov himoyada</p>
              <p className="text-sm font-bold">Qaytarilgunga qadar</p>
            </div>
          </div>

          <div className="absolute right-[-12px] top-[330px] flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-ink shadow-2xl">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-gradient text-ink"><TrendingUp className="h-5 w-5" /></span>
            <div>
              <p className="text-xs text-muted">Oylik daromad</p>
              <p className="text-sm font-extrabold">+2 400 000 so'm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pastki egri chiziq */}
      <svg className="absolute -bottom-px left-0 w-full text-cream" viewBox="0 0 1440 60" preserveAspectRatio="none" fill="currentColor">
        <path d="M0 60V30C240 0 480 0 720 20s480 40 720 10v30H0z" />
      </svg>
    </section>
  );
}
