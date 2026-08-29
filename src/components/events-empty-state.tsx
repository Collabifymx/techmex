import Link from "next/link";

export function EventsEmptyState() {
  return (
    <div className="surface mx-auto max-w-5xl px-6 py-16 text-center sm:px-10">
      <p className="mono text-[11px] tracking-[0.18em] text-mute">
        00 EVENTOS
      </p>
      <h2 className="display mt-4 text-4xl text-white sm:text-5xl">
        SUBE EL PRIMER EVENTO
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm text-mute">
        Todavía no hay meetups, hackathons ni conferencias publicadas. Pega el
        link y empieza el calendario tech de México.
      </p>
      <Link
        href="/publicar"
        className="tab-primary mono mt-8 inline-flex rounded-full px-6 py-3 text-[11px] tracking-[0.18em]"
      >
        PUBLICAR EVENTO
      </Link>
    </div>
  );
}
