import { EyeIcon, PinIcon } from "@/components/icons";
import type { TechEvent } from "@/lib/types";
import { formatDateRange, monthShort } from "@/lib/utils";

export function EventCard({ event }: { event: TechEvent }) {
  const place = [event.venue, event.city].filter(Boolean).join(", ");

  return (
    <article className="surface px-4 py-5 sm:px-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-full bg-black/40 text-center">
          <span className="mono text-[9px] tracking-widest text-mint">
            {event.startsAt ? monthShort(event.startsAt) : "—"}
          </span>
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <div className="min-w-0">
              <h3 className="break-words text-[17px] font-semibold text-white">
                {event.name}
              </h3>
              <p className="mt-1 text-[13px] leading-5 text-mute">
                {event.startsAt
                  ? formatDateRange(event.startsAt, event.endsAt)
                  : "Fecha por confirmar"}
                {event.time ? ` · ${event.time}` : ""}
              </p>
              {place ? (
                <p className="mt-1 text-[13px] leading-5 break-words text-mute">
                  {place}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[12px] text-mute">
                <EyeIcon />
                {event.price}
              </span>
              {event.format ? (
                <span className="inline-flex w-fit items-center rounded-full bg-black/35 px-2.5 py-1 text-[12px] text-mute">
                  {event.format}
                </span>
              ) : null}
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 break-words text-mute">
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
