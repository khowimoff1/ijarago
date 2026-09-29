# Ijara.go — Har narsa ijarada

Narsalarni ijaraga berish va olish platformasi.
Node.js (Express) backend + React (Vite) + Tailwind CSS v4 frontend.

## Eng oson yo'l
`ishga-tushirish.bat` faylini ikki marta bosing — kerak bo'lsa kutubxonalarni o'rnatadi va saytni ishga tushiradi.

## Qo'lda o'rnatish
```bash
npm install
npm run install:all
copy server\.env.example server\.env     # Windows
```

## Ishga tushirish
```bash
npm run dev
```
- Sayt: http://localhost:5173
- API:  http://localhost:5000/api

Kirish Telegram orqali (pastdagi "Telegram orqali kirish" bo'limiga qarang).

## Sahifalar
| Yo'l | Sahifa |
|---|---|
| `/` | Bosh sahifa: qidiruv, kategoriyalar, qanday ishlaydi, mashhur e'lonlar, daromad kalkulyatori, xavfsizlik, savollar |
| `/katalog` | Katalog: qidiruv, kategoriya/tuman/narx filtrlari, saralash |
| `/elon/:id` | E'lon sahifasi: sana tanlash, narx hisobi, egasi, sharhlar, o'xshash e'lonlar |
| `/elon-berish` | E'lon joylash formasi (jonli oldindan ko'rish bilan) |
| `/kirish` | Telegram orqali kirish |
| `/sevimlilar` | Saqlangan e'lonlar |
| `/profil` | Mening profilim (kirish shart): e'lonlarim, bandlarim, kelgan so'rovlar (tasdiqlash/rad etish), sevimlilar, sozlamalar |
| `/egasi/:id` | Egasining ochiq profili va uning e'lonlari |

`/elon-berish` va `/profil` sahifalari faqat tizimga kirgan foydalanuvchiga ochiq.

