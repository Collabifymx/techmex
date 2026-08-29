import { companies } from "@/lib/companies";
import { events } from "@/lib/events";
import type { RankingSlot } from "@/lib/ranking";
import { parseSocials } from "@/lib/socials";
import { getSupabase } from "@/lib/supabase";
import type { Company, ProjectComment, TechEvent } from "@/lib/types";

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

type CompanyRow = {
  slug: string;
  name: string;
  description: string;
  url: string;
  category: Company["category"];
  tags: string[];
  city: string;
  state: string | null;
  clicks: number;
  likes: number;
  created_at: string;
  initials: string;
  icon_bg: string;
  icon_url: string | null;
  founder_name: string | null;
  founder_photo_url: string | null;
  socials: unknown;
  rank_score: number;
};

type EventRow = {
  slug: string;
  name: string;
  description: string;
  url: string;
  tags: string[];
  city: string;
  state: string | null;
  venue: string | null;
  starts_at: string;
  ends_at: string | null;
  time: string;
  price: TechEvent["price"];
  organizer: string;
  format: TechEvent["format"];
};

function mapCompany(row: CompanyRow): Company {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    url: row.url,
    category: row.category,
    tags: row.tags,
    city: row.city,
    state: row.state,
    clicks: row.clicks,
    likes: row.likes,
    createdAt: row.created_at,
    initials: row.initials,
    iconBg: row.icon_bg,
    iconUrl: row.icon_url,
    founderName: row.founder_name,
    founderPhotoUrl: row.founder_photo_url,
    socials: parseSocials(row.socials),
    rankScore: row.rank_score,
  };
}

function mapEvent(row: EventRow): TechEvent {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    url: row.url,
    tags: row.tags,
    city: row.city,
    state: row.state,
    venue: row.venue ?? undefined,
    startsAt: row.starts_at,
    endsAt: row.ends_at ?? undefined,
    time: row.time,
    price: row.price,
    organizer: row.organizer,
    format: row.format,
  };
}

export async function fetchCompanies() {
  if (!hasSupabaseEnv()) return companies;

  const { data, error } = await getSupabase()
    .from("companies")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as CompanyRow[]).map(mapCompany);
}

export async function fetchRankingSlots(): Promise<RankingSlot[]> {
  if (!hasSupabaseEnv()) {
    return [1, 2, 3].map((place) => ({
      place: place as 1 | 2 | 3,
      companySlug: null,
      currentPriceCents: 10000,
      lastPaidCents: null,
      purchasedAt: null,
    }));
  }

  const { data, error } = await getSupabase()
    .from("ranking_slots")
    .select("place, company_slug, current_price_cents, last_paid_cents, purchased_at")
    .order("place");

  if (error) throw error;

  return ((data ?? []) as Array<{
    place: number;
    company_slug: string | null;
    current_price_cents: number;
    last_paid_cents: number | null;
    purchased_at: string | null;
  }>).map((row) => ({
    place: row.place as 1 | 2 | 3,
    companySlug: row.company_slug,
    currentPriceCents: row.current_price_cents,
    lastPaidCents: row.last_paid_cents,
    purchasedAt: row.purchased_at,
  }));
}

export async function fetchCompany(slug: string) {
  if (!hasSupabaseEnv()) {
    return companies.find((company) => company.slug === slug) ?? null;
  }

  const { data, error } = await getSupabase()
    .from("companies")
    .select("*")
    .eq("status", "approved")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? mapCompany(data as CompanyRow) : null;
}

export async function fetchComments(slug: string): Promise<ProjectComment[]> {
  if (!hasSupabaseEnv()) return [];

  const { data, error } = await getSupabase()
    .from("project_comments")
    .select("id, author, body, created_at")
    .eq("company_slug", slug)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as Array<{
    id: string;
    author: string;
    body: string;
    created_at: string;
  }>).map((row) => ({
    id: row.id,
    author: row.author,
    body: row.body,
    createdAt: row.created_at,
  }));
}

export async function fetchEvents() {
  if (!hasSupabaseEnv()) return events;

  const { data, error } = await getSupabase()
    .from("events")
    .select("*")
    .order("starts_at");

  if (error) throw error;
  return ((data ?? []) as EventRow[]).map(mapEvent);
}
