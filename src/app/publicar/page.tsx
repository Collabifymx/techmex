import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PublishForm } from "@/components/publish-form";

export const metadata: Metadata = {
  title: "Publicar",
  description: "Envía tu proyecto; si lo aprobamos, entra al directorio.",
};

export default function PublicarPage() {
  return (
    <div className="pb-20">
      <PageHero
        index="04"
        title="PUBLICAR"
        subtitle="Envía tu proyecto; si lo aprobamos, entra al directorio."
      >
        <p className="mono mt-5 text-[11px] tracking-[0.16em] text-mute">
          01 ENVÍAS · 02 REVISAMOS · 03 ENTRA AL DIRECTORIO
        </p>
      </PageHero>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <PublishForm />
      </div>
    </div>
  );
}
