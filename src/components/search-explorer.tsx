"use client";

import { useMemo, useState } from "react";
import { CompanyRow } from "@/components/company-row";
import { DirectoryEmptyState } from "@/components/directory-empty-state";
import { EventCard } from "@/components/event-card";
import { SearchBox } from "@/components/search-box";
import { sortCompanies } from "@/lib/companies";
import type { Company, TechEvent } from "@/lib/types";
import { cn, matchesQuery } from "@/lib/utils";

type Tab = "todo" | "empresas" | "eventos";

export function SearchExplorer({
  companies,
  events,
  initialQuery = "",
}: {
  companies: Company[];
  events: TechEvent[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [tab, setTab] = useState<Tab>("todo");

  const companyResults = useMemo(
    () =>
      sortCompanies(
        companies.filter((company) =>
          matchesQuery(query, [
            company.name,
            company.description,
            company.tags,
            company.city,
            company.state,
            company.category,
            company.founderName,
          ]),
        ),
        "recent",
      ),
    [companies, query],
  );

  const eventResults = useMemo(
    () =>
      events.filter((event) =>
        matchesQuery(query, [
          event.name,
          event.description,
          event.tags,
          event.city,
          event.state,
          event.organizer,
        ]),
      ),
    [events, query],
  );

  const showCompanies = tab === "todo" || tab === "empresas";
  const showEvents = tab === "todo" || tab === "eventos";

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
      <SearchBox
        defaultValue={query}
        onSubmitQuery={setQuery}
        autoFocus
        placeholder="search"
      />

      <div className="mt-6 flex flex-wrap gap-2">
        {(
          [
            ["todo", `TODO · ${companyResults.length + eventResults.length}`],
            ["empresas", `EMPRESAS · ${companyResults.length}`],
            ["eventos", `EVENTOS · ${eventResults.length}`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "mono rounded-full border px-3 py-1 text-[10px] tracking-[0.16em]",
              tab === key
                ? "border-mint/60 text-mint"
                : "border-white/15 text-mute hover:text-white",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {showCompanies ? (
        <section className="mt-12">
          <div className="mb-2 flex items-end justify-between">
            <h2 className="display text-3xl text-white">EMPRESAS</h2>
            <p className="mono text-[11px] tracking-[0.16em] text-mute">
              {companyResults.length} RESULTADOS
            </p>
          </div>
          <div className="mt-3 space-y-3">
            {companyResults.length ? (
              companyResults.map((company) => (
                <CompanyRow key={company.slug} company={company} />
              ))
            ) : companies.length === 0 ? (
              <DirectoryEmptyState />
            ) : (
              <p className="surface px-5 py-10 text-center text-sm text-mute">
                No hay empresas para esa búsqueda.
              </p>
            )}
          </div>
        </section>
      ) : null}

      {showEvents ? (
        <section className="mt-12">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="display text-3xl text-white">EVENTOS</h2>
            <p className="mono text-[11px] tracking-[0.16em] text-mute">
              {eventResults.length} RESULTADOS
            </p>
          </div>
          <div className="space-y-3">
            {eventResults.length ? (
              eventResults.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))
            ) : (
              <p className="surface px-5 py-10 text-center text-sm text-mute">
                No hay eventos para esa búsqueda.
              </p>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
