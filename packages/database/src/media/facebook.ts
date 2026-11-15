/**
 * Facebook Video Media Engine
 *
 * Pure, dependency-free (Edge/Node/browser safe) utilities for Facebook video and reel integration:
 *  - Parses and validates Facebook video links (watch, reels, page videos, fb.watch, share links),
 *  - Rejects raw HTML (<iframe> tags), unsafe protocols, and unapproved hosts,
 *  - Constructs official privacy-safe embed URLs using Facebook's embedded video player plugin.
 */

import {
  FACEBOOK_HOSTS,
  isValidFacebookVideoUrl,
  resolveSafeFacebookEmbed,
  extractFacebookVideoUrlFromSnippet,
  isUnresolvedFacebookShareUrl,
} from "@art-work/types";

export {
  FACEBOOK_HOSTS,
  isValidFacebookVideoUrl,
  resolveSafeFacebookEmbed,
  extractFacebookVideoUrlFromSnippet,
  isUnresolvedFacebookShareUrl,
};

export type FacebookParseFailure =
  | "empty"
  | "contains_html"
  | "invalid_url"
  | "unsupported_protocol"
  | "unapproved_host"
  | "not_a_video_link";

export type FacebookParseResult =
  | {
      ok: true;
      canonicalUrl: string;
      embedUrl: string;
      isReel: boolean;
    }
  | { ok: false; reason: FacebookParseFailure };

/**
 * Builds the official Facebook Embedded Video Player iframe URL.
 */
export function buildFacebookEmbedUrl(canonicalUrl: string): string {
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
    canonicalUrl
  )}&show_text=0`;
}

/**
 * Validates and normalizes Facebook video and reel links.
 * Accepts full URLs (with or without protocol) from approved Facebook hosts.
 * Never throws on malformed or unexpected inputs.
 */
export function parseFacebookVideoInput(
  input: unknown,
  explicitIsShort?: boolean | null
): FacebookParseResult {
  if (typeof input !== "string") return { ok: false, reason: "empty" };
  const raw = extractFacebookVideoUrlFromSnippet(input).trim();
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

  if (parsed.username || parsed.password) {
    return { ok: false, reason: "unapproved_host" };
  }

  const hostname = parsed.hostname.toLowerCase();
  if (!FACEBOOK_HOSTS.has(hostname)) {
    return { ok: false, reason: "unapproved_host" };
  }

  const path = parsed.pathname.toLowerCase();
  const search = parsed.search.toLowerCase();

  // Verify that it's a video or reel link:
  // 1. /watch/?v=... or /watch?v=...
  // 2. /reel/... or /reels/...
  // 3. /videos/... or /<page>/videos/...
  // 4. fb.watch/<id>
  // 5. /share/v/... or /share/r/...
  // 6. /posts/... (often contains videos)
  const isWatch = path.includes("/watch") && search.includes("v=");
  const inferredReel =
    path.includes("/reel/") ||
    path.includes("/reels/") ||
    path.includes("/share/r/");
  const isVideoPath = path.includes("/videos/") || path.includes("/share/v/");
  const isFbWatch = hostname.includes("fb.watch");
  const isPost = path.includes("/posts/") || path.includes("/videos");

  const isRecognizedVideo = isWatch || inferredReel || isVideoPath || isFbWatch || isPost;

  if (!isRecognizedVideo && path === "/") {
    return { ok: false, reason: "not_a_video_link" };
  }

  const isReel =
    explicitIsShort !== undefined && explicitIsShort !== null
      ? Boolean(explicitIsShort)
      : inferredReel;

  const canonicalUrl = parsed.toString();
  const embedUrl = buildFacebookEmbedUrl(canonicalUrl);

  return {
    ok: true,
    canonicalUrl,
    embedUrl,
    isReel,
  };
}
