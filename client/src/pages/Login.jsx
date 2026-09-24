import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Phone, ShieldCheck, User, Star } from 'lucide-react';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from '../components/Logo.jsx';
import { heroShots } from '../lib/images.js';

export default function Login() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('+998 ');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [hint, setHint] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const sendCode = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const r = await api.sendCode(phone);
      setHint(r.hint); setStep(2);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const verify = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const r = await api.verify({ phone, code, name });
      login(r.user);
      navigate(location.state?.from || '/');
    } catch (err) { setError(err.message); } finally { setLoading(false); }
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
          <div className="w-full max-w-sm">
            <div className="lg:hidden"><Logo /></div>
            <h1 className="mt-8 text-3xl font-extrabold tracking-tight lg:mt-0">
              {step === 1 ? 'Xush kelibsiz!' : 'SMS kodni kiriting'}
            </h1>
            <p className="mt-2 text-muted">
              {step === 1 ? 'Kirish yoki ro\'yxatdan o\'tish uchun telefon raqamingizni kiriting.' : `${phone} raqamiga 6 xonali kod yuborildi.`}
            </p>

            {step === 1 ? (
              <form onSubmit={sendCode} className="mt-8 space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ismingiz" className="input pl-11" />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67" className="input pl-11" />
                </div>
                {error && <p className="text-sm font-medium text-coral">{error}</p>}
                <button disabled={loading} className="btn-primary w-full py-4">{loading ? 'Yuborilmoqda...' : 'Kod olish'}</button>
              </form>
            ) : (
              <form onSubmit={verify} className="mt-8 space-y-4">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="• • • • • •"
                  inputMode="numeric"
                  autoFocus
                  className="input py-4 text-center text-2xl font-bold tracking-[0.5em]"
                />
                {hint && <p className="rounded-xl bg-sun-soft px-3 py-2 text-center text-xs font-semibold text-[#8a5d00]">{hint}</p>}
                {error && <p className="text-sm font-medium text-coral">{error}</p>}
                <button disabled={loading || code.length < 6} className="btn-primary w-full py-4">{loading ? 'Tekshirilmoqda...' : 'Tasdiqlash'}</button>
                <button type="button" onClick={() => { setStep(1); setCode(''); }} className="w-full text-sm font-semibold text-muted hover:text-brand-600">
                  Raqamni o'zgartirish
                </button>
              </form>
            )}

            <p className="mt-10 flex items-center gap-2 text-xs text-muted">
              <ShieldCheck className="h-4 w-4 text-mint" /> Ma'lumotlaringiz shifrlangan holda saqlanadi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
