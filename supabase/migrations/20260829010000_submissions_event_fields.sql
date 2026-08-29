alter table public.submissions
  add column if not exists kind text not null default 'project',
  add column if not exists venue text,
  add column if not exists address text,
  add column if not exists city text,
  add column if not exists starts_at date,
  add column if not exists starts_time text,
  add column if not exists og_image text,
  add column if not exists format text,
  add column if not exists price text;

alter table public.submissions drop constraint if exists submissions_kind_check;
alter table public.submissions
  add constraint submissions_kind_check check (kind in ('project', 'event'));
