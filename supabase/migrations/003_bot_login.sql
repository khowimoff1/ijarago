-- Bot orqali kirish uchun. Supabase -> SQL Editor ichida bir marta ishga tushiring.
create table if not exists pending_logins (
  token      text primary key,
  status     text not null default 'waiting_start' check (status in ('waiting_start','waiting_contact','confirmed','expired')),
  chat_id    bigint,
  user_id    text references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create index if not exists pending_logins_chat_idx on pending_logins(chat_id);

alter table pending_logins enable row level security;

drop table if exists login_codes;
