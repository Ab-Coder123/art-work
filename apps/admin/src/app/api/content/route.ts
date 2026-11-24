import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminSessionFromCookies,
  createSupabaseContentRepository,
  createBrowserClient,
  fetchBilingualSiteContent,
  fetchSiteContent,
  normalizeSiteContent,
} from "@art-work/database";
import { normalizeLocale } from "@art-work/types";

/**
 * GET /api/content
 * Retrieves the compiled SiteContent tree (or bilingual { en, ar } bundle when ?includeLocales=true).
 */
export async function GET(request: NextRequest) {
  const sessionCheck = await verifyAdminSessionFromCookies({
    getAll: () =>
      request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
  });

  const supabase = sessionCheck.ok
    ? sessionCheck.supabase
    : createBrowserClient();

  const searchParams = new URL(request.url).searchParams;
  const includeLocales = searchParams.get("includeLocales") === "true";
  const locale = normalizeLocale(searchParams.get("locale"));

  try {
    const repo = createSupabaseContentRepository(supabase);
    if (includeLocales) {
      const bilingual = await fetchBilingualSiteContent(repo);
      if (!bilingual.ok) {
        return NextResponse.json({ error: bilingual.error }, { status: bilingual.status });
      }
      return NextResponse.json(bilingual.data, { status: 200 });
    }

    const result = await fetchSiteContent(repo, locale);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(normalizeSiteContent(result.data, locale), { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to load site content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
