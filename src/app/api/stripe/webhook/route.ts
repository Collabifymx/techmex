import { NextResponse } from "next/server";
import { claimPaidBid } from "@/lib/claim-ranking";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) {
    return NextResponse.json({ error: "Webhook sin firma." }, { status: 400 });
  }

  const raw = await request.text();
  const event = getStripe().webhooks.constructEvent(raw, signature, secret);

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object;
  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true });
  }

  const place = Number(session.metadata?.place);
  const slug = String(session.metadata?.slug ?? "");
  const amountCents = Number(session.metadata?.amount_cents);
  const email = session.customer_email ?? session.customer_details?.email ?? "";

  if ([1, 2, 3].includes(place) && slug && amountCents && email) {
    await claimPaidBid({
      place,
      slug,
      amountCents,
      email,
      sessionId: session.id,
    });
  }

  return NextResponse.json({ received: true });
}
