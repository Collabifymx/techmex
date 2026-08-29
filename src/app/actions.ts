"use server";

import { fetchEventPreview } from "@/lib/open-graph";
import { parseSocialsFromJson } from "@/lib/socials";
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

async function uploadPublicImage(file: File, label: string) {
  if (file.size > 1_048_576) {
    throw new Error(`${label} debe pesar menos de 1 MB.`);
  }
  if (!ICON_TYPES.has(file.type)) {
    throw new Error(`${label} tiene que ser PNG, JPG, WebP, GIF o SVG.`);
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
    throw new Error(`No se pudo subir ${label.toLowerCase()}.`);
  }

  return supabase.storage.from("project-icons").getPublicUrl(path).data.publicUrl;
}

export async function submitProject(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();
  const founderName = String(formData.get("founderName") ?? "").trim();
  const icon = formData.get("icon");
  const founderPhoto = formData.get("founderPhoto");
  const socials = parseSocialsFromJson(String(formData.get("socials") ?? ""));

  if (!name || !url || !email || !city || !state || !founderName) {
    return { ok: false, error: "Faltan datos esenciales." };
  }

  let iconUrl: string | null = null;
  let founderPhotoUrl: string | null = null;
  try {
    if (icon instanceof File && icon.size > 0) {
      iconUrl = await uploadPublicImage(icon, "El icono");
    }
    if (founderPhoto instanceof File && founderPhoto.size > 0) {
      founderPhotoUrl = await uploadPublicImage(founderPhoto, "La foto del founder");
    }
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "No se pudo subir la imagen.",
    };
  }

  const { error } = await getSupabase().from("submissions").insert({
    kind: "project",
    name,
    url,
    email,
    description: description || null,
    category: validCategory(category),
    city,
    state,
    icon_url: iconUrl,
    founder_name: founderName,
    founder_photo_url: founderPhotoUrl,
    socials,
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
  const state = String(formData.get("state") ?? "").trim();
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
    state: state || null,
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
