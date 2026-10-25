import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminSessionFromCookies,
  createSupabaseContentRepository,
  createBrowserClient,
  fetchSiteContent,
  normalizeSiteContent,
} from "@art-work/database";

/**
 * GET /api/content
 * Retrieves the compiled SiteContent tree for the admin editor.
 */
export async function GET(request: NextRequest) {
  const sessionCheck = await verifyAdminSessionFromCookies({
    getAll: () =>
      request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
  });

  const supabase = sessionCheck.ok
    ? sessionCheck.supabase
    : createBrowserClient();

  try {
    const repo = createSupabaseContentRepository(supabase);
    const result = await fetchSiteContent(repo);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(normalizeSiteContent(result.data), { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to load site content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