## API
| Metod | Yo'l | Tavsif |
|---|---|---|
| GET | `/api/stats` | Umumiy statistika |
| GET | `/api/categories` | Kategoriyalar (e'lonlar soni bilan) |
| GET | `/api/districts` | Tumanlar ro'yxati |
| GET | `/api/listings?q=&category=&district=&minPrice=&maxPrice=&sort=` | E'lonlar (sort: new, rating, cheap, expensive) |
| GET | `/api/listings/:id` | Bitta e'lon + sharhlar + o'xshashlar |
| POST | `/api/listings` 🔒 | Yangi e'lon |
| DELETE | `/api/listings/:id` 🔒 | E'lonni o'chirish (faqat egasi) |
| POST | `/api/auth/telegram/start` | Bot orqali kirish so'rovi yaratadi, `botUrl` qaytaradi |
| GET | `/api/auth/telegram/status/:token` | Sayt shu holatni so'raydi: `waiting_start` / `waiting_contact` / `confirmed` / `expired` |
| POST | `/api/telegram/webhook` | Telegram bot xabarlari shu yerga keladi (foydalanuvchi chaqirmaydi) |
| GET / PATCH | `/api/me` 🔒 | Mening profilim / tahrirlash (ism, tuman, bio) |
| GET | `/api/me/listings` 🔒 | Mening e'lonlarim |
| GET | `/api/me/bookings` 🔒 | Men band qilganlar |
| GET | `/api/me/requests` 🔒 | Mening buyumlarimga kelgan so'rovlar |
| GET | `/api/users/:id` | Ochiq profil + e'lonlari |
| POST | `/api/bookings` 🔒 | Band qilish so'rovi |
| PATCH | `/api/bookings/:id` 🔒 | Holatni o'zgartirish (egasi: confirmed/rejected, band qilgan: cancelled) |

🔒 — `Authorization: Bearer <token>` sarlavhasi kerak. Token `AUTH_SECRET` bilan imzolanadi (`server/.env`), productionda uni albatta o'zgartiring.

## Baza (Supabase)

`server/.env` ichida `SUPABASE_URL` va `SUPABASE_SERVICE_KEY` bo'lsa, ma'lumotlar Supabase (PostgreSQL) da saqlanadi. Bo'sh bo'lsa, xotiradagi vaqtinchalik baza ishlaydi (server o'chsa ma'lumot yo'qoladi) — lokal sinov uchun qulay.

1. supabase.com da loyiha oching.
2. **SQL Editor** ichida `supabase/schema.sql` faylini ishga tushiring.
3. **Project Settings → API** dan `Project URL` va `service_role` kalitni `server/.env` ga yozing. Bu kalit maxfiy: GitHub'ga qo'ymang, brauzerga bermang.
4. Namunaviy e'lonlarni yuklang: `npm run seed --prefix server`
5. Netlify → Environment variables ga ham xuddi shu ikkita o'zgaruvchini (Secret sifatida) qo'shing.

Jadvallarda RLS yoqilgan va siyosat yo'q, shuning uchun bazaga faqat server orqali kirish mumkin.

Yangi baza yaratganda (yoki `users.telegram_id` ustuni yo'q bo'lsa) `supabase/migrations/002_telegram_auth.sql` va `003_bot_login.sql` fayllarini ham SQL Editor'da ishga tushiring.

## Telegram orqali kirish

Kirish botga o'xshash oqim orqali amalga oshadi: foydalanuvchi "Telegram orqali kirish" tugmasini bosadi → Telegram ilovasida bot ochiladi → foydalanuvchi bitta tugma bilan telefon raqamini ulashadi → sayt avtomatik kirgan holatga o'tadi. SMS yo'q, bepul, telefon raqamni qo'lda kiritish shart emas.

1. Telegram'da **@BotFather** ga yozing, `/newbot` bilan bot yarating. Bot username **albatta** `bot` bilan tugashi kerak.
2. Berilgan tokenni `server/.env` ga `TELEGRAM_BOT_TOKEN=` va username'ni (@ belgisisiz) `TELEGRAM_BOT_USERNAME=` sifatida yozing.
3. `TELEGRAM_WEBHOOK_SECRET=` ga o'zingiz tasodifiy uzun matn o'ylab yozing (Telegram'dan kelmagan soxta so'rovlarni ajratish uchun).
4. Sayt production'ga joylangach, botga webhook manzilini bir marta ro'yxatdan o'tkazing:
   ```bash
   curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<domen>/api/telegram/webhook&secret_token=<TELEGRAM_WEBHOOK_SECRET>"
   ```
5. Netlify → Environment variables'ga `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME`, `TELEGRAM_WEBHOOK_SECRET`ni qo'shing (birinchi va uchinchisi Secret sifatida).

Foydalanuvchining ismi, Telegram username'i va (kontakt ulashilgach) telefon raqami saqlanadi (`users` jadvali). Telefon raqam hozircha API orqali qaytarilmaydi, faqat bazada saqlanadi.

## Tuzilma
```
server/src/
  index.js            Server ishga tushirish
  app.js              Express ilova (Netlify ham shuni ishlatadi)
  routes/index.js     API yo'llari
  middleware/         auth.js (token tekshiruvi)
  controllers/        listing, auth, user, booking, health
  utils/              token.js (imzolangan token), telegramBot.js (Bot API)
  data/               seed.js (namunaviy e'lonlar), repo/ (supabase.js, memory.js)
client/src/
  main.jsx, App.jsx   Router
  index.css           Tailwind + ranglar (@theme)
  lib/                api.js, session.js, format.js, icons.js, images.js
  context/            AuthContext, FavoritesContext
  components/         Navbar, Footer, Logo, Avatar, ProtectedRoute, ListingCard, ProductVisual, SectionHeading, Layout
  components/home/    Bosh sahifa bo'limlari
  pages/              Home, Listings, ListingDetail, PostListing, Login, Favorites, Profile, OwnerProfile, NotFound
```

## Netlify'ga joylash

Loyiha Netlify uchun tayyor (`netlify.toml`):
- Frontend `client/dist` papkasidan beriladi.
- Backend API `netlify/functions/api.mjs` orqali serverless funksiya sifatida ishlaydi (`/api/*`).
- React sahifalari yangilanganda 404 bo'lmasligi uchun barcha yo'llar `index.html`ga yo'naltiriladi.

Qadamlar:
1. Loyihani GitHub'ga yuklang.
2. Netlify → **Add new site → Import an existing project → GitHub** → repozitoriyani tanlang.
3. Sozlamalar `netlify.toml`dan o'zi o'qiladi — **Deploy** tugmasini bosing.

`SUPABASE_URL` va `SUPABASE_SERVICE_KEY` Netlify'ga qo'shilmagan bo'lsa, ma'lumotlar xotirada saqlanadi va har deploy'da o'chadi — production uchun yuqoridagi "Baza (Supabase)" bo'limini bajaring.
