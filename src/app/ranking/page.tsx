import type { Metadata } from "next";
import { CompanyRow } from "@/components/company-row";
import { DirectoryEmptyState } from "@/components/directory-empty-state";
import { PageHero } from "@/components/page-hero";
import { fetchCompanies } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ranking",
  robots: { index: false, follow: false },
  description: "Los proyectos tech más visibles de México.",
};

export default async function RankingPage() {
  const companies = await fetchCompanies();
  const ranked = [...companies].sort((a, b) => b.rankScore - a.rankScore);

  return (
    <div className="pb-20">
      <PageHero
        index="00"
        title="RANKING"
        subtitle="Los proyectos tech más visibles de México. Esta página está lista, pero no aparece en el menú."
      />
      <div className="mx-auto max-w-5xl space-y-3 px-4 sm:px-6">
        {!ranked.length ? <DirectoryEmptyState /> : null}
        {ranked.map((company, index) => (
          <div key={company.slug} className="relative">
            <span className="mono absolute -left-10 top-7 hidden text-sm text-mint lg:block">
              {String(index + 1).padStart(2, "0")}
            </span>
            <CompanyRow company={company} />
          </div>
        ))}
      </div>
    </div>
  );
}
