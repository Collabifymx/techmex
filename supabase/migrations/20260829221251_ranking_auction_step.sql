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
  next_ask integer;
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

  next_ask := coalesce(slot.last_paid_cents + 1000, slot.current_price_cents);

  if p_amount < next_ask or p_amount > next_ask * 3 then
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
    current_price_cents = p_amount + 1000,
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

update public.ranking_slots
set current_price_cents = last_paid_cents + 1000
where last_paid_cents is not null;

revoke all on function public.claim_ranking_slot(smallint, text, integer, text, text) from public, anon, authenticated;
grant execute on function public.claim_ranking_slot(smallint, text, integer, text, text) to service_role;
revoke all on function internal.claim_ranking_slot(smallint, text, integer, text, text) from public, anon, authenticated;
