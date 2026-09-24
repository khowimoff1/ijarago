import { useState } from 'react';
import { Search, CalendarCheck, KeyRound, Camera, Wallet, Handshake, Check } from 'lucide-react';
import SectionHeading from '../SectionHeading.jsx';
import { heroShots } from '../../lib/images.js';

const flows = {
  olish: {
    image: heroShots.people,
    steps: [
      { icon: Search, title: 'Toping', text: "Yaqin atrofdagi e'lonlarni kategoriya, narx va tuman bo'yicha saralang." },
      { icon: CalendarCheck, title: 'Band qiling', text: "Sanalarni tanlang va to'lang. Pul egasiga buyum qaytgandan keyin o'tadi." },
      { icon: KeyRound, title: 'Oling va qaytaring', text: "6 xonali kod bilan buyumni oling, muddati tugagach qaytaring va baho qo'ying." },
    ],
    perks: ["Sotib olishdan 10–20 barobar arzon", 'Garov qaytariladi', "Har bir e'lon tekshirilgan"],
  },
  berish: {
    image: heroShots.handoff,
    steps: [
      { icon: Camera, title: "E'lon joylang", text: 'Buyumni suratga oling, kunlik narx va garov summasini belgilang — 3 daqiqa.' },
      { icon: Handshake, title: "So'rovni qabul qiling", text: "Tasdiqlangan foydalanuvchilar profilini ko'rib, so'rovni qabul qiling." },
      { icon: Wallet, title: 'Daromad oling', text: 'Buyum qaytgach, pul hamyoningizga tushadi — kartaga istalgan vaqtda yeching.' },
    ],
    perks: ["E'lon joylash bepul", 'Garov sizni himoya qiladi', 'Pul kartaga 1 kunda'],
  },
};

export default function HowItWorks() {
  const [tab, setTab] = useState('olish');
  const f = flows[tab];

  return (
    <section id="qanday" className="scroll-mt-24 py-24">
      <div className="container-page">
        <SectionHeading center eyebrow="Qanday ishlaydi" title="Uch qadamda tayyor" text="Ijaraga olish ham, berish ham oddiy va shaffof." />

        <div className="mx-auto mb-12 flex w-fit rounded-full border border-line bg-white p-1.5 shadow-soft">
          {[['olish', 'Ijaraga olaman'], ['berish', 'Ijaraga beraman']].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`rounded-full px-6 py-2.5 text-sm font-bold transition ${tab === k ? 'bg-brand-gradient text-white shadow-glow' : 'text-muted hover:text-ink'}`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 rounded-[40px] bg-brand-gradient opacity-20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[32px]">
              <img key={f.image} src={f.image} alt="" className="aspect-[5/4] w-full animate-fade-up object-cover" />
            </div>
            <div className="absolute -bottom-6 left-6 right-6 rounded-3xl border border-line bg-white/95 p-5 shadow-lift backdrop-blur sm:left-auto sm:w-72">
              <ul className="space-y-2.5">
                {f.perks.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm font-semibold">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-mint text-white"><Check className="h-3 w-3" strokeWidth={3} /></span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="order-1 space-y-4 lg:order-2">
            {f.steps.map((s, i) => (
              <div key={s.title} className="group relative flex gap-5 rounded-3xl border border-line bg-white p-6 shadow-soft transition hover:border-brand-100 hover:shadow-lift">
                <div className="relative">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
                    <s.icon className="h-6 w-6" />
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-500">{i + 1}-qadam</p>
                  <h3 className="mt-1 text-xl font-bold">{s.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-muted">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
