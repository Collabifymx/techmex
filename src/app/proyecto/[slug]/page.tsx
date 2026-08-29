import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectOthers } from "@/components/project-others";
import { ProjectProfile } from "@/components/project-profile";
import { fetchComments, fetchCompanies, fetchCompany } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = await fetchCompany(slug);
  if (!company) return { title: "Proyecto" };

  return {
    title: company.name,
    description: company.description,
  };
}

export default async function ProyectoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [company, companies, comments] = await Promise.all([
    fetchCompany(slug),
    fetchCompanies(),
    fetchComments(slug),
  ]);
  if (!company) notFound();

  const others = companies.filter((item) => item.slug !== company.slug).slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-20 sm:px-6">
      <Link
        href="/directorio"
        className="mono text-[11px] tracking-[0.16em] text-mute hover:text-mint"
      >
        ← 02 / DIRECTORIO
      </Link>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ProjectProfile company={company} comments={comments} />
        <ProjectOthers companies={others} />
      </div>
    </div>
  );
}
