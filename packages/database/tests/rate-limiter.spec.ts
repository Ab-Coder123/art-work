import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { LoginRateLimiter } from "../src/index";

describe("Phase 03: Authentication Abuse Defense & Rate Limiter", () => {
  it("should allow initial attempts with full remaining attempts quota", () => {
    const limiter = new LoginRateLimiter({ maxAttempts: 5, windowMs: 10000 });
    const status = limiter.checkLimit("127.0.0.1:test@artwork.stage");

    assert.equal(status.allowed, true);
    assert.equal(status.remainingAttempts, 5);
  });

  it("should decrement remaining attempts on consecutive failures", () => {
    const limiter = new LoginRateLimiter({ maxAttempts: 3, windowMs: 10000 });
    const key = "client-ip-1:admin@artwork.stage";

    const f1 = limiter.recordFailure(key);
    assert.equal(f1.allowed, true);
    assert.equal(f1.remainingAttempts, 2);

    const f2 = limiter.recordFailure(key);
    assert.equal(f2.allowed, true);
    assert.equal(f2.remainingAttempts, 1);
  });

  it("should lock out client after max failed attempts are reached", () => {
    const limiter = new LoginRateLimiter({ maxAttempts: 3, windowMs: 60000 });
    const key = "attacker:target@artwork.stage";

    limiter.recordFailure(key);
    limiter.recordFailure(key);
    const lockedStatus = limiter.recordFailure(key);

    assert.equal(lockedStatus.allowed, false);
    assert.equal(lockedStatus.remainingAttempts, 0);
    assert.ok(lockedStatus.retryAfterSeconds! > 0);

    // Subsequent check also reports locked
    const check = limiter.checkLimit(key);
    assert.equal(check.allowed, false);
    assert.equal(check.remainingAttempts, 0);
  });

  it("should unlock automatically after the window expires", () => {
    const limiter = new LoginRateLimiter({ maxAttempts: 2, windowMs: 1000 });
    const key = "user:test@artwork.stage";
    const startTime = 1000000;

    limiter.recordFailure(key, startTime);
    limiter.recordFailure(key, startTime + 100);

    // Locked during window
    const locked = limiter.checkLimit(key, startTime + 500);
    assert.equal(locked.allowed, false);

    // Unlocked after 1000ms window passes
    const unlocked = limiter.checkLimit(key, startTime + 1100);
    assert.equal(unlocked.allowed, true);
    assert.equal(unlocked.remainingAttempts, 2);
  });

  it("should clear failure records on successful login", () => {
    const limiter = new LoginRateLimiter({ maxAttempts: 5, windowMs: 10000 });
    const key = "user:valid@artwork.stage";

    limiter.recordFailure(key);
    limiter.recordFailure(key);
    assert.equal(limiter.checkLimit(key).remainingAttempts, 3);

    limiter.recordSuccess(key);
    assert.equal(limiter.checkLimit(key).remainingAttempts, 5);
  });
});
