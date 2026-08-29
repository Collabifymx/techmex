revoke all on table public.ranking_bids from public, anon, authenticated;
revoke all on table public.ranking_slots from public, anon, authenticated;

grant select (
  place,
  company_slug,
  current_price_cents,
  last_paid_cents,
  purchased_at
) on public.ranking_slots to anon, authenticated;
