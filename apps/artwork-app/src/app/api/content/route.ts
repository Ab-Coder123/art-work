import { NextRequest, NextResponse } from "next/server";
import {
  CANONICAL_BILINGUAL_CONTENT,
  CANONICAL_SITE_CONTENT,
  CANONICAL_SITE_CONTENT_AR,
  getCanonicalSiteContent,
} from "@/lib/siteContent";
import {
  createBrowserClient,
  createSupabaseContentRepository,
  fetchBilingualSiteContent,
  fetchSiteContent,
  normalizeSiteContent,
} from "@art-work/database";
import { normalizeLocale } from "@art-work/types";

/**
 * GET /api/content (Public Website Content API)
 * Supports `?locale=en|ar` or `?includeLocales=true` for instant client language switching.
 * Defaults to English (`en`) when no parameters are provided for full backward compatibility.
 */
export async function GET(request: NextRequest) {
  const searchParams = new URL(request.url).searchParams;
  const includeLocales = searchParams.get("includeLocales") === "true";
  const locale = normalizeLocale(searchParams.get("locale"));

  try {
    const supabase = createBrowserClient();
    const repo = createSupabaseContentRepository(supabase);

    if (includeLocales) {
      const bilingualRes = await fetchBilingualSiteContent(repo);
      if (bilingualRes.ok) {
        return NextResponse.json(
          {
            en: normalizeSiteContent(
              { ...CANONICAL_SITE_CONTENT, ...(bilingualRes.data.en || {}) },
              "en"
            ),
            ar: normalizeSiteContent(
              { ...CANONICAL_SITE_CONTENT_AR, ...(bilingualRes.data.ar || {}) },
              "ar"
            ),
          },
          {
            status: 200,
            headers: {
              "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
            },
          }
        );
      }
    } else {
      const result = await fetchSiteContent(repo, locale);
      if (result.ok) {
        const canonicalFallback = getCanonicalSiteContent(locale);
        return NextResponse.json(
          normalizeSiteContent(
            {
              ...canonicalFallback,
              ...(result.data || {}),
            },
            locale
          ),
          {
            status: 200,
            headers: {
              "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
            },
          }
        );
      }
    }
  } catch {
    // Graceful offline fallback
  }

  return NextResponse.json(
    includeLocales ? CANONICAL_BILINGUAL_CONTENT : getCanonicalSiteContent(locale),
    {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
      },
    }
  );
}
