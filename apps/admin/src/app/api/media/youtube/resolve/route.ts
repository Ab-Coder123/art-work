import { NextRequest, NextResponse } from "next/server";
import {
  createServerClient,
  verifyAdminMembership,
  parseYouTubeInput,
  buildYouTubeEmbedUrl,
  getYouTubePosterCandidates,
} from "@art-work/database";

/**
 * POST /api/media/youtube/resolve  (admin only; CSRF enforced by middleware)
 * Body: { input: string }  — a YouTube URL or bare video ID.
 * Returns the validated ID, canonical URL, embed URL and poster candidates.
 * Pure parsing: makes no outbound network request.
 */
export async function POST(request: NextRequest) {
  const supabase = createServerClient({
    getAll: () => request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
  });

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  const membership = await verifyAdminMembership(supabase, user.id);
  if (!membership.isAuthorized) {
    return NextResponse.json({ error: "Administrator access required" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const input = (body as { input?: unknown } | null)?.input;
  const result = parseYouTubeInput(input);
  if (!result.ok) {
    return NextResponse.json({ error: "Invalid YouTube link", reason: result.reason }, { status: 422 });
  }

  return NextResponse.json({
    videoId: result.videoId,
    canonicalUrl: result.canonicalUrl,
    embedUrl: buildYouTubeEmbedUrl(result.videoId),
    posterCandidates: getYouTubePosterCandidates(result.videoId),
  });
}
