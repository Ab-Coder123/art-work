export interface InquiryRateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

interface RateLimitWindow {
  startedAt: number;
  count: number;
}

/** Process-local limiter keyed by the already-anonymized client IP hash. */
export class InquiryRateLimiter {
  private readonly windows = new Map<string, RateLimitWindow>();

  constructor(
    private readonly maxSubmissions = 5,
    private readonly windowMs = 15 * 60 * 1000
  ) {}

  consume(key: string, now = Date.now()): InquiryRateLimitResult {
    const current = this.windows.get(key);
    if (!current || now - current.startedAt >= this.windowMs) {
      this.windows.set(key, { startedAt: now, count: 1 });
      return { allowed: true, retryAfterSeconds: 0 };
    }

    if (current.count >= this.maxSubmissions) {
      return {
        allowed: false,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((current.startedAt + this.windowMs - now) / 1000)
        ),
      };
    }

    current.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
  }
}

export const globalInquiryRateLimiter = new InquiryRateLimiter();
