import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { api } from '../../lib/api.js';
import { categoryIcons, getCategoryTheme, FallbackIcon } from '../../lib/icons.js';
import SectionHeading from '../SectionHeading.jsx';

// Bento panjara uchun katak o'lchamlari
const spans = [
  'sm:col-span-2 lg:row-span-2 min-h-[300px] lg:min-h-0',
  'min-h-[220px] lg:min-h-0',
  'min-h-[220px] lg:min-h-0',
  'min-h-[220px] lg:min-h-0',
  'min-h-[220px] lg:min-h-0',
];

function PhotoTile({ c, className }) {
  const Icon = categoryIcons[c.icon] || FallbackIcon;
  return (
    <Link to={`/katalog?category=${c.id}`} className={`group relative overflow-hidden rounded-[28px] bg-night ${className}`}>
      {c.image && <img src={c.image} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />}
      <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
        <div>
          <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-md">
            <Icon className="h-5 w-5" />
          </span>
          <p className="text-lg font-bold leading-tight">{c.name}</p>
          <p className="mt-0.5 text-sm text-white/60">{c.count} ta e'lon</p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-ink transition duration-300 group-hover:rotate-45 group-hover:bg-brand-gradient group-hover:text-white">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

export default function Categories() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.categories().then(setItems).catch(() => {}); }, []);

  const featured = items.slice(0, 5);
  const rest = items.slice(5);

  return (
    <section className="container-page py-24">
      <SectionHeading
        eyebrow="Kategoriyalar"
        title={<>Nimani <span className="text-gradient-dark">qidiryapsiz?</span></>}
        text="Eng ko'p ijaraga olinadigan yo'nalishlar — texnikadan tortib dam olish jihozlarigacha."
        action={<Link to="/katalog" className="btn-ghost">Hammasini ko'rish <ArrowUpRight className="h-4 w-4" /></Link>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[220px_220px]">
        {featured.map((c, i) => <PhotoTile key={c.id} c={c} className={spans[i]} />)}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {rest.map((c) => {
          const t = getCategoryTheme(c.id);
          const Icon = categoryIcons[c.icon] || FallbackIcon;
          return (
            <Link key={c.id} to={`/katalog?category=${c.id}`} className="group card flex flex-auto items-center gap-3 rounded-2xl py-2.5 pl-2.5 pr-5 transition hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-lift">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${t.bg} ${t.fg}`}>
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div className="min-w-0">
                <p className="whitespace-nowrap text-sm font-bold">{c.name}</p>
                <p className="text-xs text-muted">{c.count} ta</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
