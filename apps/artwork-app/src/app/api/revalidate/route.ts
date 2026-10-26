import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

const ALLOWED_TAGS = new Set([
  "content",
  "site-content",
  "site_content",
  "projects",
  "companies",
]);

const ALLOWED_PATHS = new Set(["/", "/why-us", "/gallery"]);

/**
 * POST /api/revalidate
 * Secure On-Demand ISR Revalidation Webhook.
 * Accepts secret strictly via 'x-revalidate-secret' or 'authorization' header.
 * Fails closed when secret is unconfigured; strictly validates against allowlist.
 */
export async function POST(req: NextRequest) {
  const expectedSecret = process.env.REVALIDATION_SECRET;
  if (!expectedSecret) {
    return NextResponse.json(
      { error: "Revalidation webhook is not configured on this server" },
      { status: 503 }
    );
  }

  // Strictly enforce header transmission (no secret in URL query parameters)
  const incomingSecret =
    req.headers.get("x-revalidate-secret") ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!incomingSecret || incomingSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let tag: string | null = null;
  let path: string | null = null;

  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      tag = body.tag || null;
      path = body.path || null;
    }
  } catch {
    // Ignore json parse error and check query params below
  }

  if (!tag && !path) {
    tag = req.nextUrl.searchParams.get("tag");
    path = req.nextUrl.searchParams.get("path");
  }

  // Enforce allowlist for tags
  if (tag && !ALLOWED_TAGS.has(tag)) {
    return NextResponse.json(
      { error: `Tag '${tag}' is not in the allowed revalidation list` },
      { status: 400 }
    );
  }

  // Enforce allowlist for paths
  if (path && !ALLOWED_PATHS.has(path)) {
    return NextResponse.json(
      { error: `Path '${path}' is not in the allowed revalidation list` },
      { status: 400 }
    );
  }

  try {
    if (tag) {
      revalidateTag(tag);
    }
    if (path) {
      revalidatePath(path);
    } else if (!tag) {
      revalidatePath("/", "layout");
    }

    return NextResponse.json({
      revalidated: true,
      tag: tag || null,
      path: path || (tag ? null : "/"),
      now: Date.now(),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Revalidation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
