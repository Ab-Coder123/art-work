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

function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      try {
        return String.fromCodePoint(parseInt(hex, 16));
      } catch {
        return "";
      }
    })
    .replace(/&#([0-9]+);/g, (_, dec) => {
      try {
        return String.fromCodePoint(parseInt(dec, 10));
      } catch {
        return "";
      }
    })
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function cleanFacebookHeadline(rawTitle?: string | null): string | null {
  if (!rawTitle) return null;
  const decoded = decodeHtmlEntities(rawTitle);
  if (!decoded) return null;

  // Facebook often prefixes og:title with view/interaction metrics (e.g. "٦٣ ألف مشاهدة · ١٫٥ ألف تفاعل | Title | Page")
  const parts = decoded.split(/\s*\|\s*/);
  if (parts.length >= 2) {
    const candidate = parts.length > 2 ? parts[1] : parts[0];
    const firstLine = candidate.split("\n")[0].trim();
    if (firstLine && !/مشاهدة|تفاعل|views|reactions/i.test(firstLine)) {
      return firstLine.slice(0, 150);
    }
  }

  const firstLine = decoded.split("\n")[0].trim();
  return firstLine.slice(0, 150);
}

/**
 * POST /api/media/facebook/resolve (admin only; CSRF enforced by middleware)
 * Body: { input: string } or { url: string }
 * Returns validated canonicalUrl, embedUrl, isReel flag, thumbnailUrl, headline, and paragraph.
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

  let finalCanonical = result.canonicalUrl;
  let isReel = result.isReel;
  let thumbnailUrl: string | null = null;
  let headline: string | null = null;
  let paragraph: string | null = null;

  try {
    const res = await fetch(result.canonicalUrl, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const html = await res.text();

      const ogUrlMatch =
        html.match(/property=["']og:url["'][^>]*content=["']([^"']+)["']/i) ||
        html.match(/content=["']([^"']+)["'][^>]*property=["']og:url["']/i);
      const ogUrl = ogUrlMatch ? ogUrlMatch[1] : null;

      const ogImageMatch =
        html.match(/property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
        html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
      if (ogImageMatch && ogImageMatch[1]) {
        thumbnailUrl = ogImageMatch[1].replace(/&amp;/g, "&");
      }

      const ogTitleMatch =
        html.match(/property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
        html.match(/content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
      if (ogTitleMatch && ogTitleMatch[1]) {
        headline = cleanFacebookHeadline(ogTitleMatch[1]);
      }

      const ogDescMatch =
        html.match(/property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
        html.match(/content=["']([^"']+)["'][^>]*property=["']og:description["']/i);
      if (ogDescMatch && ogDescMatch[1]) {
        paragraph = decodeHtmlEntities(ogDescMatch[1]).slice(0, 1000);
      }

      // Determine best resolved canonical candidate
      const targetCandidate = ogUrl || (res.url && !res.url.toLowerCase().includes("/login") ? res.url : null);
      if (targetCandidate) {
        const parsedCandidate = parseFacebookVideoInput(targetCandidate);
        if (parsedCandidate.ok) {
          const cleanedUrl = new URL(parsedCandidate.canonicalUrl);
          if (cleanedUrl.pathname.toLowerCase().includes("/watch")) {
            const vParam = cleanedUrl.searchParams.get("v");
            cleanedUrl.search = vParam ? `?v=${encodeURIComponent(vParam)}` : "";
          } else {
            for (const param of TRACKING_PARAMS) {
              cleanedUrl.searchParams.delete(param);
            }
          }
          finalCanonical = cleanedUrl.toString();
          isReel = parsedCandidate.isReel || isReel;
        }
      }
    }
  } catch {
    // Graceful fallback to initial parsed canonical
  }

  return NextResponse.json({
    ok: true,
    canonicalUrl: finalCanonical,
    embedUrl: buildFacebookEmbedUrl(finalCanonical),
    isReel,
    thumbnailUrl,
    headline,
    paragraph,
  });
}
