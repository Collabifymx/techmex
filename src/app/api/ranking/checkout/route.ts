import { NextResponse } from "next/server";
import { bidRange, centsFromPesos } from "@/lib/ranking";
import { getStripe, randomIntegrationId, stripeConfigured } from "@/lib/stripe";
import { fetchCompany, fetchRankingSlots } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!stripeConfigured()) {
    return NextResponse.json(
      { error: "Faltan las keys de Stripe de TechMex." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as {
    place?: number;
    slug?: string;
    pesos?: number;
    email?: string;
  };

  const place = Number(body.place);
  const slug = String(body.slug ?? "").trim();
  const pesos = Number(body.pesos);
  const email = String(body.email ?? "").trim();

  if (![1, 2, 3].includes(place) || !/^[a-z0-9-]+$/.test(slug) || !email) {
    return NextResponse.json({ error: "Datos incompletos." }, { status: 400 });
  }

  const company = await fetchCompany(slug);
  if (!company) {
    return NextResponse.json(
      { error: "Ese proyecto no está en el directorio." },
      { status: 400 },
    );
  }

  const slots = await fetchRankingSlots();
  const slot = slots.find((item) => item.place === place);
  const range = bidRange(slot);
  const amountCents = centsFromPesos(pesos);

  if (amountCents < range.minCents || amountCents > range.maxCents) {
    return NextResponse.json(
      {
        error: `La oferta tiene que estar entre ${range.minPesos} y ${range.maxPesos} MXN.`,
      },
      { status: 400 },
    );
  }

  const origin = new URL(request.url).origin;
  const medal = place === 1 ? "oro" : place === 2 ? "plata" : "bronce";

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    success_url: `${origin}/?bid=ok&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/?bid=cancel`,
    integration_identifier: randomIntegrationId(),
    metadata: {
      place: String(place),
      slug,
      amount_cents: String(amountCents),
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "mxn",
          unit_amount: amountCents,
          product_data: {
            name: `TechMex Ranking · Lugar ${place} (${medal})`,
            description: `Bid por ${company.name} en el ranking De México para el mundo.`,
          },
        },
      },
    ],
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "Stripe no devolvió un checkout." },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: session.url });
}
