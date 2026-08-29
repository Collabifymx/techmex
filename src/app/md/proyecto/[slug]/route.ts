import { notFound } from "next/navigation";
import { companyMarkdown, llmsHeaders } from "@/lib/llms";
import { fetchCompany } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const company = await fetchCompany(slug);
  if (!company) notFound();
  return new Response(companyMarkdown(company), { headers: llmsHeaders });
}
