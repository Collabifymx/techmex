import { NextResponse } from "next/server";
import { publishEvent, publishProject } from "@/lib/publish";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function json(result: { ok: boolean; error?: string }, status = result.ok ? 200 : 400) {
  return NextResponse.json(result, { status });
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (error) {
    console.error("POST /api/publish formData", error);
    return json({
      ok: false,
      error: "El archivo es muy pesado. Inténtalo sin fotos.",
    });
  }

  try {
    const kind = String(formData.get("kind") ?? "project");
    const result =
      kind === "event" ? await publishEvent(formData) : await publishProject(formData);
    return json(result);
  } catch (error) {
    console.error("POST /api/publish", error);
    return json({ ok: false, error: "No se pudo enviar. Intenta de nuevo." });
  }
}
