import { useState } from 'react';
import { Plus, MessageCircle } from 'lucide-react';
import SectionHeading from '../SectionHeading.jsx';

const faqs = [
  ["Buyum buzilib qolsa nima bo'ladi?", "Har bir e'londa garov summasi belgilanadi. Zarar yetkazilsa, u garovdan qoplanadi. Nizoli holatlarni qo'llab-quvvatlash xizmati ko'rib chiqadi."],
  ["To'lov qanday amalga oshiriladi?", "Uzcard, Humo yoki Visa kartasi orqali. Pul egasiga faqat buyum qaytarilib, ikkala tomon tasdiqlagandan keyin o'tkaziladi."],
  ["E'lon joylash pullikmi?", "Yo'q, e'lon joylash bepul. Faqat muvaffaqiyatli ijaradan 10% komissiya olinadi."],
  ['Minimal ijara muddati qancha?', "Odatda 1 kun. Ba'zi egalar minimal muddatni o'zi belgilaydi — bu e'londa ko'rsatiladi."],
  ['Buyumni qanday olaman?', "Egasi bilan kelishilgan joyda uchrashasiz. Buyumni tekshirib, ilovadagi 6 xonali kodni aytasiz — ijara boshlanadi."],
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="savollar" className="container-page scroll-mt-24 py-24">
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div className="lg:sticky lg:top-28">
          <SectionHeading eyebrow="Savollar" title="Ko'p so'raladigan savollar" text="Javob topmadingizmi? Bizga yozing — odatda 10 daqiqada javob beramiz." />
          <a href="#" className="btn-ghost -mt-4"><MessageCircle className="h-4 w-4" /> Qo'llab-quvvatlash</a>
        </div>
        <div className="space-y-3">
          {faqs.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={q} className={`rounded-3xl border bg-white transition ${isOpen ? 'border-brand-200 shadow-lift' : 'border-line shadow-soft'}`}>
                <button onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-[16px] font-bold">
                  {q}
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition ${isOpen ? 'rotate-45 bg-brand-gradient text-white' : 'bg-sand text-ink'}`}>
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
                {isOpen && <p className="-mt-1 px-6 pb-6 leading-relaxed text-muted">{a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
