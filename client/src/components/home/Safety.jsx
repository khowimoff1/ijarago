import { BadgeCheck, Lock, KeyRound, Star } from 'lucide-react';
import SectionHeading from '../SectionHeading.jsx';
import { heroShots } from '../../lib/images.js';

const small = [
  { icon: Lock, title: "Himoyalangan to'lov", text: 'Pul buyum qaytarilgunga qadar platformada saqlanadi.', color: 'from-[#5a1dfb] to-[#9923fb]' },
  { icon: KeyRound, title: 'Topshirish kodi', text: 'Olish va qaytarishda 6 xonali kod — tortishuvlarsiz.', color: 'from-[#fea31c] to-[#fea31c]' },
  { icon: Star, title: 'Ikki tomonlama baho', text: "Ijarachi va egasi bir-biriga baho qo'yadi — ishonch oshadi.", color: 'from-[#fee04c] to-[#fea31c]' },
];

export default function Safety() {
  return (
    <section id="xavfsizlik" className="container-page scroll-mt-24 py-24">
      <SectionHeading eyebrow="Xavfsizlik" title={<>Ishonch — <span className="text-gradient-dark">birinchi o'rinda</span></>} text="Har bir ijara to'rt bosqichli himoya bilan." />
      <div className="grid gap-5 lg:grid-cols-3 lg:grid-rows-2">
        <div className="relative min-h-[340px] overflow-hidden rounded-[32px] bg-night text-white lg:row-span-2">
          <img src={heroShots.handoff} alt="" className="absolute inset-0 h-full w-full object-cover opacity-75" />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/50 to-transparent" />
          <div className="absolute bottom-0 p-7">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-white"><BadgeCheck className="h-6 w-6" /></span>
            <h3 className="mt-5 text-2xl font-bold">Shaxsi tasdiqlangan foydalanuvchilar</h3>
            <p className="mt-2 text-white/65">Har bir foydalanuvchi pasport ma'lumotlari orqali tekshiriladi. Notanish odam emas — tasdiqlangan qo'shni.</p>
          </div>
        </div>
        {small.map((it, i) => (
          <div key={it.title} className={`card flex flex-col justify-between gap-6 p-7 transition hover:-translate-y-1 hover:shadow-lift ${i === 2 ? 'lg:col-span-2 sm:flex-row sm:items-center' : ''}`}>
            <div>
              <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${it.color} text-white shadow-lg`}><it.icon className="h-6 w-6" /></span>
              <h3 className="mt-6 text-lg font-bold">{it.title}</h3>
              <p className="mt-2 max-w-sm leading-relaxed text-muted">{it.text}</p>
            </div>
            {i === 2 && (
              <div className="flex shrink-0 items-center gap-6 rounded-3xl bg-sand/70 px-7 py-5">
                <div>
                  <p className="text-4xl font-extrabold tracking-tight">4.9</p>
                  <div className="mt-1 flex gap-0.5">{[0, 1, 2, 3, 4].map((s) => <Star key={s} className="h-3.5 w-3.5 fill-sun text-sun" />)}</div>
                </div>
                <div className="h-12 w-px bg-line" />
                <div>
                  <p className="text-4xl font-extrabold tracking-tight">2 500+</p>
                  <p className="mt-1 text-sm text-muted">tasdiqlangan sharh</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
