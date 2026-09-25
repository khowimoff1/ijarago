import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Menu, Plus, X, LogOut } from 'lucide-react';
import Logo from './Logo.jsx';
import Avatar from './Avatar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';

const links = [
  { to: '/katalog', label: 'Katalog' },
  { to: '/#qanday', label: 'Qanday ishlaydi' },
  { to: '/#xavfsizlik', label: 'Xavfsizlik' },
  { to: '/#savollar', label: 'Savollar' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { ids } = useFavorites();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Bosh sahifaning yuqorisida — shaffof, to'q fon ustida oq matn
  const onDark = pathname === '/' && !scrolled && !open;

  const go = (to) => {
    setOpen(false);
    if (to.startsWith('/#')) {
      navigate('/');
      setTimeout(() => document.getElementById(to.slice(2))?.scrollIntoView({ behavior: 'smooth' }), 60);
    } else navigate(to);
  };

  const linkCls = (active) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      onDark
        ? active ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
        : active ? 'bg-brand-50 text-brand-700' : 'text-muted hover:bg-sand hover:text-ink'
    }`;

  const iconBtn = `relative grid h-10 w-10 place-items-center rounded-full transition ${
    onDark ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-sand'
  }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        onDark ? 'bg-transparent' : 'border-b border-line/70 bg-white/80 shadow-soft backdrop-blur-xl'
      }`}
    >
      <div className="container-page flex h-[72px] items-center justify-between gap-4">
        <Logo light={onDark} />

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) =>
            l.to.startsWith('/#') ? (
              <button key={l.to} onClick={() => go(l.to)} className={linkCls(false)}>{l.label}</button>
            ) : (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => linkCls(isActive)}>{l.label}</NavLink>
            )
          )}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link to="/sevimlilar" className={iconBtn} aria-label="Sevimlilar">
            <Heart className="h-5 w-5" />
            {ids.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-amber px-1 text-[11px] font-bold text-white ring-2 ring-white">
                {ids.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-1 sm:flex">
              <Link to="/profil" className={`flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm font-semibold transition ${onDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-sand hover:bg-brand-50'}`}>
                <Avatar name={user.name} className="h-8 w-8 text-xs" />
                {user.name}
              </Link>
              <button onClick={logout} className={iconBtn} aria-label="Chiqish"><LogOut className="h-4 w-4" /></button>
            </div>
          ) : (
            <Link to="/kirish" className={`hidden rounded-full px-4 py-2 text-sm font-semibold sm:inline-flex ${onDark ? 'text-white hover:bg-white/10' : 'hover:bg-sand'}`}>
              Kirish
            </Link>
          )}

          <Link to="/elon-berish" className="btn-primary ml-1 hidden py-2.5 sm:inline-flex">
            <Plus className="h-4 w-4" /> E'lon berish
          </Link>

          <button onClick={() => setOpen(!open)} className={`${iconBtn} lg:hidden`} aria-label="Menyu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-white lg:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {links.map((l) => (
              <button key={l.to} onClick={() => go(l.to)} className="rounded-2xl px-4 py-3 text-left font-semibold hover:bg-sand">{l.label}</button>
            ))}
            {user ? (
              <>
                <button onClick={() => go('/profil')} className="rounded-2xl px-4 py-3 text-left font-semibold hover:bg-sand">Profil ({user.name})</button>
                <button onClick={() => { logout(); setOpen(false); navigate('/'); }} className="rounded-2xl px-4 py-3 text-left font-semibold hover:bg-sand">Chiqish</button>
              </>
            ) : (
              <button onClick={() => go('/kirish')} className="rounded-2xl px-4 py-3 text-left font-semibold hover:bg-sand">Kirish</button>
            )}
            <button onClick={() => go('/elon-berish')} className="btn-primary mt-2"><Plus className="h-4 w-4" /> E'lon berish</button>
          </div>
        </div>
      )}
    </header>
  );
}
