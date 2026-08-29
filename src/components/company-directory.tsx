"use client";

import { useMemo, useState } from "react";
import { CompanyRow } from "@/components/company-row";
import { DirectoryEmptyState } from "@/components/directory-empty-state";
import { SearchBox } from "@/components/search-box";
import { PRIMARY_CATEGORIES, categoryCounts, sortCompanies } from "@/lib/companies";
import type { Company, CompanyCategory, SortKey } from "@/lib/types";
import { cn, formatNumber, matchesQuery } from "@/lib/utils";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "recent", label: "RECIENTES" },
  { key: "oldest", label: "ANTIGÜEDAD" },
  { key: "random", label: "AL AZAR" },
  { key: "visits", label: "VISITADOS" },
  { key: "likes", label: "LIKES" },
  { key: "az", label: "A-Z" },
  { key: "ranking", label: "RANKING" },
];

export function CompanyDirectory({
  companies,
  initialQuery = "",
}: {
  companies: Company[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<CompanyCategory | "Todos">("Todos");
  const [sort, setSort] = useState<SortKey>("recent");
  const [moreOpen, setMoreOpen] = useState(false);
  const { total, counts } = categoryCounts(companies);

  const extraCategories = counts.filter(
    (item) => !PRIMARY_CATEGORIES.includes(item.category),
  );

  const results = useMemo(() => {
    const filtered = companies.filter((company) => {
      const matchesCategory =
        category === "Todos" || company.category === category;
      const matchesSearch = matchesQuery(query, [
        company.name,
        company.description,
        company.tags,
        company.city,
        company.state,
        company.category,
        company.founderName,
      ]);
      return matchesCategory && matchesSearch;
    });
    return sortCompanies(filtered, sort);
  }, [category, companies, query, sort]);

  if (!companies.length) {
    return (
      <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <DirectoryEmptyState />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
      <SearchBox defaultValue={query} onSubmitQuery={setQuery} />

      <div className="mt-6 flex flex-wrap gap-2">
        <Chip
          label={`TODOS ${total}`}
          active={category === "Todos"}
          onClick={() => setCategory("Todos")}
        />
        {PRIMARY_CATEGORIES.map((item) => {
          const count = counts.find((entry) => entry.category === item)?.count ?? 0;
          return (
            <Chip
              key={item}
              label={`${item.toUpperCase()} ${count}`}
              active={category === item}
              onClick={() => setCategory(item)}
            />
          );
        })}
        <div className="relative">
          <Chip
            label="MÁS"
            active={extraCategories.some((item) => item.category === category)}
            onClick={() => setMoreOpen((value) => !value)}
          />
          {moreOpen ? (
            <div className="surface absolute left-0 z-20 mt-2 min-w-44 p-1">
              {extraCategories.map((item) => (
                <button
                  key={item.category}
                  type="button"
                  onClick={() => {
                    setCategory(item.category);
                    setMoreOpen(false);
                  }}
                  className="mono flex w-full items-center justify-between px-3 py-2 text-left text-[11px] tracking-[0.12em] text-mute hover:text-white"
                >
                  {item.category.toUpperCase()}
                  <span>{item.count}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-b border-line pb-3">
        {SORTS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setSort(item.key)}
            className={cn(
              "mono text-[11px] tracking-[0.16em]",
              sort === item.key ? "text-mint" : "text-mute hover:text-white",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="mono mt-8 text-[11px] tracking-[0.16em] text-mute">
        {formatNumber(results.length)} RESULTADOS
      </p>

      <div className="mt-5 space-y-3">
        {results.length ? (
          results.map((company) => (
            <CompanyRow key={company.slug} company={company} />
          ))
        ) : (
          <p className="surface px-5 py-10 text-center text-sm text-mute">
            No hay proyectos que coincidan con esa búsqueda.
          </p>
        )}
      </div>
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "mono rounded-full border px-3 py-1 text-[10px] tracking-[0.16em]",
        active
          ? "border-mint/60 text-mint"
          : "border-white/15 text-mute hover:text-white",
      )}
    >
      {label}
    </button>
  );
}
