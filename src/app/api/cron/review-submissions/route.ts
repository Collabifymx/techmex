import { NextResponse } from "next/server";
import { reviewPendingSubmissions } from "@/lib/review-submissions";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await reviewPendingSubmissions();
    return NextResponse.json({
      ok: true,
      reviewed: results.length,
      approved: results.filter((item) => item.action === "approve").length,
      rejected: results.filter((item) => item.action === "reject").length,
      results,
    });
  } catch (error) {
    console.error("review-submissions cron failed", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "cron failed" },
      { status: 500 },
    );
  }
}
