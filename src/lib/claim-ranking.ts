import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function claimPaidBid(input: {
  place: number;
  slug: string;
  amountCents: number;
  email: string;
  sessionId: string;
}) {
  const { data, error } = await getSupabaseAdmin().rpc("claim_ranking_slot", {
    p_place: input.place,
    p_slug: input.slug,
    p_amount: input.amountCents,
    p_email: input.email,
    p_session: input.sessionId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return Boolean(data);
}
