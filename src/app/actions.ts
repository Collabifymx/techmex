"use server";

import { fetchEventPreview } from "@/lib/open-graph";
import { publishEvent, publishProject } from "@/lib/publish";
import { getSupabase } from "@/lib/supabase";

export async function submitProject(formData: FormData) {
  return publishProject(formData);
}

export async function submitEvent(formData: FormData) {
  return publishEvent(formData);
}

export async function likeProject(slug: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { ok: false, error: "Proyecto inválido." };
  }

  const { error } = await getSupabase().rpc("increment_company_likes", {
    company_slug: slug,
  });

  if (error) {
    return { ok: false, error: "No se pudo registrar el like." };
  }

  return { ok: true };
}

export async function submitComment(formData: FormData) {
  const slug = String(formData.get("slug") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!/^[a-z0-9-]+$/.test(slug) || !author || !body) {
    return { ok: false, error: "Escribe tu nombre y un comentario." };
  }
  if (author.length > 60 || body.length > 500) {
    return { ok: false, error: "El comentario es demasiado largo." };
  }

  const { error } = await getSupabase().from("project_comments").insert({
    company_slug: slug,
    author,
    body,
  });

  if (error) {
    return { ok: false, error: "No se pudo publicar el comentario." };
  }

  return { ok: true };
}

export async function previewEventFromUrl(url: string) {
  try {
    const preview = await fetchEventPreview(url);
    return { ok: true as const, preview };
  } catch (error) {
    return {
      ok: false as const,
      error:
        error instanceof Error
          ? error.message
          : "No se pudo leer ese link.",
    };
  }
}
