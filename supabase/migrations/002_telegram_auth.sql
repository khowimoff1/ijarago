-- Telegram orqali kirishga o'tish. Supabase -> SQL Editor ichida bir marta ishga tushiring.
alter table users add column if not exists telegram_id bigint unique;
alter table users add column if not exists telegram_username text;
alter table users alter column phone drop not null;
