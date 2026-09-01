import { resolveImageType, validatePublishImage } from "@/lib/publish-image";
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

async function uploadPublicImage(file: File, label: string) {
  const typeError = validatePublishImage(file, label);
  if (typeError) throw new Error(typeError);

  const contentType = resolveImageType(file);
  if (!contentType) {
    throw new Error(`${label} tiene que ser PNG, JPG, WebP, GIF o SVG.`);
  }

  const ext =
    contentType === "image/svg+xml"
      ? "svg"
      : contentType === "image/jpeg"
        ? "jpg"
        : contentType.split("/")[1] || "png";
  const path = `${crypto.randomUUID()}.${ext}`;
  const supabase = getSupabase();
  const { error } = await supabase.storage.from("project-icons").upload(path, file, {
    contentType,
    upsert: false,
  });

  if (error) {
    console.error("project-icons upload", error);
    throw new Error(`No se pudo subir ${label.toLowerCase()}.`);
  }

  return supabase.storage.from("project-icons").getPublicUrl(path).data.publicUrl;
}

export async function publishProject(formData: FormData): Promise<PublishResult> {
  try {
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

    const website = normalizeWebsiteUrl(url);
    if (!website) {
      return {
        ok: false,
        error:
          "Ese sitio no se entiende. Prueba www.tudominio.com.mx o el link completo.",
      };
    }

    let iconUrl: string | null = null;
    let founderPhotoUrl: string | null = null;
    if (icon instanceof File && icon.size > 0) {
      const invalid = validatePublishImage(icon, "El icono");
      if (invalid) return { ok: false, error: invalid };
      iconUrl = await uploadPublicImage(icon, "El icono");
    }
    if (founderPhoto instanceof File && founderPhoto.size > 0) {
      const invalid = validatePublishImage(
        founderPhoto,
        "La foto del founder",
      );
      if (invalid) return { ok: false, error: invalid };
      founderPhotoUrl = await uploadPublicImage(
        founderPhoto,
        "La foto del founder",
      );
    }

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
      error:
        error instanceof Error ? error.message : "No se pudo enviar. Intenta de nuevo.",
    };
  }
}

export async function publishEvent(formData: FormData): Promise<PublishResult> {
  try {
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
      starts_at: startsAt || null,
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
      error:
        error instanceof Error ? error.message : "No se pudo enviar. Intenta de nuevo.",
    };
  }
}
