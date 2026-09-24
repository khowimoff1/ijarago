import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CtaBanner() {
  return (
    <section className="container-page pt-4">
      <div className="relative overflow-hidden rounded-[40px] bg-brand-gradient px-8 py-14 text-white sm:px-14">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border-[50px] border-white/10" />
        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-xl">
            <Sparkles className="h-8 w-8 text-gold" />
            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">Javonda chang bosib yotgan narsangiz bormi?</h2>
            <p className="mt-3 text-lg text-white/80">Uni bugunoq ijaraga qo'ying — birinchi e'lon 3 daqiqa oladi.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/elon-berish" className="btn-gold px-7 py-4">E'lon berish <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/katalog" className="btn-glass px-7 py-4">Katalog</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
