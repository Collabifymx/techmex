import type { Company } from "@/lib/types";

export const RANKING_START_MXN = 100;
export const RANKING_MAX_MULTIPLIER = 3;
export const RANKING_STEP_MXN = 10;

export type RankingSlot = {
  place: 1 | 2 | 3;
  companySlug: string | null;
  currentPriceCents: number;
  lastPaidCents: number | null;
  purchasedAt: string | null;
};

export type RankedEntry = {
  place: number;
  company: Company;
  bought: boolean;
  slot: RankingSlot | null;
};

export function pesosFromCents(cents: number) {
  return Math.round(cents / 100);
}

export function centsFromPesos(pesos: number) {
  return Math.round(pesos) * 100;
}

export function formatMxn(pesos: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(pesos);
}

export function nextAskCents(slot?: RankingSlot | null) {
  if (slot?.lastPaidCents) {
    return slot.lastPaidCents + RANKING_STEP_MXN * 100;
  }
  return slot?.currentPriceCents ?? RANKING_START_MXN * 100;
}

export function bidRange(slot?: RankingSlot | null) {
  const minCents = nextAskCents(slot);
  return {
    minCents,
    maxCents: minCents * RANKING_MAX_MULTIPLIER,
    minPesos: pesosFromCents(minCents),
    maxPesos: pesosFromCents(minCents * RANKING_MAX_MULTIPLIER),
  };
}

export function composeRanking(
  companies: Company[],
  slots: RankingSlot[],
): RankedEntry[] {
  const bySlug = new Map(companies.map((company) => [company.slug, company]));
  const slotByPlace = new Map(slots.map((slot) => [slot.place, slot]));
  const boughtSlugs = new Set(
    slots.map((slot) => slot.companySlug).filter((slug): slug is string => Boolean(slug)),
  );

  const chronological = [...companies]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .filter((company) => !boughtSlugs.has(company.slug));

  const entries: RankedEntry[] = [];

  for (let place = 1; place <= 10; place += 1) {
    const slot = place <= 3 ? (slotByPlace.get(place as 1 | 2 | 3) ?? null) : null;
    const boughtCompany = slot?.companySlug ? bySlug.get(slot.companySlug) : undefined;
    const company = boughtCompany ?? chronological.shift();
    if (!company) break;

    entries.push({
      place,
      company,
      bought: Boolean(boughtCompany),
      slot,
    });
  }

  return entries;
}
