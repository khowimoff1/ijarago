-- Ijara.go bazasi. Supabase -> SQL Editor ichida bir marta ishga tushiring.
-- Barcha jadvallarda RLS yoqilgan va siyosat yo'q: ma'lumotga faqat server (service_role kalit) kira oladi.

create table if not exists categories (
  id   text primary key,
  name text not null,
  icon text,
  image text
);

create table if not exists users (
  id         text primary key default gen_random_uuid()::text,
  phone      text not null unique,
  name       text not null,
  bio        text not null default '',
  district   text not null default '',
  verified   boolean not null default false,
  rating     numeric(2,1) not null default 0,
  deals      integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists listings (
  id            text primary key default gen_random_uuid()::text,
  title         text not null,
  category      text not null references categories(id),
  price_per_day integer not null check (price_per_day > 0),
  deposit       integer not null default 0 check (deposit >= 0),
  city          text not null default 'Toshkent',
  district      text not null,
  description   text not null default '',
  min_days      integer not null default 1 check (min_days >= 1),
  condition     text not null default 'Yaxshi',
  features      text[] not null default '{}',
  images        text[] not null default '{}',
  rating        numeric(2,1) not null default 0,
  reviews_count integer not null default 0,
  owner_id      text not null references users(id) on delete cascade,
  created_at    timestamptz not null default now()
);
create index if not exists listings_owner_idx    on listings(owner_id);
create index if not exists listings_category_idx on listings(category);
create index if not exists listings_created_idx  on listings(created_at desc);

create table if not exists reviews (
  id         text primary key default gen_random_uuid()::text,
  listing_id text not null references listings(id) on delete cascade,
  author     text not null,
  rating     integer not null check (rating between 1 and 5),
  text       text not null,
  date       date not null default current_date
);
create index if not exists reviews_listing_idx on reviews(listing_id);

create table if not exists bookings (
  id          text primary key default gen_random_uuid()::text,
  listing_id  text not null references listings(id) on delete cascade,
  owner_id    text not null references users(id) on delete cascade,
  renter_id   text not null references users(id) on delete cascade,
  renter_name text not null,
  date_from   date not null,
  date_to     date not null,
  days        integer not null check (days >= 1),
  total       integer not null,
  status      text not null default 'pending' check (status in ('pending','confirmed','rejected','cancelled')),
  created_at  timestamptz not null default now()
);
create index if not exists bookings_owner_idx  on bookings(owner_id);
create index if not exists bookings_renter_idx on bookings(renter_id);

create table if not exists login_codes (
  phone      text primary key,
  code       text not null,
  expires_at timestamptz not null
);

alter table categories  enable row level security;
alter table users       enable row level security;
alter table listings    enable row level security;
alter table reviews     enable row level security;
alter table bookings    enable row level security;
alter table login_codes enable row level security;
