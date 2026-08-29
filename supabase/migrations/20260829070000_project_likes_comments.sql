create table if not exists public.project_comments (
  id uuid primary key default gen_random_uuid(),
  company_slug text not null references public.companies (slug) on delete cascade,
  author text not null,
  body text not null,
  created_at timestamptz not null default now(),
  constraint project_comments_author_len check (char_length(author) between 1 and 60),
  constraint project_comments_body_len check (char_length(body) between 1 and 500)
);

alter table public.project_comments enable row level security;

create policy "project_comments_public_read"
  on public.project_comments for select
  to anon, authenticated
  using (true);

create policy "project_comments_public_insert"
  on public.project_comments for insert
  to anon, authenticated
  with check (true);

create or replace function internal.increment_company_likes(company_slug text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.companies
  set likes = likes + 1
  where slug = company_slug
    and status = 'approved';
$$;

revoke all on function internal.increment_company_likes(text) from public;
grant execute on function internal.increment_company_likes(text) to anon, authenticated;

create or replace function public.increment_company_likes(company_slug text)
returns void
language sql
security invoker
set search_path = public, internal
as $$
  select internal.increment_company_likes(company_slug);
$$;

revoke all on function public.increment_company_likes(text) from public;
grant execute on function public.increment_company_likes(text) to anon, authenticated;
