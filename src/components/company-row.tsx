import { EyeIcon, UsersIcon } from "@/components/icons";
import type { Company } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

export function CompanyRow({ company }: { company: Company }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noreferrer"
      className="surface block px-5 py-5 transition-transform duration-200 hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-4">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: company.iconBg }}
        >
          {company.initials}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[17px] font-semibold text-white">
                {company.name}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-[13px] text-mute">
                <UsersIcon />
                {formatNumber(company.clicks)} clicks
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[12px] text-mute">
              <EyeIcon />
              {company.category}
            </span>
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-mute">
            {company.description}
          </p>
        </div>
      </div>
    </a>
  );
}
