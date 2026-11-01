/**
 * Behance Media Engine
 *
 * Pure, dependency-free (Edge/Node/browser safe) utilities for Behance project integration:
 *  - Parses and validates Behance project and portfolio links,
 *  - Rejects raw HTML (<iframe> tags), unsafe protocols, and unapproved hosts,
 *  - Resolves project cover images and metadata via Behance oEmbed and OpenGraph scraping.
 */

import { BEHANCE_HOSTS, isValidBehanceUrl } from "@art-work/types";

export type BehanceParseFailure =
  | "empty"
  | "contains_html"
  | "invalid_url"
  | "unsupported_protocol"
  | "unapproved_host"
  | "unsupported_path";

export type BehanceParseResult =
  | {
      ok: true;
      canonicalUrl: string;
      projectId?: string | null;
      slug?: string | null;
    }
  | { ok: false; reason: BehanceParseFailure };

export interface BehanceProjectMetadata {
  canonicalUrl: string;
  projectId?: string | null;
  title: string;
  description: string;
  coverImageUrl: string;
  authorName: string;
}

export type BehanceFetchResult =
  | { ok: true; data: BehanceProjectMetadata }
  | { ok: false; error: string };

/**
 * Validates and normalizes Behance project URLs.
 */
export function parseBehanceInput(input: unknown): BehanceParseResult {
  if (typeof input !== "string") return { ok: false, reason: "empty" };
  const raw = input.trim();
  if (!raw) return { ok: false, reason: "empty" };

  // Reject markup or script injection
  if (/[<>"'`\s]/.test(raw)) return { ok: false, reason: "contains_html" };

  let parsed: URL;
  try {
    const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(raw);
    parsed = new URL(hasScheme ? raw : `https://${raw}`);
  } catch {
    return { ok: false, reason: "invalid_url" };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, reason: "unsupported_protocol" };
  }

  const hostname = parsed.hostname.toLowerCase();
  if (!BEHANCE_HOSTS.has(hostname)) {
    return { ok: false, reason: "unapproved_host" };
  }

  const cleanPath = parsed.pathname.replace(/\/+$/, "");
  const segments = cleanPath.split("/").filter(Boolean);

  let projectId: string | null = null;
  let slug: string | null = null;

  // Format: /gallery/:id/:slug or /gallery/:id
  if (segments[0] === "gallery" && segments[1]) {
    projectId = segments[1];
    slug = segments[2] || null;
  } else if (segments.length >= 1) {
    // Other valid project shapes (e.g. /username/project)
    slug = segments[segments.length - 1] || null;
  }

  const canonicalUrl = `https://www.behance.net${cleanPath}`;

  return {
    ok: true,
    canonicalUrl,
    projectId,
    slug,
  };
}

/**
 * Decodes standard HTML entities in meta content strings.
 */
function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

/**
 * Extracts meta tag content from raw HTML string.
 */
function extractMetaTag(html: string, propertyOrName: string): string | null {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${propertyOrName}["'][^>]+content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${propertyOrName}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${propertyOrName}["'][^>]+content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+name=["']${propertyOrName}["']`, "i"),
  ];

  for (const regex of patterns) {
    const match = html.match(regex);
    if (match && match[1]) {
      return decodeHtmlEntities(match[1]);
    }
  }

  return null;
}

/**
 * Fetches Behance project metadata via official oEmbed and OpenGraph fallback.
 */
export async function fetchBehanceMetadata(
  urlOrInput: string,
  fetchFn: typeof fetch = fetch
): Promise<BehanceFetchResult> {
  const parsed = parseBehanceInput(urlOrInput);
  if (!parsed.ok) {
    return { ok: false, error: `Invalid Behance URL: ${parsed.reason}` };
  }

  const { canonicalUrl, projectId } = parsed;

  // 1. Try Behance oEmbed Endpoint
  try {
    const oembedUrl = `https://www.behance.net/services/oembed?url=${encodeURIComponent(canonicalUrl)}`;
    const oembedRes = await fetchFn(oembedUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "ArtWorkStudio/2026 (Experiential Architecture & Booth Showcase)",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (oembedRes.ok) {
      const data = (await oembedRes.json()) as {
        title?: string;
        description?: string;
        thumbnail_url?: string;
        author_name?: string;
      };

      if (data.thumbnail_url || data.title) {
        return {
          ok: true,
          data: {
            canonicalUrl,
            projectId,
            title: data.title || "Behance Project",
            description: data.description || "",
            coverImageUrl: data.thumbnail_url || "",
            authorName: data.author_name || "Behance Creator",
          },
        };
      }
    }
  } catch {
    // Continue to OpenGraph HTML fallback
  }

  // 2. OpenGraph Fallback: Scrape Behance HTML page
  try {
    const htmlRes = await fetchFn(canonicalUrl, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(6000),
    });

    if (htmlRes.ok) {
      const html = await htmlRes.text();
      const title =
        extractMetaTag(html, "og:title") ||
        extractMetaTag(html, "twitter:title") ||
        "Behance Exhibition Booth";
      const description =
        extractMetaTag(html, "og:description") ||
        extractMetaTag(html, "twitter:description") ||
        "";
      const coverImageUrl =
        extractMetaTag(html, "og:image") ||
        extractMetaTag(html, "twitter:image") ||
        "";

      if (coverImageUrl) {
        return {
          ok: true,
          data: {
            canonicalUrl,
            projectId,
            title,
            description,
            coverImageUrl,
            authorName: "Behance Creator",
          },
        };
      }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error";
    return { ok: false, error: `Failed to fetch Behance project details: ${msg}` };
  }

  return {
    ok: true,
    data: {
      canonicalUrl,
      projectId,
      title: "Behance Exhibition Booth",
      description: "",
      coverImageUrl: "",
      authorName: "Behance Creator",
    },
  };
}
