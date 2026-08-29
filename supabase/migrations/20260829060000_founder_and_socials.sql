alter table public.companies
  add column if not exists founder_name text,
  add column if not exists founder_photo_url text,
  add column if not exists socials jsonb not null default '[]'::jsonb;

alter table public.submissions
  add column if not exists founder_name text,
  add column if not exists founder_photo_url text,
  add column if not exists socials jsonb not null default '[]'::jsonb;
