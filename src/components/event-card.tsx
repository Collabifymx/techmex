import { EyeIcon, PinIcon } from "@/components/icons";
import type { TechEvent } from "@/lib/types";
import { formatDateRange, monthShort } from "@/lib/utils";

export function EventCard({ event }: { event: TechEvent }) {
  return (
    <article className="surface px-5 py-5">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-full bg-black/40 text-center">
          <span className="mono text-[9px] tracking-widest text-mint">
            {event.startsAt ? monthShort(event.startsAt) : "—"}
          </span>
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[17px] font-semibold text-white">{event.name}</h3>
              <p className="mt-1 text-[13px] text-mute">
                {event.startsAt
                  ? formatDateRange(event.startsAt, event.endsAt)
                  : "Fecha por confirmar"}
                {event.venue || event.city
                  ? ` · ${[event.venue, event.city].filter(Boolean).join(", ")}`
                  : ""}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[12px] text-mute">
              <EyeIcon />
              {event.price}
            </span>
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-mute">
            {event.description}
          </p>
          <a
            href={event.url}
            target="_blank"
            rel="noreferrer"
            className="mono mt-4 inline-flex items-center gap-2 text-[11px] tracking-[0.16em] text-mint"
          >
            <PinIcon />
            VER EVENTO
          </a>
        </div>
      </div>
    </article>
  );
}
