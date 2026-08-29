alter table public.companies
  add column if not exists founder_photo_url text;

alter table public.submissions
  add column if not exists founder_photo_url text;
