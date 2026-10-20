/**
 * Phase 05: YouTube Media Engine
 *
 * Pure, dependency-free (Edge/Node/browser safe) utilities that:
 *  - extract an 11-char video ID from supported YouTube URL shapes,
 *  - reject raw HTML (<iframe> snippets), unsafe protocols and look-alike hosts,
 *  - build embed / poster URLs from the approved host only.
 *
 * Only the video ID (and canonical watch URL) is ever persisted.
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
  | { ok: true; videoId: string; canonicalUrl: string }
  | { ok: false; reason: YouTubeParseFailure };

export function isValidYouTubeId(value: unknown): value is string {
  return typeof value === "string" && YOUTUBE_ID_REGEX.test(value);
}

/**
 * Accepts either a bare 11-char ID or a YouTube URL and returns the validated ID.
 * Never throws.
 */
export function parseYouTubeInput(input: unknown): YouTubeParseResult {
  if (typeof input !== "string") return { ok: false, reason: "empty" };
  const raw = input.trim();
  if (!raw) return { ok: false, reason: "empty" };

  // Raw markup (e.g. a pasted <iframe>) is never accepted.
  if (/[<>"'`\s]/.test(raw)) return { ok: false, reason: "contains_html" };

  if (YOUTUBE_ID_REGEX.test(raw)) return success(raw);

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

  if (SHORT_HOSTS.has(host)) {
    candidate = segments[0];
  } else if (WATCH_HOSTS.has(host)) {
    if (segments[0] === "watch") {
      candidate = url.searchParams.get("v") ?? undefined;
    } else if (segments[0] && ID_PATH_PREFIXES.has(segments[0])) {
      candidate = segments[1];
    }
  } else {
    return { ok: false, reason: "unapproved_host" };
  }

  if (!candidate) return { ok: false, reason: "missing_video_id" };
  if (!YOUTUBE_ID_REGEX.test(candidate)) return { ok: false, reason: "invalid_video_id" };
  return success(candidate);
}

function success(videoId: string): YouTubeParseResult {
  return { ok: true, videoId, canonicalUrl: buildYouTubeWatchUrl(videoId) };
}

export function buildYouTubeWatchUrl(videoId: string): string {
  assertId(videoId);
  return `https://www.youtube.com/watch?v=${videoId}`;
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

function assertId(videoId: string): void {
  if (!isValidYouTubeId(videoId)) {
    throw new Error("Invalid YouTube video ID");
  }
}
