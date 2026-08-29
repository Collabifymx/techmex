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

const ICON_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

async function uploadProjectIcon(file: File) {
  if (file.size > 1_048_576) {
    throw new Error("El icono debe pesar menos de 1 MB.");
  }
  if (!ICON_TYPES.has(file.type)) {
    throw new Error("El icono tiene que ser PNG, JPG, WebP, GIF o SVG.");
  }

  const ext =
    file.type === "image/svg+xml"
      ? "svg"
      : file.type === "image/jpeg"
        ? "jpg"
        : file.type.split("/")[1] || "png";
  const path = `${crypto.randomUUID()}.${ext}`;
  const supabase = getSupabase();
  const { error } = await supabase.storage.from("project-icons").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error("No se pudo subir el icono.");
  }

  return supabase.storage.from("project-icons").getPublicUrl(path).data.publicUrl;
}

export async function submitProject(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const icon = formData.get("icon");

  if (!name || !url || !email) {
    return { ok: false, error: "Faltan datos esenciales." };
  }

  let iconUrl: string | null = null;
  if (icon instanceof File && icon.size > 0) {
    try {
      iconUrl = await uploadProjectIcon(icon);
    } catch (error) {
      return {
        ok: false,
        error:
          error instanceof Error ? error.message : "No se pudo subir el icono.",
      };
    }
  }

  const { error } = await getSupabase().from("submissions").insert({
    kind: "project",
    name,
    url,
    email,
    description: description || null,
    category: validCategory(category),
    icon_url: iconUrl,
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
