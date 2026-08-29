import type { Metadata } from "next";
import { PublishModal } from "@/components/publish-modal";

export const metadata: Metadata = {
  title: "Publicar",
  description: "Envía tu proyecto o evento a TechMex.",
};

export default function PublicarPage() {
  return (
    <div className="min-h-[60vh]">
      <PublishModal />
    </div>
  );
}
