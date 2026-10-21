import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * POST /api/revalidate
 * Secure On-Demand ISR Revalidation Webhook (Phase 07).
 * Allows admin dashboard or background triggers to invalidate cached content trees instantly.
 */
export async function POST(req: NextRequest) {
  const secret =
    req.nextUrl.searchParams.get("secret") ||
    req.headers.get("x-revalidate-secret");
  const expectedSecret =
    process.env.REVALIDATION_SECRET || "art-work-secret-revalidate-key";

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tag = req.nextUrl.searchParams.get("tag");
  const path = req.nextUrl.searchParams.get("path");

  try {
    if (tag) {
      revalidateTag(tag);
    }
    if (path) {
      revalidatePath(path);
    } else {
      revalidatePath("/", "layout");
    }

    return NextResponse.json({
      revalidated: true,
      tag: tag || null,
      path: path || "/",
      now: Date.now(),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Revalidation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
