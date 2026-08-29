import { companies } from "@/lib/companies";
import { events } from "@/lib/events";
import { getSupabase } from "@/lib/supabase";
import type { Company, TechEvent } from "@/lib/types";

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
    .order("name");

  if (error) throw error;
  return ((data ?? []) as CompanyRow[]).map(mapCompany);
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
