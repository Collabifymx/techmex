import type { Company } from "@/lib/types";
import { formatPlace } from "@/lib/utils";

export function ProjectOthers({ companies }: { companies: Company[] }) {
  return (
    <aside className="lg:sticky lg:top-6">
      <div className="border border-white/10 bg-[#08100a]">
        <div className="border-b border-white/10 px-4 py-4">
          <p className="mono text-[11px] tracking-[0.18em] text-mint">
            08 / OTROS
          </p>
          <h2 className="display mt-2 text-3xl text-white">EN EL MAPA</h2>
        </div>
        {companies.length ? (
          <ol>
            {companies.map((company, index) => (
              <li key={company.slug} className="border-b border-white/8 last:border-b-0">
                <a
                  href={`/proyecto/${company.slug}`}
                  className="flex items-start gap-3 px-4 py-4 hover:bg-mint/5"
                >
                  <span className="mono pt-1 text-[10px] tracking-[0.14em] text-mint">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {company.iconUrl ? (
                    <img
                      src={company.iconUrl}
                      alt=""
                      className="h-9 w-9 shrink-0 object-cover"
                    />
                  ) : (
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center text-[11px] font-semibold text-white"
                      style={{ backgroundColor: company.iconBg }}
                    >
                      {company.initials}
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-white">
                      {company.name}
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] text-mute">
                      {company.category}
                      {formatPlace(company.city, company.state)
                        ? ` · ${formatPlace(company.city, company.state)}`
                        : ""}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        ) : (
          <p className="px-4 py-8 text-sm text-mute">Aún no hay más proyectos.</p>
        )}
      </div>
    </aside>
  );
}
