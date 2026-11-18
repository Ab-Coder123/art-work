import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = [
  "rqawbqowfecrxrezdnal.supabase.co",
  "supabase.co",
];

/**
 * GET /api/pdf-proxy?url=<encoded_supabase_url>
 * Streams PDF documents from Supabase Storage under the same origin
 * to eliminate cross-origin iframe restrictions in Edge, Chrome, Safari, and Firefox.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing 'url' parameter" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL provided" }, { status: 400 });
  }

  const isAllowed = ALLOWED_HOSTS.some(
    (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)
  );

  if (!isAllowed) {
    return NextResponse.json(
      { error: "Host not allowed for proxy" },
      { status: 403 }
    );
  }

  try {
    const upstreamRes = await fetch(targetUrl, {
      headers: {
        Accept: "application/pdf,*/*",
      },
      cache: "force-cache",
    });

    if (!upstreamRes.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${upstreamRes.statusText}` },
        { status: upstreamRes.status }
      );
    }

    const contentType = upstreamRes.headers.get("content-type") || "application/pdf";
    const contentLength = upstreamRes.headers.get("content-length");
    const filename = targetUrl.split("/").pop() || "document.pdf";

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Disposition", `inline; filename="${filename}"`);
    headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400");
    headers.set("X-Content-Type-Options", "nosniff");
    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    return new NextResponse(upstreamRes.body, {
      status: 200,
      headers,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch PDF";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
