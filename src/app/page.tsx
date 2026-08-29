import { CompanyDirectory } from "@/components/company-directory";
import { PageHero } from "@/components/page-hero";
import { fetchCompanies } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const companies = await fetchCompanies();

  return (
    <div>
      <PageHero
        index="01"
        title="DIRECTORIO"
        subtitle="Explora, busca y filtra proyectos tech mexicanos."
      />
      <CompanyDirectory companies={companies} />
    </div>
  );
}
