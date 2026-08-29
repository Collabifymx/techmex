create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  url text not null,
  category text not null,
  tags text[] not null default '{}',
  city text not null,
  clicks integer not null default 0,
  likes integer not null default 0,
  created_at date not null,
  initials text not null,
  icon_bg text not null,
  rank_score integer not null default 0,
  status text not null default 'approved'
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  url text not null,
  tags text[] not null default '{}',
  city text not null,
  venue text,
  starts_at date not null,
  ends_at date,
  time text not null,
  price text not null,
  organizer text not null,
  format text not null
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  email text not null,
  description text,
  category text,
  created_at timestamptz not null default now(),
  status text not null default 'pending'
);

alter table public.companies enable row level security;
alter table public.events enable row level security;
alter table public.submissions enable row level security;

create policy "companies_public_read"
  on public.companies for select
  to anon, authenticated
  using (status = 'approved');

create policy "events_public_read"
  on public.events for select
  to anon, authenticated
  using (true);

create policy "submissions_public_insert"
  on public.submissions for insert
  to anon, authenticated
  with check (true);
