create schema if not exists internal;

create or replace function internal.increment_company_clicks(company_slug text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.companies
  set clicks = clicks + 1
  where slug = company_slug
    and status = 'approved';
$$;

grant usage on schema internal to anon, authenticated;
revoke all on function internal.increment_company_clicks(text) from public;
grant execute on function internal.increment_company_clicks(text) to anon, authenticated;

create or replace function public.increment_company_clicks(company_slug text)
returns void
language sql
security invoker
set search_path = public, internal
as $$
  select internal.increment_company_clicks(company_slug);
$$;

revoke all on function public.increment_company_clicks(text) from public;
grant execute on function public.increment_company_clicks(text) to anon, authenticated;
