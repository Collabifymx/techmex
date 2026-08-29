"use server";

import { getSupabase } from "@/lib/supabase";
import { COMPANY_CATEGORIES } from "@/lib/types";

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
    name,
    url,
    email,
    description: description || null,
    category: COMPANY_CATEGORIES.includes(
      category as (typeof COMPANY_CATEGORIES)[number],
    )
      ? category
      : null,
  });

  if (error) {
    return { ok: false, error: "No se pudo enviar. Intenta de nuevo." };
  }

  return { ok: true };
}
