import { createHash } from "node:crypto";

/**
 * Minimum elapsed time (in milliseconds) a human requires to read the labels
 * and type a name, email, and 10+ character brief. Submissions faster than this
 * threshold are classified as automated bot scripts.
 */
export const MIN_FILL_TIME_MS = 1500;

export interface SpamCheckOptions {
  honeypot?: string;
  formLoadedAt?: number;
  now?: number;
  minFillTimeMs?: number;
}

export interface SpamCheckResult {
  isSpam: boolean;
  reason?: string;
}

/**
 * Evaluates whether a lead brief submission is spam/bot activity based on
 * invisible honeypot injection and client-side time-gating.
 */
export function checkSpam(options: SpamCheckOptions): SpamCheckResult {
  const {
    honeypot,
    formLoadedAt,
    now = Date.now(),
    minFillTimeMs = MIN_FILL_TIME_MS,
  } = options;

  // 1. Honeypot verification: legitimate human users cannot see or fill hidden field
  if (honeypot && honeypot.trim().length > 0) {
    return {
      isSpam: true,
      reason: "Honeypot trap triggered (automated form filler detected)",
    };
  }

  // 2. Time-gate verification: verify form was open for at least minFillTimeMs
  if (typeof formLoadedAt === "number" && Number.isFinite(formLoadedAt)) {
    // Check for impossible future timestamps (allow up to 5s client clock skew)
    if (formLoadedAt > now + 5000) {
      return {
        isSpam: true,
        reason: "Time-gate failed (invalid future timestamp)",
      };
    }

    const elapsed = now - formLoadedAt;
    if (elapsed < minFillTimeMs) {
      return {
        isSpam: true,
        reason: `Submission completed in ${elapsed}ms, faster than human threshold (${minFillTimeMs}ms)`,
      };
    }
  }

  return { isSpam: false };
}

/**
 * Anonymizes client IP addresses using SHA-256 hashing with a secret salt.
 * Ensures zero-PII storage in PostgreSQL while enabling rate-limit/abuse tracking.
 */
export function hashIp(ip?: string | null, salt = "art-work-lead-intake-salt"): string | undefined {
  if (!ip || typeof ip !== "string") {
    return undefined;
  }
  const cleanIp = ip.split(",")[0]?.trim();
  if (!cleanIp) {
    return undefined;
  }

  try {
    return createHash("sha256")
      .update(`${salt}:${cleanIp}`)
      .digest("hex");
  } catch {
    return undefined;
  }
}
