import type { Metadata } from "next";
import { CompanyDirectory } from "@/components/company-directory";
import { PageHero } from "@/components/page-hero";
import { fetchCompanies } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Directorio",
  description: "Explora, busca y filtra proyectos tech mexicanos.",
};

export default async function DirectorioPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ q = "" }, companies] = await Promise.all([
    searchParams,
    fetchCompanies(),
  ]);

  return (
    <div>
      <PageHero
        index="02"
        title="DIRECTORIO"
        subtitle="Explora, busca y filtra proyectos tech mexicanos."
      />
      <CompanyDirectory companies={companies} initialQuery={q} />
    </div>
  );
}
