import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { StartupRanking } from "@/components/startup-ranking";
import { composeRanking } from "@/lib/ranking";
import { fetchCompanies, fetchRankingSlots } from "@/lib/queries";
import { stripeConfigured } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ranking",
  description: "De México para el mundo. El ranking de startups tech mexicanas.",
};

export default async function HomePage() {
  const [companies, slots] = await Promise.all([
    fetchCompanies(),
    fetchRankingSlots(),
  ]);

  return (
    <div>
      <PageHero
        index="01"
        title="RANKING"
        subtitle="De México para el mundo. Los lugares 1, 2 y 3 se compran desde $100 MXN; el máximo es el triple."
        compact
      />
      <StartupRanking
        entries={composeRanking(companies, slots)}
        companies={companies}
        paymentsReady={stripeConfigured()}
      />
    </div>
  );
}
