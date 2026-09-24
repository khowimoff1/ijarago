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

Demo kirish: istalgan telefon raqam, SMS kod — **123456**.

## Sahifalar
| Yo'l | Sahifa |
|---|---|
| `/` | Bosh sahifa: qidiruv, kategoriyalar, qanday ishlaydi, mashhur e'lonlar, daromad kalkulyatori, xavfsizlik, savollar |
| `/katalog` | Katalog: qidiruv, kategoriya/tuman/narx filtrlari, saralash |
| `/elon/:id` | E'lon sahifasi: sana tanlash, narx hisobi, egasi, sharhlar, o'xshash e'lonlar |
| `/elon-berish` | E'lon joylash formasi (jonli oldindan ko'rish bilan) |
| `/kirish` | Telefon + SMS kod orqali kirish |
| `/sevimlilar` | Saqlangan e'lonlar |

## API
| Metod | Yo'l | Tavsif |
|---|---|---|
| GET | `/api/stats` | Umumiy statistika |
| GET | `/api/categories` | Kategoriyalar (e'lonlar soni bilan) |
| GET | `/api/districts` | Tumanlar ro'yxati |
| GET | `/api/listings?q=&category=&district=&minPrice=&maxPrice=&sort=` | E'lonlar (sort: new, rating, cheap, expensive) |
| GET | `/api/listings/:id` | Bitta e'lon + sharhlar + o'xshashlar |
| POST | `/api/listings` | Yangi e'lon |
| POST | `/api/auth/send-code` | SMS kod yuborish (demo) |
| POST | `/api/auth/verify` | Kodni tekshirish |

Ma'lumotlar hozircha `server/src/data/` ichida, xotirada saqlanadi. Server qayta ishga tushsa, yangi e'lonlar o'chadi.
Keyingi qadam: MongoDB yoki PostgreSQL ulash.

## Tuzilma
```
server/src/
  index.js            Express ilova
  routes/index.js     API yo'llari
  controllers/        listing, auth, health
  data/               seed.js (namunaviy e'lonlar), store.js
client/src/
  main.jsx, App.jsx   Router
  index.css           Tailwind + ranglar (@theme)
  lib/                api.js, format.js, icons.js
  context/            AuthContext, FavoritesContext
  components/         Navbar, Footer, Logo, ListingCard, ProductVisual, SectionHeading, Layout
  components/home/    Bosh sahifa bo'limlari
  pages/              Home, Listings, ListingDetail, PostListing, Login, Favorites, NotFound
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

Eslatma: Netlify'da ma'lumotlar hali ham xotirada saqlanadi, shuning uchun yangi qo'shilgan e'lonlar vaqtincha. Doimiy saqlash uchun ma'lumotlar bazasi (masalan, Supabase yoki MongoDB Atlas) ulash kerak.
