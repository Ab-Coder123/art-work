export interface RateLimitEntry {
  failures: number;
  firstFailureTimestamp: number;
  blockedUntil?: number;
}

export interface RateLimitStatus {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
}

export class LoginRateLimiter {
  private readonly maxAttempts: number;
  private readonly windowMs: number;
  private readonly records: Map<string, RateLimitEntry> = new Map();

  constructor(options?: { maxAttempts?: number; windowMs?: number }) {
    this.maxAttempts = options?.maxAttempts ?? 5; // Default: 5 attempts
    this.windowMs = options?.windowMs ?? 15 * 60 * 1000; // Default: 15 minutes
  }

  /**
   * Checks whether the client key is currently allowed to attempt authentication.
   */
  public checkLimit(key: string, now: number = Date.now()): RateLimitStatus {
    const entry = this.records.get(key);

    if (!entry) {
      return { allowed: true, remainingAttempts: this.maxAttempts };
    }

    // Check if the current lockout window has expired
    if (now - entry.firstFailureTimestamp > this.windowMs) {
      this.records.delete(key);
      return { allowed: true, remainingAttempts: this.maxAttempts };
    }

    if (entry.failures >= this.maxAttempts) {
      const remainingMs = Math.max(0, this.windowMs - (now - entry.firstFailureTimestamp));
      const retryAfterSeconds = Math.ceil(remainingMs / 1000);
      return {
        allowed: false,
        remainingAttempts: 0,
        retryAfterSeconds,
      };
    }

    return {
      allowed: true,
      remainingAttempts: this.maxAttempts - entry.failures,
    };
  }

  /**
   * Records a failed authentication attempt.
   */
  public recordFailure(key: string, now: number = Date.now()): RateLimitStatus {
    const entry = this.records.get(key);

    if (!entry || now - entry.firstFailureTimestamp > this.windowMs) {
      const newEntry: RateLimitEntry = {
        failures: 1,
        firstFailureTimestamp: now,
      };
      this.records.set(key, newEntry);
      return {
        allowed: true,
        remainingAttempts: this.maxAttempts - 1,
      };
    }

    entry.failures += 1;
    if (entry.failures >= this.maxAttempts) {
      entry.blockedUntil = now + (this.windowMs - (now - entry.firstFailureTimestamp));
      const retryAfterSeconds = Math.ceil((entry.blockedUntil - now) / 1000);
      return {
        allowed: false,
        remainingAttempts: 0,
        retryAfterSeconds,
      };
    }

    return {
      allowed: true,
      remainingAttempts: this.maxAttempts - entry.failures,
    };
  }

  /**
   * Clears failure records upon successful login.
   */
  public recordSuccess(key: string): void {
    this.records.delete(key);
  }

  /**
   * Resets all rate limit tracking.
   */
  public reset(): void {
    this.records.clear();
  }
}

// Global singleton instance for runtime authentication throttling
export const globalLoginRateLimiter = new LoginRateLimiter();
