import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, ShieldCheck, Star } from 'lucide-react';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from '../components/Logo.jsx';
import { heroShots } from '../lib/images.js';

const POLL_MS = 2000;

export default function Login() {
  const [state, setState] = useState('idle'); // idle | waiting | expired | error
  const [botUrl, setBotUrl] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pollRef = useRef(null);

  const stopPolling = () => { clearInterval(pollRef.current); pollRef.current = null; };
  useEffect(() => () => stopPolling(), []);

  const start = async () => {
    setError(''); setState('waiting');
    try {
      const r = await api.telegramLoginStart();
      setBotUrl(r.botUrl);
      window.open(r.botUrl, '_blank', 'noopener');

      pollRef.current = setInterval(async () => {
        try {
          const s = await api.telegramLoginStatus(r.token);
          if (s.status === 'confirmed') {
            stopPolling();
            login(s);
            navigate(location.state?.from || '/');
          } else if (s.status === 'expired') {
            stopPolling();
            setState('expired');
          }
        } catch {
          stopPolling();
          setState('error');
          setError('Holatni tekshirishda xatolik. Qaytadan urining');
        }
      }, POLL_MS);
    } catch (err) {
      setState('error');
      setError(err.message);
    }
  };

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

            <div className="mt-8">
              {state === 'idle' && (
                <button onClick={start} className="btn-primary w-full py-4">
                  <Send className="h-4 w-4" /> Telegram orqali kirish
                </button>
              )}
              {state === 'waiting' && (
                <div className="space-y-3">
                  <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">
                    Telegram ochildi. U yerda botni ishga tushirib, raqamingizni ulashing.
                  </p>
                  <a href={botUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-brand-600 hover:underline">
                    Telegram ochilmadimi? Shu yerni bosing
                  </a>
                </div>
              )}
              {state === 'expired' && (
                <div className="space-y-3">
                  <p className="rounded-xl bg-sun-soft px-4 py-3 text-sm font-medium text-[#8a5d00]">
                    Vaqt tugadi. Qaytadan urining
                  </p>
                  <button onClick={start} className="btn-primary w-full py-4">Qaytadan urinish</button>
                </div>
              )}
              {state === 'error' && (
                <div className="space-y-3">
                  {error && <p className="text-sm font-medium text-coral">{error}</p>}
                  <button onClick={start} className="btn-primary w-full py-4">Qaytadan urinish</button>
                </div>
              )}
            </div>

            <p className="mt-10 flex items-center justify-center gap-2 text-xs text-muted">
              <ShieldCheck className="h-4 w-4 text-mint" /> Ma'lumotlaringiz Telegram orqali xavfsiz tasdiqlanadi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
