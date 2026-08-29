create table if not exists public.ranking_slots (
  place smallint primary key check (place in (1, 2, 3)),
  company_slug text references public.companies (slug),
  current_price_cents integer not null default 10000 check (current_price_cents >= 10000),
  last_paid_cents integer,
  buyer_email text,
  stripe_session_id text,
  purchased_at timestamptz
);

insert into public.ranking_slots (place)
values (1), (2), (3)
on conflict (place) do nothing;

create table if not exists public.ranking_bids (
  id uuid primary key default gen_random_uuid(),
  place smallint not null check (place in (1, 2, 3)),
  company_slug text not null,
  amount_cents integer not null check (amount_cents >= 10000),
  email text not null,
  stripe_session_id text unique,
  status text not null default 'pending' check (status in ('pending', 'paid', 'expired')),
  created_at timestamptz not null default now()
);

alter table public.ranking_slots enable row level security;
alter table public.ranking_bids enable row level security;

drop policy if exists ranking_slots_public_read on public.ranking_slots;
create policy ranking_slots_public_read
  on public.ranking_slots for select
  to anon, authenticated
  using (true);

create or replace function internal.claim_ranking_slot(
  p_place smallint,
  p_slug text,
  p_amount integer,
  p_email text,
  p_session text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  slot public.ranking_slots%rowtype;
begin
  if exists (
    select 1
    from public.ranking_bids
    where stripe_session_id = p_session
      and status = 'paid'
  ) then
    return true;
  end if;

  select * into slot
  from public.ranking_slots
  where place = p_place
  for update;

  if not found then
    return false;
  end if;

  if p_amount < slot.current_price_cents or p_amount > slot.current_price_cents * 3 then
    return false;
  end if;

  if not exists (
    select 1
    from public.companies
    where slug = p_slug
      and status = 'approved'
  ) then
    return false;
  end if;

  update public.ranking_slots
  set
    company_slug = p_slug,
    current_price_cents = p_amount,
    last_paid_cents = p_amount,
    buyer_email = p_email,
    stripe_session_id = p_session,
    purchased_at = now()
  where place = p_place;

  insert into public.ranking_bids (
    place, company_slug, amount_cents, email, stripe_session_id, status
  ) values (
    p_place, p_slug, p_amount, p_email, p_session, 'paid'
  )
  on conflict (stripe_session_id) do update
    set status = 'paid';

  return true;
end;
$$;

revoke all on function internal.claim_ranking_slot(smallint, text, integer, text, text) from public;

create or replace function public.claim_ranking_slot(
  p_place smallint,
  p_slug text,
  p_amount integer,
  p_email text,
  p_session text
)
returns boolean
language sql
security definer
set search_path = public, internal
as $$
  select internal.claim_ranking_slot(p_place, p_slug, p_amount, p_email, p_session);
$$;

revoke all on function public.claim_ranking_slot(smallint, text, integer, text, text) from public;
grant execute on function public.claim_ranking_slot(smallint, text, integer, text, text) to service_role;
