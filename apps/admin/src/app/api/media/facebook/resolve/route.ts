import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminSessionFromCookies,
  parseFacebookVideoInput,
  buildFacebookEmbedUrl,
} from "@art-work/database";

const TRACKING_PARAMS = [
  "mibextid",
  "rdid",
  "share_url",
  "fbclid",
  "ref",
  "fs",
  "s",
  "sfnsn",
  "wtsid",
];

/**
 * POST /api/media/facebook/resolve (admin only; CSRF enforced by middleware)
 * Body: { input: string } or { url: string }
 * Returns validated canonicalUrl, embedUrl, and isReel flag.
 */
export async function POST(request: NextRequest) {
  const sessionCheck = await verifyAdminSessionFromCookies({
    getAll: () => request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
  });
  if (!sessionCheck.ok) {
    return NextResponse.json({ error: sessionCheck.error }, { status: sessionCheck.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const payload = body as { input?: unknown; url?: unknown } | null;
  const rawInput = (payload?.input || payload?.url) as string | undefined;

  const result = parseFacebookVideoInput(rawInput);
  if (!result.ok) {
    return NextResponse.json(
      { error: "Invalid Facebook video URL", reason: result.reason },
      { status: 422 }
    );
  }

  const lowerCanonical = result.canonicalUrl.toLowerCase();
  const isShortOrShare =
    lowerCanonical.includes("/share/r/") ||
    lowerCanonical.includes("/share/v/") ||
    lowerCanonical.includes("fb.watch");

  if (isShortOrShare) {
    try {
      const res = await fetch(result.canonicalUrl, {
        method: "HEAD",
        redirect: "follow",
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(4000),
      });

      if (res.url && !res.url.toLowerCase().includes("/login")) {
        const resolvedParsed = parseFacebookVideoInput(res.url);
        if (resolvedParsed.ok) {
          const cleanedUrl = new URL(resolvedParsed.canonicalUrl);
          if (cleanedUrl.pathname.toLowerCase().includes("/watch")) {
            const vParam = cleanedUrl.searchParams.get("v");
            cleanedUrl.search = vParam ? `?v=${encodeURIComponent(vParam)}` : "";
          } else {
            for (const param of TRACKING_PARAMS) {
              cleanedUrl.searchParams.delete(param);
            }
          }

          const finalCanonical = cleanedUrl.toString();
          return NextResponse.json({
            ok: true,
            canonicalUrl: finalCanonical,
            embedUrl: buildFacebookEmbedUrl(finalCanonical),
            isReel: result.isReel || resolvedParsed.isReel,
          });
        }
      }
    } catch {
      // Fall back cleanly to the initial parsed result
    }
  }

  return NextResponse.json(result);
}
