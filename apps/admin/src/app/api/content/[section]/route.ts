import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminSessionFromCookies,
  createSupabaseContentRepository,
  updateContentSection,
} from "@art-work/database";

/**
 * PUT /api/content/[section]
 * Atomically updates a specific content section (manifesto, whyUsTeaser, contact, whyUsPage).
 * Creates audit log via Supabase Postgres trigger.
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ section: string }> }
) {
  const sessionCheck = await verifyAdminSessionFromCookies({
    getAll: () =>
      request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
  });
  if (!sessionCheck.ok) {
    return NextResponse.json(
      { error: sessionCheck.error },
      { status: sessionCheck.status }
    );
  }

  const { section } = await context.params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const repo = createSupabaseContentRepository(sessionCheck.supabase);
    const actorEmail = sessionCheck.adminUser?.email || "admin@art-work.agency";
    const result = await updateContentSection(section, body, repo, actorEmail);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    // Trigger on-demand cache revalidation on the public website (fire-and-forget)
    const publicAppUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.PUBLIC_APP_URL ||
      "https://artwork-agency.vercel.app";
    const revalidateSecret =
      process.env.REVALIDATION_SECRET || "art-work-secret-revalidate-key";
    fetch(`${publicAppUrl}/api/revalidate?secret=${revalidateSecret}&tag=site-content`, {
      method: "POST",
    }).catch(() => {});

    return NextResponse.json(result.data, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : `Failed to update section ${section}`;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
