import Link from "next/link";

export function DirectoryEmptyState() {
  return (
    <div className="surface mx-auto max-w-5xl px-6 py-16 text-center sm:px-10">
      <p className="mono text-[11px] tracking-[0.18em] text-mute">
        00 PROYECTOS
      </p>
      <h2 className="display mt-4 text-4xl text-white sm:text-5xl">
        SUBE EL PRIMER PROYECTO
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm text-mute">
        El directorio está vacío. Publica el primero y empieza el mapa tech de
        México.
      </p>
      <Link
        href="/publicar"
        className="tab-primary mono mt-8 inline-flex rounded-full px-6 py-3 text-[11px] tracking-[0.18em]"
      >
        PUBLICAR PROYECTO
      </Link>
    </div>
  );
}
