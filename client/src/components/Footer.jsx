import { Link } from 'react-router-dom';
import { Send, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import Logo from './Logo.jsx';

export default function Footer() {
  return (
    <footer className="relative mt-28 overflow-hidden bg-night text-white/70">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[700px] -translate-x-1/2 rounded-full bg-brand-600/25 blur-[120px]" />
      <div className="container-page relative grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo light tagline />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
            Kerakli narsani sotib olmasdan, yaqin atrofdagilardan ijaraga oling. Uyda turgan buyumlaringiz esa sizga daromad keltirsin.
          </p>
          <div className="mt-6 flex gap-2">
            {[Send, Instagram, Youtube].map((I, i) => (
              <a key={i} href="#" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 transition hover:bg-brand-gradient hover:text-white">
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="md:col-span-3">
          <h4 className="mb-4 text-sm font-bold text-white">Platforma</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/katalog" className="hover:text-white">Katalog</Link></li>
            <li><Link to="/elon-berish" className="hover:text-white">E'lon berish</Link></li>
            <li><Link to="/sevimlilar" className="hover:text-white">Sevimlilar</Link></li>
            <li><Link to="/kirish" className="hover:text-white">Kirish</Link></li>
          </ul>
        </div>
        <div className="md:col-span-4">
          <h4 className="mb-4 text-sm font-bold text-white">Aloqa</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-brand-400" /> +998 (71) 000-00-00</li>
            <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-brand-400" /> info@ijarago.uz</li>
            <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-brand-400" /> Toshkent, O'zbekiston</li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="container-page flex flex-col justify-between gap-2 py-6 text-xs text-white/40 sm:flex-row">
          <span>© {new Date().getFullYear()} Ijara.go. Barcha huquqlar himoyalangan.</span>
          <span>Foydalanish shartlari · Maxfiylik siyosati</span>
        </div>
      </div>
    </footer>
  );
}
