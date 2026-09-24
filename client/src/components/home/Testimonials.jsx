import { Star, Quote } from 'lucide-react';
import SectionHeading from '../SectionHeading.jsx';

const items = [
  { name: 'Otabek R.', role: 'Videograf', text: "To'y uchun kamera sotib olishim kerak edi — ijarada 10 baravar arzonga tushdi. Egasi hammasini tushuntirib berdi.", color: 'from-[#5a1dfb] to-[#fea31c]' },
  { name: 'Nigora S.', role: 'Egasi · 31 ta ijara', text: "Dronim yil bo'yi javonda turardi. Endi har oy qo'shimcha daromad keltiryapti, pul kartaga o'z vaqtida tushadi.", color: 'from-[#22c3ee] to-[#5a1dfb]' },
  { name: 'Bekzod A.', role: 'Talaba', text: "Dam olish kunlari do'stlar bilan PS5 oldik. Band qilish 2 daqiqa, olish va qaytarish kod orqali — juda qulay.", color: 'from-[#fee04c] to-[#ff7a1a]' },
];

export default function Testimonials() {
  return (
    <section className="container-page py-24">
      <SectionHeading center eyebrow="Fikrlar" title="Foydalanuvchilarimiz nima deydi" />
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((t, i) => (
          <figure key={t.name} className={`card relative flex flex-col p-7 ${i === 1 ? 'md:-translate-y-6' : ''}`}>
            <Quote className="absolute right-6 top-6 h-10 w-10 text-brand-100" />
            <div className="flex gap-0.5">{[0, 1, 2, 3, 4].map((s) => <Star key={s} className="h-4 w-4 fill-sun text-sun" />)}</div>
            <blockquote className="mt-5 flex-1 text-[17px] leading-relaxed">“{t.text}”</blockquote>
            <figcaption className="mt-7 flex items-center gap-3 border-t border-line pt-5">
              <span className={`grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br ${t.color} font-bold text-white`}>{t.name[0]}</span>
              <div>
                <p className="font-bold">{t.name}</p>
                <p className="text-sm text-muted">{t.role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
