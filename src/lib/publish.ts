import {
  firstImageFile,
  resolveImageType,
  validatePublishImage,
} from "@/lib/publish-image";
import { parseSocialsFromJson } from "@/lib/socials";
import { getSupabase } from "@/lib/supabase";
import { COMPANY_CATEGORIES } from "@/lib/types";
import { normalizeWebsiteUrl } from "@/lib/website-url";

export type PublishResult = { ok: true } | { ok: false; error: string };

function validCategory(category: string) {
  return COMPANY_CATEGORIES.includes(
    category as (typeof COMPANY_CATEGORIES)[number],
  )
    ? category
    : null;
}

function clip(value: string, max: number) {
  return value.length > max ? value.slice(0, max).trim() : value;
}

function normalizeEmail(raw: string) {
  let value = raw.trim().replace(/^mailto:/i, "");
  const angled = value.match(/<([^<>@\s]+@[^<>@\s]+)>/);
  if (angled) value = angled[1];
  value = value.replace(/\s+/g, "").toLowerCase();
  if (value.length > 254) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return null;
  return value;
}

function parseDateOnly(raw: string) {
  const match = raw.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return `${match[1]}-${match[2]}-${match[3]}`;
}

async function tryUploadPublicImage(file: File, label: string) {
  const typeError = validatePublishImage(file, label);
  if (typeError) return null;

  const contentType = resolveImageType(file);
  if (!contentType) return null;

  const ext =
    contentType === "image/svg+xml"
      ? "svg"
      : contentType === "image/jpeg"
        ? "jpg"
        : contentType.split("/")[1] || "png";
  const path = `${crypto.randomUUID()}.${ext}`;

  try {
    const supabase = getSupabase();
    const { error } = await supabase.storage
      .from("project-icons")
      .upload(path, file, {
        contentType,
        upsert: false,
      });

    if (error) {
      console.error("project-icons upload", error);
      return null;
    }

    return supabase.storage.from("project-icons").getPublicUrl(path).data
      .publicUrl;
  } catch (error) {
    console.error("project-icons upload failed", error);
    return null;
  }
}

export async function publishProject(formData: FormData): Promise<PublishResult> {
  try {
    const name = clip(String(formData.get("name") ?? "").trim(), 200);
    const url = String(formData.get("url") ?? "").trim();
    const emailRaw = String(formData.get("email") ?? "").trim();
    const email = normalizeEmail(emailRaw);
    const description = clip(String(formData.get("description") ?? "").trim(), 4000);
    const category = String(formData.get("category") ?? "").trim();
    const city = clip(String(formData.get("city") ?? "").trim(), 80);
    const state = clip(String(formData.get("state") ?? "").trim(), 80);
    const founderName = clip(String(formData.get("founderName") ?? "").trim(), 200);
    const socials = parseSocialsFromJson(String(formData.get("socials") ?? ""));

    if (emailRaw && !email) {
      return { ok: false, error: "Ese correo no se entiende." };
    }
    if (!name || !url || !email || !city || !state || !founderName) {
      return { ok: false, error: "Faltan datos esenciales." };
    }

    const website = normalizeWebsiteUrl(url);
    if (!website) {
      return {
        ok: false,
        error:
          "Ese sitio no se entiende. Prueba www.tudominio.com.mx o el link completo.",
      };
    }

    const icon = firstImageFile(formData, "icon");
    const founderPhoto = firstImageFile(formData, "founderPhoto");
    const iconUrl = icon ? await tryUploadPublicImage(icon, "El icono") : null;
    const founderPhotoUrl = founderPhoto
      ? await tryUploadPublicImage(founderPhoto, "La foto del founder")
      : null;

    const { error } = await getSupabase().from("submissions").insert({
      kind: "project",
      name,
      url: website,
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
      console.error("submissions insert project", error);
      return { ok: false, error: "No se pudo enviar. Intenta de nuevo." };
    }

    return { ok: true };
  } catch (error) {
    console.error("publishProject failed", error);
    return {
      ok: false,
      error: "No se pudo enviar. Intenta de nuevo.",
    };
  }
}

export async function publishEvent(formData: FormData): Promise<PublishResult> {
  try {
    const name = clip(String(formData.get("name") ?? "").trim(), 200);
    const url = String(formData.get("url") ?? "").trim();
    const emailRaw = String(formData.get("email") ?? "").trim();
    const email = normalizeEmail(emailRaw);
    const description = clip(String(formData.get("description") ?? "").trim(), 4000);
    const city = clip(String(formData.get("city") ?? "").trim(), 80);
    const state = clip(String(formData.get("state") ?? "").trim(), 80);
    const venue = clip(String(formData.get("venue") ?? "").trim(), 200);
    const address = clip(String(formData.get("address") ?? "").trim(), 300);
    const startsAt = parseDateOnly(String(formData.get("startsAt") ?? ""));
    const time = clip(String(formData.get("time") ?? "").trim(), 20);
    const ogImage = clip(String(formData.get("ogImage") ?? "").trim(), 500);

    if (emailRaw && !email) {
      return { ok: false, error: "Ese correo no se entiende." };
    }
    if (!email) {
      return { ok: false, error: "Necesitamos un correo de contacto." };
    }

    if (!url && (!name || !startsAt || !city)) {
      return {
        ok: false,
        error: "Pega un link del evento o llena nombre, fecha y ciudad.",
      };
    }

    const website = url ? normalizeWebsiteUrl(url) : null;
    if (url && !website) {
      return {
        ok: false,
        error:
          "Ese sitio no se entiende. Prueba www.tudominio.com.mx o el link completo.",
      };
    }

    const { error } = await getSupabase().from("submissions").insert({
      kind: "event",
      name: name || "Evento",
      url: website || "https://somostechmex.com/eventos",
      email,
      description: description || null,
      city: city || null,
      state: state || null,
      venue: venue || null,
      address: address || null,
      starts_at: startsAt,
      starts_time: time || null,
      og_image: ogImage || null,
    });

    if (error) {
      console.error("submissions insert event", error);
      return { ok: false, error: "No se pudo enviar. Intenta de nuevo." };
    }

    return { ok: true };
  } catch (error) {
    console.error("publishEvent failed", error);
    return {
      ok: false,
      error: "No se pudo enviar. Intenta de nuevo.",
    };
  }
}
