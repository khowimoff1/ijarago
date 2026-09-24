import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api.js';
import { som } from '../lib/format.js';
import { useAuth } from '../context/AuthContext.jsx';
import ProductVisual from '../components/ProductVisual.jsx';

const empty = { title: '', category: '', pricePerDay: '', deposit: '', district: '', minDays: 1, description: '' };

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export default function PostListing() {
  const [form, setForm] = useState(empty);
  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.categories().then(setCategories).catch(() => {});
    api.districts().then(setDistricts).catch(() => {});
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.category || !form.pricePerDay || !form.district) {
      setError("Iltimos, * belgili maydonlarni to'ldiring");
      return;
    }
    setLoading(true);
    try {
      const created = await api.createListing({ ...form, ownerName: user?.name });
      navigate(`/elon/${created.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const preview = {
    title: form.title || "E'lon nomi",
    category: form.category,
    pricePerDay: Number(form.pricePerDay) || 0,
    district: form.district || 'Tuman',
  };

  return (
    <div className="container-page py-10">
      <div className="mb-10 max-w-2xl">
        <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-current" /> Bepul</span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">E'lon joylash</h1>
        <p className="mt-2 text-muted">Buyumingiz haqida ma'lumot bering — e'lon darhol katalogda paydo bo'ladi.</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <form onSubmit={submit} className="card space-y-6 p-6 sm:p-8">
          <div className="grid h-36 place-items-center rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/50 text-center text-brand-600">
            <div>
              <ImagePlus className="mx-auto h-8 w-8" />
              <p className="mt-2 text-sm font-medium">Rasm yuklash (tez orada)</p>
            </div>
          </div>

          <Field label="Nomi *">
            <input value={form.title} onChange={set('title')} placeholder="Masalan: Canon EOS R6 kamera" className="input" />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Kategoriya *">
              <select value={form.category} onChange={set('category')} className="input">
                <option value="">Tanlang</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Tuman *">
              <select value={form.district} onChange={set('district')} className="input">
                <option value="">Tanlang</option>
                {districts.map((d) => <option key={d}>{d}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Kunlik narx *" hint="so'mda">
              <input type="number" min="0" value={form.pricePerDay} onChange={set('pricePerDay')} placeholder="100000" className="input" />
            </Field>
            <Field label="Garov" hint="qaytariladigan summa">
              <input type="number" min="0" value={form.deposit} onChange={set('deposit')} placeholder="500000" className="input" />
            </Field>
            <Field label="Minimal muddat" hint="kun">
              <input type="number" min="1" value={form.minDays} onChange={set('minDays')} className="input" />
            </Field>
          </div>

          <Field label="Tavsif">
            <textarea rows="5" value={form.description} onChange={set('description')} placeholder="Holati, komplekti, olish shartlari..." className="input resize-none" />
          </Field>

          {error && <p className="rounded-xl bg-[#fde6e0] px-4 py-3 text-sm font-medium text-coral">{error}</p>}

          <button disabled={loading} className="btn-primary w-full py-3.5">
            {loading ? 'Yuborilmoqda...' : "E'lonni joylash"}
          </button>
        </form>

        <aside className="space-y-6">
          <div className="sticky top-24 space-y-6">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-muted">Oldindan ko'rish</p>
              <div className="card p-3">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl"><ProductVisual item={preview} /></div>
                <div className="px-1 pb-1 pt-3">
                  <p className="font-semibold">{preview.title}</p>
                  <p className="text-sm text-muted">{preview.district}</p>
                  <p className="mt-1 font-extrabold">{som(preview.pricePerDay)}<span className="font-medium text-muted"> / kun</span></p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-brand-100 bg-brand-50 p-6">
              <h3 className="font-bold text-brand-900">Yaxshi e'lon uchun maslahatlar</h3>
              <ul className="mt-3 space-y-2 text-sm text-brand-900/80">
                {["Aniq nom: brend va model", "Komplektni to'liq yozing", "Bozor narxidan 3–5% kunlik narx qo'ying", "Garovni buyum qiymatining 30–50% qiling"].map((t) => (
                  <li key={t} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
