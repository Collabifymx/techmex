import type { Metadata } from "next";
import { EventCard } from "@/components/event-card";
import { PageHero } from "@/components/page-hero";
import { eventCities, pastEvents, upcomingEvents } from "@/lib/events";
import { fetchEvents } from "@/lib/queries";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Conferencias, hackathons y meetups en México.",
};

export default async function EventosPage() {
  const all = await fetchEvents();
  const upcoming = upcomingEvents(all);
  const past = pastEvents(all);

  return (
    <div className="pb-20">
      <PageHero
        index="02"
        title="EVENTOS TECH"
        subtitle="Conferencias, hackathons y meetups en México."
      >
        <p className="mono mt-5 text-[11px] tracking-[0.16em] text-mute">
          {formatNumber(upcoming.length)} PRÓXIMOS · {formatNumber(eventCities(all))}{" "}
          CIUDADES · {formatNumber(past.length)} EN ARCHIVO
        </p>
      </PageHero>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="display text-3xl text-white">PRÓXIMOS</h2>
            <p className="mono text-[11px] tracking-[0.16em] text-mute">
              ORDENADOS POR FECHA · {upcoming.length}
            </p>
          </div>
          <div className="space-y-3">
            {upcoming.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        </section>

        {past.length ? (
          <section className="mt-16">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="display text-3xl text-white">PASADOS</h2>
              <p className="mono text-[11px] tracking-[0.16em] text-mute">
                ARCHIVO RECIENTE
              </p>
            </div>
            <div className="space-y-3">
              {past.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
