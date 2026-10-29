import { NextResponse } from "next/server";
import {
  createBrowserClient,
  createSupabaseContentRepository,
  fetchSiteContent,
  DEFAULT_SITE_CONTENT,
  normalizeSiteContent,
} from "@art-work/database";

/**
 * GET /api/content (Public Website Content API)
 * Returns the compiled SiteContent tree for public pages.
 * Employs Edge CDN caching headers with stale-while-revalidate for instantaneous loads.
 * Gracefully falls back to DEFAULT_SITE_CONTENT if offline or database unreachable.
 */
export async function GET() {
  try {
    const supabase = createBrowserClient();
    const repo = createSupabaseContentRepository(supabase);
    const result = await fetchSiteContent(repo);

    if (result.ok) {
      return NextResponse.json(normalizeSiteContent(result.data), {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
        },
      });
    }
  } catch {
    // Graceful offline fallback
  }

  return NextResponse.json(normalizeSiteContent(DEFAULT_SITE_CONTENT), {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
    },
  });
}
