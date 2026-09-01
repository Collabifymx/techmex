import { NextResponse } from "next/server";
import { publishEvent, publishProject } from "@/lib/publish";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const kind = String(formData.get("kind") ?? "project");
    const result =
      kind === "event" ? await publishEvent(formData) : await publishProject(formData);

    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  } catch (error) {
    console.error("POST /api/publish", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo enviar. Intenta de nuevo." },
      { status: 400 },
    );
  }
}
