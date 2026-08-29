"use server";

import { fetchEventPreview } from "@/lib/open-graph";
import { getSupabase } from "@/lib/supabase";
import { COMPANY_CATEGORIES } from "@/lib/types";

function validCategory(category: string) {
  return COMPANY_CATEGORIES.includes(
    category as (typeof COMPANY_CATEGORIES)[number],
  )
    ? category
    : null;
}

export async function submitProject(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();

  if (!name || !url || !email) {
    return { ok: false, error: "Faltan datos esenciales." };
  }

  const { error } = await getSupabase().from("submissions").insert({
    kind: "project",
    name,
    url,
    email,
    description: description || null,
    category: validCategory(category),
  });

  if (error) {
    return { ok: false, error: "No se pudo enviar. Intenta de nuevo." };
  }

  return { ok: true };
}

export async function submitEvent(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const venue = String(formData.get("venue") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const startsAt = String(formData.get("startsAt") ?? "").trim();
  const time = String(formData.get("time") ?? "").trim();
  const ogImage = String(formData.get("ogImage") ?? "").trim();

  if (!email) {
    return { ok: false, error: "Necesitamos un correo de contacto." };
  }

  if (!url && (!name || !startsAt || !city)) {
    return {
      ok: false,
      error: "Pega un link del evento o llena nombre, fecha y ciudad.",
    };
  }

  const { error } = await getSupabase().from("submissions").insert({
    kind: "event",
    name: name || "Evento",
    url: url || "https://somostechmex.com/eventos",
    email,
    description: description || null,
    city: city || null,
    venue: venue || null,
    address: address || null,
    starts_at: startsAt || null,
    starts_time: time || null,
    og_image: ogImage || null,
  });

  if (error) {
    return { ok: false, error: "No se pudo enviar. Intenta de nuevo." };
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
