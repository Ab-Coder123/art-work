import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminSessionFromCookies,
  parseYouTubeInput,
  buildYouTubeEmbedUrl,
  getYouTubePosterCandidates,
  fetchYouTubeMetadata,
} from "@art-work/database";

/**
 * POST /api/media/youtube/resolve  (admin only; CSRF enforced by middleware)
 * Body: { input: string, fetchMetadata?: boolean }  — a YouTube URL (video or Reel/Shorts) or bare video ID.
 * Returns the validated ID, canonical URL, embed URL, poster candidates, isShort flag,
 * and when fetchMetadata !== false, the extracted headline (title) and paragraph (description).
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

  const payload = body as { input?: unknown; fetchMetadata?: boolean } | null;
  const input = payload?.input;
  const result = parseYouTubeInput(input);
  if (!result.ok) {
    return NextResponse.json({ error: "Invalid YouTube link", reason: result.reason }, { status: 422 });
  }

  // If caller requests metadata enrichment (default when fetchMetadata === true)
  if (payload?.fetchMetadata && typeof input === "string") {
    const metaResult = await fetchYouTubeMetadata(input);
    if (metaResult.ok) {
      return NextResponse.json({
        videoId: metaResult.data.videoId,
        canonicalUrl: metaResult.data.canonicalUrl,
        embedUrl: metaResult.data.embedUrl,
        posterCandidates: getYouTubePosterCandidates(metaResult.data.videoId),
        isShort: metaResult.data.isShort,
        headline: metaResult.data.headline,
        paragraph: metaResult.data.paragraph,
        authorName: metaResult.data.authorName,
        thumbnailUrl: metaResult.data.thumbnailUrl,
      });
    }
  }

  return NextResponse.json({
    videoId: result.videoId,
    canonicalUrl: result.canonicalUrl,
    embedUrl: buildYouTubeEmbedUrl(result.videoId),
    posterCandidates: getYouTubePosterCandidates(result.videoId),
    isShort: Boolean(result.isShort),
  });
}
