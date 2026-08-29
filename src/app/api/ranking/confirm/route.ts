import { NextResponse } from "next/server";
import { claimPaidBid } from "@/lib/claim-ranking";
import { getStripe, stripeConfigured } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!stripeConfigured()) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const session = await getStripe().checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") {
    return NextResponse.json({ ok: false, error: "El pago no está confirmado." });
  }

  const place = Number(session.metadata?.place);
  const slug = String(session.metadata?.slug ?? "");
  const amountCents = Number(session.metadata?.amount_cents);
  const email = session.customer_email ?? session.customer_details?.email ?? "";

  if (![1, 2, 3].includes(place) || !slug || !amountCents || !email) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const claimed = await claimPaidBid({
    place,
    slug,
    amountCents,
    email,
    sessionId: session.id,
  });

  return NextResponse.json({ ok: claimed });
}
