import { EyeIcon, UsersIcon } from "@/components/icons";
import type { Company } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

export function CompanyRow({ company }: { company: Company }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noreferrer"
      className="surface block px-4 py-5 sm:px-5"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {company.iconUrl ? (
          <img
            src={company.iconUrl}
            alt=""
            className="h-11 w-11 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: company.iconBg }}
          >
            {company.initials}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <div className="min-w-0">
              <h3 className="break-words text-[17px] font-semibold text-white">
                {company.name}
              </h3>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-mute">
                <span className="inline-flex items-center gap-1.5">
                  <UsersIcon />
                  {formatNumber(company.clicks)} clicks
                </span>
                {company.city ? <span>{company.city}</span> : null}
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[12px] text-mute">
              <EyeIcon />
              {company.category}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 break-words text-mute">
            {company.description}
          </p>
          {company.tags.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {company.tags.map((tag) => (
                <span
                  key={tag}
                  className="mono rounded-full border border-white/10 px-2.5 py-1 text-[10px] tracking-[0.12em] text-mute"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </a>
  );
}
