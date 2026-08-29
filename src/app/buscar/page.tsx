import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { SearchExplorer } from "@/components/search-explorer";
import { fetchCompanies, fetchEvents } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Busca empresas y eventos de la comunidad tech de México.",
};

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ q = "" }, companies, events] = await Promise.all([
    searchParams,
    fetchCompanies(),
    fetchEvents(),
  ]);

  return (
    <div>
      <PageHero
        index="03"
        title="BUSCADOR"
        subtitle="Encuentra empresas, productos y eventos tech en México."
      />
      <SearchExplorer companies={companies} events={events} initialQuery={q} />
    </div>
  );
}
