/**
 * Phase 05: YouTube Media Engine (Videos & Reels/Shorts)
 *
 * Pure, dependency-free (Edge/Node/browser safe) utilities that:
 *  - extract an 11-char video ID from supported YouTube URL shapes (including Shorts/Reels),
 *  - detect whether the link is a vertical 9:16 YouTube Short/Reel (`isShort`),
 *  - reject raw HTML (<iframe> snippets), unsafe protocols and look-alike hosts,
 *  - build embed / poster URLs from the approved host only,
 *  - optionally fetch the video/reel Headline (title) and Paragraph (description) via oEmbed/meta.
 *
 * Only the video ID (and canonical watch/shorts URL + headline/paragraph metadata) is ever persisted.
 */

export const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;
export const YOUTUBE_EMBED_ORIGIN = "https://www.youtube-nocookie.com";
export const YOUTUBE_POSTER_ORIGIN = "https://i.ytimg.com";

/** Exact hostnames accepted for YouTube links (no suffix matching). */
const WATCH_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);
const SHORT_HOSTS = new Set(["youtu.be", "www.youtu.be"]);

/** Path prefixes whose next segment is the video ID. */
const ID_PATH_PREFIXES = new Set(["embed", "shorts", "live", "v", "e"]);

export type YouTubeParseFailure =
  | "empty"
  | "contains_html"
  | "invalid_url"
  | "unsupported_protocol"
  | "unapproved_host"
  | "missing_video_id"
  | "invalid_video_id";

export type YouTubeParseResult =
  | { ok: true; videoId: string; canonicalUrl: string; isShort?: boolean }
  | { ok: false; reason: YouTubeParseFailure };

export interface YouTubeVideoMetadata {
  videoId: string;
  canonicalUrl: string;
  embedUrl: string;
  headline: string;
  paragraph: string;
  authorName: string;
  thumbnailUrl: string;
  isShort: boolean;
}

export function isValidYouTubeId(value: unknown): value is string {
  return typeof value === "string" && YOUTUBE_ID_REGEX.test(value);
}

/**
 * Accepts either a bare 11-char ID or a YouTube URL (Watch, Share, Embed, Live, Shorts/Reel)
 * and returns the validated ID. Never throws.
 */
