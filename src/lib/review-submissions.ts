import { decideSubmission, iconBgFromSlug, initialsFromName, slugifyName } from "@/lib/moderation";
import { parseSocials } from "@/lib/socials";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { COMPANY_CATEGORIES } from "@/lib/types";

export type ReviewResult = {
  id: string;
  name: string;
  action: "approve" | "reject" | "skip";
  reason: string;
};

type SubmissionRow = {
  id: string;
  name: string;
  url: string;
  description: string | null;
  category: string | null;
  city: string | null;
  state: string | null;
  icon_url: string | null;
  founder_name: string | null;
  founder_photo_url: string | null;
  socials: unknown;
  created_at: string;
};

type CompanyRef = {
  name: string;
  url: string;
  slug: string;
};

function validCategory(category: string | null) {
  if (!category) return "Otros";
  return COMPANY_CATEGORIES.includes(category as (typeof COMPANY_CATEGORIES)[number])
    ? category
    : "Otros";
}

async function markSubmission(
  id: string,
  status: "approved" | "rejected",
  reason: string,
) {
  const { error } = await getSupabaseAdmin()
    .from("submissions")
    .update({
      status,
      review_note: reason,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "pending");

  if (error) {
    throw new Error(error.message);
  }
}

async function publishCompany(submission: SubmissionRow, slug: string) {
  const { error } = await getSupabaseAdmin().from("companies").insert({
    slug,
    name: submission.name.trim(),
    description: submission.description?.trim() || submission.name.trim(),
    url: submission.url,
    category: validCategory(submission.category),
    tags: [],
    city: submission.city?.trim() || "México",
    state: submission.state,
    clicks: 0,
    likes: 0,
    created_at: submission.created_at,
    initials: initialsFromName(submission.name),
    icon_bg: iconBgFromSlug(slug),
    rank_score: 0,
    status: "approved",
    icon_url: submission.icon_url,
    founder_name: submission.founder_name,
    founder_photo_url: submission.founder_photo_url,
    socials: parseSocials(submission.socials),
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function reviewPendingSubmissions(): Promise<ReviewResult[]> {
  const admin = getSupabaseAdmin();

  const [{ data: pending, error: pendingError }, { data: companies, error: companiesError }] =
    await Promise.all([
      admin
        .from("submissions")
        .select(
          "id, name, url, description, category, city, state, icon_url, founder_name, founder_photo_url, socials, created_at",
        )
        .eq("kind", "project")
        .eq("status", "pending")
        .order("created_at", { ascending: true }),
      admin.from("companies").select("name, url, slug"),
    ]);

  if (pendingError) throw new Error(pendingError.message);
  if (companiesError) throw new Error(companiesError.message);

  const known: CompanyRef[] = (companies ?? []) as CompanyRef[];
  const results: ReviewResult[] = [];

  for (const row of (pending ?? []) as SubmissionRow[]) {
    const slug = slugifyName(row.name);
    const socials = parseSocials(row.socials);

    if (!slug) {
      await markSubmission(row.id, "rejected", "El nombre no da para un slug.");
      results.push({ id: row.id, name: row.name, action: "reject", reason: "slug inválido" });
      continue;
    }

    const duplicates = known.map((company) => ({
      name: company.name,
      url: company.url,
    }));

    if (known.some((company) => company.slug === slug)) {
      const reason = "Ya existe un proyecto con ese nombre.";
      await markSubmission(row.id, "rejected", reason);
      results.push({ id: row.id, name: row.name, action: "reject", reason });
      continue;
    }

    const decision = await decideSubmission({
      name: row.name,
      url: row.url,
      description: row.description,
      city: row.city,
      founderName: row.founder_name,
      socials,
      duplicates,
    });

    if (decision.action === "reject") {
      await markSubmission(row.id, "rejected", decision.reason);
      results.push({
        id: row.id,
        name: row.name,
        action: "reject",
        reason: decision.reason,
      });
      continue;
    }

    try {
      await publishCompany(row, slug);
      await markSubmission(row.id, "approved", decision.reason);
      known.push({ name: row.name, url: row.url, slug });
      results.push({
        id: row.id,
        name: row.name,
        action: "approve",
        reason: decision.reason,
      });
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : "No se pudo publicar el proyecto.";
      console.error("review-submissions: publish failed", row.id, reason);
      await markSubmission(row.id, "rejected", `Duplicado o error al publicar: ${reason}`);
      results.push({ id: row.id, name: row.name, action: "reject", reason });
    }
  }

  return results;
}
