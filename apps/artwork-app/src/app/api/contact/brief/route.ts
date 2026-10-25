import { NextRequest, NextResponse } from "next/server";
import {
  createBrowserClient,
  createSupabaseInquiryRepository,
  submitLeadBrief,
  EmailAndWebhookNotifier,
} from "@art-work/database";

/**
 * POST /api/contact/brief
 * Public Client Lead Intake Pipeline (Phase 08).
 * Handles Zod validation, honeypot & time-gate spam defense (< 1.5s),
 * IP anonymization, database persistence, and background email dispatch.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON request body" },
      { status: 400 }
    );
  }

  // Extract client IP address for privacy-preserving SHA-256 hashing
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwardedFor || realIp || undefined;

  try {
    const supabase = createBrowserClient();
    const repo = createSupabaseInquiryRepository(supabase);
    const notifier = new EmailAndWebhookNotifier();

    const result = await submitLeadBrief(body, repo, {
      ip,
      notifier,
      waitForNotifications: false, // Fire-and-forget for instantaneous response
    });

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        {
          status: result.status,
          headers: result.retryAfterSeconds
            ? { "Retry-After": String(result.retryAfterSeconds) }
            : undefined,
        }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Brief received successfully. Our creative team will review your requirements.",
        id: result.data?.id,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected server error while submitting brief";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
