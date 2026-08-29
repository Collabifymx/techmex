import { writeFileSync } from "node:fs";
import { companies } from "../src/lib/companies";
import { events } from "../src/lib/events";

function lit(value: string) {
  return `'${value.replaceAll("'", "''")}'`;
}

function tags(values: string[]) {
  return `ARRAY[${values.map(lit).join(", ")}]::text[]`;
}

const companyRows = companies
  .map(
    (company) =>
      `  (${lit(company.slug)}, ${lit(company.name)}, ${lit(company.description)}, ${lit(company.url)}, ${lit(company.category)}, ${tags(company.tags)}, ${lit(company.city)}, ${company.clicks}, ${company.likes}, ${lit(company.createdAt)}, ${lit(company.initials)}, ${lit(company.iconBg)}, ${company.rankScore}, 'approved')`,
  )
  .join(",\n");

const eventRows = events
  .map(
    (event) =>
      `  (${lit(event.slug)}, ${lit(event.name)}, ${lit(event.description)}, ${lit(event.url)}, ${tags(event.tags)}, ${lit(event.city)}, ${event.venue ? lit(event.venue) : "null"}, ${lit(event.startsAt)}, ${event.endsAt ? lit(event.endsAt) : "null"}, ${lit(event.time)}, ${lit(event.price)}, ${lit(event.organizer)}, ${lit(event.format)})`,
  )
  .join(",\n");

const companySql = companyRows
  ? `insert into public.companies (
  slug, name, description, url, category, tags, city, clicks, likes, created_at, initials, icon_bg, rank_score, status
) values
${companyRows}
on conflict (slug) do nothing;`
  : "-- Directory starts empty. New projects arrive via /publicar → submissions.";

const eventSql = eventRows
  ? `insert into public.events (
  slug, name, description, url, tags, city, venue, starts_at, ends_at, time, price, organizer, format
) values
${eventRows}
on conflict (slug) do nothing;`
  : "-- Events start empty. New entries arrive via /publicar → submissions.";

const sql = `${companySql}

${eventSql}
`;

writeFileSync(new URL("../supabase/seed.sql", import.meta.url), sql);
console.log(`seeded ${companies.length} companies and ${events.length} events`);
