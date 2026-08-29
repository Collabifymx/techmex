import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { normalizeWebsiteUrl } from "@/lib/website-url";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: RouteContext<"/go/[slug]">,
) {
  const { slug } = await context.params;

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.redirect(new URL("/", _request.url));
  }

  const supabase = getSupabase();
  const { data } = await supabase
    .from("companies")
    .select("url")
    .eq("slug", slug)
    .eq("status", "approved")
    .maybeSingle();

  const target = data?.url ? normalizeWebsiteUrl(data.url) : null;
  if (!target) {
    return NextResponse.redirect(new URL("/", _request.url));
  }

  const { error } = await supabase.rpc("increment_company_clicks", {
    company_slug: slug,
  });

  if (error) {
    console.error("increment_company_clicks", error.message);
  }

  return NextResponse.redirect(target, 302);
}
