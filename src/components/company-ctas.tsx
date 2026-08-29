import { ExternalLinkIcon, EyeIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function CompanyCtas({
  slug,
  iconUrl,
  initials,
  iconBg,
  onVisit,
  showProject = true,
  className,
}: {
  slug: string;
  iconUrl?: string | null;
  initials?: string;
  iconBg?: string;
  onVisit?: () => void;
  showProject?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {showProject ? (
        <a href={`/proyecto/${slug}`} className="btn-secondary py-3 text-lg sm:text-xl">
          {iconUrl ? (
            <img
              src={iconUrl}
              alt=""
              className="h-6 w-6 rounded-full object-cover"
            />
          ) : initials ? (
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white"
              style={{ backgroundColor: iconBg }}
            >
              {initials}
            </span>
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
          Ver proyecto
        </a>
      ) : null}
      <a
        href={`/go/${slug}`}
        target="_blank"
        rel="noreferrer"
        onClick={onVisit}
        className="btn-primary py-3 text-lg sm:text-xl"
      >
        <ExternalLinkIcon className="h-5 w-5" />
        Visitar
      </a>
    </div>
  );
}
