import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Star } from 'lucide-react';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from '../components/Logo.jsx';
import { heroShots } from '../lib/images.js';

const BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME;

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const widgetRef = useRef(null);

  useEffect(() => {
    window.onTelegramAuth = async (tgUser) => {
      setError(''); setLoading(true);
      try {
        const r = await api.telegramAuth(tgUser);
        login(r);
        navigate(location.state?.from || '/');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (BOT_USERNAME && widgetRef.current) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.async = true;
      script.setAttribute('data-telegram-login', BOT_USERNAME.replace(/^@/, ''));
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.setAttribute('data-request-access', 'write');
      widgetRef.current.appendChild(script);
    }
    return () => { delete window.onTelegramAuth; };
  }, []);

  return (
    <div className="container-page py-10">
      <div className="grid overflow-hidden rounded-[36px] border border-line bg-white shadow-lift lg:grid-cols-2">
        <div className="relative hidden min-h-[600px] bg-night lg:block">
          <img src={heroShots.people} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-700/70 via-night/60 to-amber/30" />
          <div className="relative flex h-full flex-col justify-between p-10 text-white">
            <Logo light tagline />
            <div>
              <div className="flex gap-0.5">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-5 w-5 fill-sun text-sun" />)}</div>
              <p className="mt-4 text-2xl font-bold leading-snug">“Kamerani ijaraga olib, to'yni suratga oldim. Sotib olishdan 10 baravar arzonga tushdi.”</p>
              <p className="mt-4 text-white/70">Otabek R. · Videograf</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-8 sm:p-14">
          <div className="w-full max-w-sm text-center">
            <div className="lg:hidden"><Logo /></div>
            <h1 className="mt-8 text-3xl font-extrabold tracking-tight lg:mt-0">Xush kelibsiz!</h1>
            <p className="mt-2 text-muted">Kirish yoki ro'yxatdan o'tish uchun Telegram orqali tasdiqlang.</p>

            <div className="mt-8 flex min-h-16 items-center justify-center">
              {loading ? (
                <p className="font-semibold text-muted">Tekshirilmoqda...</p>
              ) : BOT_USERNAME ? (
                <div ref={widgetRef} className="overflow-hidden rounded-full" />
              ) : (
                <p className="rounded-xl bg-[#fde6e0] px-4 py-3 text-sm font-medium text-coral">
                  Telegram kirish hali sozlanmagan (VITE_TELEGRAM_BOT_USERNAME yo'q)
                </p>
              )}
            </div>
            {error && <p className="mt-4 text-sm font-medium text-coral">{error}</p>}

            <p className="mt-10 flex items-center justify-center gap-2 text-xs text-muted">
              <ShieldCheck className="h-4 w-4 text-mint" /> Ma'lumotlaringiz Telegram orqali xavfsiz tasdiqlanadi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
