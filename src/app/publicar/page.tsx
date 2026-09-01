import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PublishForm } from "@/components/publish-modal";

export const metadata: Metadata = {
  title: "Publicar",
  description: "Envía tu proyecto o evento a TechMex.",
};

export default function PublicarPage() {
  return (
    <div>
      <PageHero
        index="04"
        title="PUBLICAR"
        subtitle="Manda tu proyecto o evento. Es una página: baja, llena y envía. Lo revisamos antes de subirlo al directorio."
        compact
      />
      <div className="mx-auto max-w-3xl px-4 pb-28 sm:px-6">
        <PublishForm />
      </div>
    </div>
  );
}
