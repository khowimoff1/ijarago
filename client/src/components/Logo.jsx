import { Link } from 'react-router-dom';

// Logodagi ikonka — vektor ko'rinishida (har qanday o'lchamda tiniq)
export function LogoMark({ className = 'h-10 w-10' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ig-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9923fb" />
          <stop offset="0.5" stopColor="#4a1bfc" />
          <stop offset="1" stopColor="#2e14ed" />
        </linearGradient>
        <linearGradient id="ig-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fee04c" />
          <stop offset="1" stopColor="#fea31c" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="27" fill="url(#ig-bg)" />
      <circle cx="31" cy="21.5" r="9.6" fill="#fff" />
      <rect x="18.7" y="34.3" width="24.4" height="52" rx="12.2" fill="#fff" />
      <rect x="47" y="34.2" width="35.4" height="16.6" rx="8.3" fill="url(#ig-gold)" />
      <rect x="47" y="57.2" width="35.4" height="16.6" rx="8.3" fill="url(#ig-gold)" />
    </svg>
  );
}

export default function Logo({ light = false, tagline = false, size = 'md' }) {
  const mark = size === 'lg' ? 'h-12 w-12' : 'h-10 w-10';
  const text = size === 'lg' ? 'text-[30px]' : 'text-[25px]';
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="Ijara.go — bosh sahifa">
      <LogoMark className={`${mark} shrink-0 drop-shadow-[0_6px_14px_rgba(74,27,252,0.35)] transition duration-300 group-hover:-rotate-6`} />
      <span className="flex flex-col leading-none">
        <span className={`font-logo ${text} font-black tracking-[-0.02em] ${light ? 'text-white' : 'text-ink'}`}>
          Ijara<span className={light ? 'text-[#b99bff]' : 'text-[#6d33f0]'}>.go</span>
        </span>
        {tagline && (
          <span className={`mt-1 text-[13px] font-medium tracking-wide ${light ? 'text-white/60' : 'text-muted'}`}>Har narsa ijarada</span>
        )}
      </span>
    </Link>
  );
}