export function parseYouTubeInput(input: unknown): YouTubeParseResult {
  if (typeof input !== "string") return { ok: false, reason: "empty" };
  const raw = input.trim();
  if (!raw) return { ok: false, reason: "empty" };

  // Raw markup (e.g. a pasted <iframe>) is never accepted.
  if (/[<>"'`\s]/.test(raw)) return { ok: false, reason: "contains_html" };

  if (YOUTUBE_ID_REGEX.test(raw)) return success(raw, false);

  let url: URL;
  try {
    url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return { ok: false, reason: "invalid_url" };
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return { ok: false, reason: "unsupported_protocol" };
  }
  if (url.username || url.password) return { ok: false, reason: "unapproved_host" };

  const host = url.hostname.toLowerCase();
  const segments = url.pathname.split("/").filter(Boolean);
  let candidate: string | undefined;
  let isShort = false;

  if (SHORT_HOSTS.has(host)) {
    candidate = segments[0];
  } else if (WATCH_HOSTS.has(host)) {
    if (segments[0] === "watch") {
      candidate = url.searchParams.get("v") ?? undefined;
    } else if (segments[0] && ID_PATH_PREFIXES.has(segments[0])) {
      candidate = segments[1];
      if (segments[0] === "shorts") {
        isShort = true;
      }
    }
  } else {
    return { ok: false, reason: "unapproved_host" };
  }

  if (!candidate) return { ok: false, reason: "missing_video_id" };
  if (!YOUTUBE_ID_REGEX.test(candidate)) return { ok: false, reason: "invalid_video_id" };
  return success(candidate, isShort);
}

function success(videoId: string, isShort: boolean): YouTubeParseResult {
  const result: { ok: true; videoId: string; canonicalUrl: string; isShort?: boolean } = {
    ok: true,
    videoId,
    canonicalUrl: buildYouTubeWatchUrl(videoId),
  };
  if (isShort) {
    result.isShort = true;
  }
  return result;
}

export function buildYouTubeWatchUrl(videoId: string): string {
  assertId(videoId);
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function buildYouTubeShortsUrl(videoId: string): string {
  assertId(videoId);
  return `https://www.youtube.com/shorts/${videoId}`;
}

export interface EmbedOptions {
  /** Start offset in seconds. */
  start?: number;
  autoplay?: boolean;
}

/** Builds the embed URL from the approved privacy-enhanced host. */
export function buildYouTubeEmbedUrl(videoId: string, options: EmbedOptions = {}): string {
  assertId(videoId);
  const params = new URLSearchParams({ rel: "0", modestbranding: "1" });
  if (options.autoplay) params.set("autoplay", "1");
  if (options.start && Number.isFinite(options.start) && options.start > 0) {
    params.set("start", String(Math.floor(options.start)));
  }
  return `${YOUTUBE_EMBED_ORIGIN}/embed/${videoId}?${params.toString()}`;
}

/** Poster candidates ordered best-first (maxresdefault may 404 on older videos). */
export function getYouTubePosterCandidates(videoId: string): string[] {
  assertId(videoId);
  return ["maxresdefault", "sddefault", "hqdefault"].map(
    (name) => `${YOUTUBE_POSTER_ORIGIN}/vi/${videoId}/${name}.jpg`
  );
}

/**
 * Decodes basic HTML entities in extracted meta descriptions.
 */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extracts description paragraph from YouTube watch/shorts HTML payload if present.
 */
export function extractDescriptionFromHtml(html: string): string | null {
  // 1. Try JSON shortDescription inside ytInitialPlayerResponse
  const shortDescMatch = html.match(/"shortDescription":"((?:[^"\\]|\\.)*)"/);
  if (shortDescMatch && shortDescMatch[1]) {
    try {
      const parsed = JSON.parse(`"${shortDescMatch[1]}"`);
      if (typeof parsed === "string" && parsed.trim().length > 0) {
        return parsed.trim().slice(0, 500);
      }
    } catch {
      // Fallback to regex meta below
    }
  }

  // 2. Try <meta name="description" content="..."> or <meta property="og:description" content="...">
  const metaMatch =
    html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
    html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
  if (metaMatch && metaMatch[1]) {
    const cleaned = decodeHtmlEntities(metaMatch[1]);
    if (cleaned.length > 0) {
      return cleaned.slice(0, 500);
    }
  }

  return null;
}

/**
 * Fetches the Headline (title), Paragraph (description), Author, and Reel/Shorts flag
 * for any valid YouTube video or Reel/Short URL.
 * Gracefully degrades with sensible defaults if offline or rate-limited.
 */
export async function fetchYouTubeMetadata(
  input: string,
  fetchImpl: typeof fetch = globalThis.fetch
): Promise<{ ok: true; data: YouTubeVideoMetadata } | { ok: false; reason: YouTubeParseFailure }> {
  const parsed = parseYouTubeInput(input);
  if (!parsed.ok) {
    return parsed;
  }

  const { videoId, canonicalUrl } = parsed;
  let isShort = Boolean(parsed.isShort);
  let headline = `YouTube Showcase (${videoId})`;
  let authorName = "Art Work Studio";
  let paragraph = "";
  const posters = getYouTubePosterCandidates(videoId);
  let thumbnailUrl = posters[0];

  if (typeof fetchImpl === "function") {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4500);

    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(canonicalUrl)}&format=json`;
      const oembedRes = await fetchImpl(oembedUrl, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });

      if (oembedRes.ok) {
        const json = (await oembedRes.json()) as {
          title?: string;
          author_name?: string;
          thumbnail_url?: string;
          width?: number;
          height?: number;
        };
        if (json.title && json.title.trim()) {
          headline = json.title.trim();
        }
        if (json.author_name && json.author_name.trim()) {
          authorName = json.author_name.trim();
        }
        if (json.thumbnail_url && json.thumbnail_url.trim()) {
          thumbnailUrl = json.thumbnail_url.trim();
        }
        if (
          typeof json.width === "number" &&
          typeof json.height === "number" &&
          json.height > json.width
        ) {
          isShort = true;
        }
      }

      // Attempt to extract full paragraph description from watch page meta
      try {
        const pageRes = await fetchImpl(canonicalUrl, {
          signal: controller.signal,
          headers: {
            "Accept-Language": "en-US,en;q=0.9",
          },
        });
        if (pageRes.ok) {
          const html = await pageRes.text();
          const extractedDesc = extractDescriptionFromHtml(html);
          if (extractedDesc) {
            paragraph = extractedDesc;
          }
        }
      } catch {
        // Ignore secondary HTML scrape errors
      }
    } catch {
      // Network offline or timed out; fall back deterministically
    } finally {
      clearTimeout(timer);
    }
  }

  if (!paragraph) {
    paragraph = isShort
      ? `${headline} — Vertical 9:16 YouTube Reel / Short showcase by ${authorName}.`
      : `${headline} — Live production showcase by ${authorName}.`;
  }

  return {
    ok: true,
    data: {
      videoId,
      canonicalUrl: isShort ? buildYouTubeShortsUrl(videoId) : canonicalUrl,
      embedUrl: buildYouTubeEmbedUrl(videoId),
      headline,
      paragraph,
      authorName,
      thumbnailUrl,
      isShort,
    },
  };
}

function assertId(videoId: string): void {
  if (!isValidYouTubeId(videoId)) {
    throw new Error("Invalid YouTube video ID");
  }
}
