import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { som } from '../../lib/format.js';

function Range({ label, value, display, min, max, step, onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-white/60">{label}</span>
        <span className="font-bold">{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full accent-[#9923fb]"
        style={{ background: `linear-gradient(90deg,#5a1dfb 0%,#fea31c ${pct}%,rgba(255,255,255,.12) ${pct}%)` }}
      />
    </div>
  );
}

export default function EarningsCalculator() {
  const [price, setPrice] = useState(150000);
  const [days, setDays] = useState(12);
  const monthly = price * days * 0.9;

  return (
    <section className="container-page py-8">
      <div className="relative overflow-hidden rounded-[40px] bg-night px-6 py-14 text-white sm:px-14 lg:py-20">
        <div className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-brand-600/40 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-amber/20 blur-[100px]" />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />

        <div className="relative grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow bg-white/10 text-brand-200"><span className="h-1.5 w-1.5 rounded-full bg-current" /> Daromad kalkulyatori</span>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-[44px]">
              Uyingizdagi buyum <span className="text-gradient">qancha ishlab topadi?</span>
            </h2>
            <p className="mt-5 max-w-md text-lg text-white/60">
              Kunlik narx va oyiga necha kun ijaraga berishingizni belgilang. Platforma komissiyasi — atigi 10%.
            </p>
            <Link to="/elon-berish" className="btn-gold mt-9 px-7 py-4">
              E'lon joylash <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl sm:p-9">
            <div className="space-y-8">
              <Range label="Kunlik narx" value={price} display={som(price)} min={20000} max={500000} step={10000} onChange={setPrice} />
              <Range label="Oyiga ijara kunlari" value={days} display={`${days} kun`} min={1} max={30} step={1} onChange={setDays} />
            </div>
            <div className="mt-9 flex items-end justify-between gap-4 border-t border-white/10 pt-7">
              <div>
                <p className="text-sm text-white/50">Oylik taxminiy daromad</p>
                <p className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl"><span className="text-gradient">{som(monthly)}</span></p>
                <p className="mt-2 text-sm text-white/40">Yiliga: {som(monthly * 12)}</p>
              </div>
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gold-gradient text-ink shadow-gold"><TrendingUp className="h-6 w-6" /></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
