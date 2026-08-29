import { buildLlmsContent, llmsHeaders } from "@/lib/llms";
import { fetchCompanies } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const companies = await fetchCompanies();
  return new Response(buildLlmsContent(companies), { headers: llmsHeaders });
}
