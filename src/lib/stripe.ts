import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error("Falta STRIPE_SECRET_KEY de la cuenta Stripe de TechMex.");
  }
  if (!client) {
    client = new Stripe(key);
  }
  return client;
}

export function stripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

export function randomIntegrationId() {
  const suffix = Array.from({ length: 8 }, () =>
    "abcdefghijklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 26)),
  ).join("");
  return `techmex-rank-bid-${suffix}`;
}
