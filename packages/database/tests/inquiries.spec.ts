import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeLeadPayload,
  checkSpam,
  hashIp,
  renderStudioLeadAlertHtml,
  renderClientConfirmationHtml,
  retryWithBackoff,
  MockNotificationService,
  InMemoryInquiryRepository,
  submitLeadBrief,
  fetchInquiries,
  fetchInquiryById,
  updateInquiryStatus,
  removeInquiry,
  MIN_FILL_TIME_MS,
  InquiryRateLimiter,
  SupabaseInquiryRepository,
} from "../src/index";

describe("Phase 08: Client Lead Intake & Notification Pipeline", () => {
  it("persists public inquiries with INSERT only and returns its locally generated record", async () => {
    let inserted: Record<string, unknown> | undefined;
    const query = {
      insert(payload: Record<string, unknown>) {
        inserted = payload;
        return Promise.resolve({ error: null });
      },
    };
    const client = { from: (table: string) => {
      assert.equal(table, "inquiries");
      return query;
    } };
    const repository = new SupabaseInquiryRepository(client as never);

    const record = await repository.create({
      fullName: "Insert Only",
      email: "insert-only@example.test",
      serviceType: "Stage Design",
      brief: "A sufficiently detailed test inquiry for insert only behavior.",
    });

    assert.match(record.id, /^[0-9a-f-]{36}$/i);
    assert.equal(inserted?.id, record.id);
    assert.equal(inserted?.status, "pending");
    assert.equal(record.email, "insert-only@example.test");
    assert.equal("select" in query, false);
  });

  describe("Contact Brief Validation & Normalization", () => {
    it("should accept a complete and valid payload with camelCase keys", () => {
      const input = {
        fullName: "Alex Mercer",
        email: "alex@brandstudio.co",
        serviceType: "Stage Design & Arena Rigging",
        brief: "We need an immersive concert stage design for a 12-city arena tour starting in October.",
      };

      const result = normalizeLeadPayload(input);
      assert.equal(result.success, true);
      assert.equal(result.data?.fullName, "Alex Mercer");
      assert.equal(result.data?.email, "alex@brandstudio.co");
      assert.equal(result.data?.serviceType, "Stage Design & Arena Rigging");
      assert.ok(result.data?.brief.startsWith("We need an immersive"));
    });

    it("should accept a valid payload with snake_case keys from HTML forms", () => {
      const input = {
        full_name: "Sarah Jenkins",
        email: "sarah.j@techsummit.io",
        service_type: "Conferences & Keynote LED",
        brief: "Complete keynote LED scenography with curved displays and real-time graphics rendering.",
      };

      const result = normalizeLeadPayload(input);
      assert.equal(result.success, true);
      assert.equal(result.data?.fullName, "Sarah Jenkins");
      assert.equal(result.data?.email, "sarah.j@techsummit.io");
      assert.equal(result.data?.serviceType, "Conferences & Keynote LED");
    });

    it("should reject invalid email addresses", () => {
      const input = {
        fullName: "Marcus Aurelius",
        email: "not-a-valid-email-format",
        serviceType: "Brand Identity",
        brief: "Developing a radical brand identity refresh for global launch.",
      };

      const result = normalizeLeadPayload(input);
      assert.equal(result.success, false);
      assert.match(result.error || "", /valid email address/i);
    });

    it("should reject full name shorter than 2 characters", () => {
      const input = {
        fullName: "A",
        email: "valid@email.com",
        serviceType: "Stage Design",
        brief: "Developing an immersive stage with trusses.",
      };

      const result = normalizeLeadPayload(input);
      assert.equal(result.success, false);
      assert.match(result.error || "", /at least 2 characters/i);
    });

    it("should reject brief shorter than 10 characters", () => {
      const input = {
        fullName: "Elena Rostova",
        email: "elena@agency.com",
        serviceType: "Stage Design",
        brief: "Too short",
      };

      const result = normalizeLeadPayload(input);
      assert.equal(result.success, false);
      assert.match(result.error || "", /at least 10 characters/i);
    });

    it("should extract honeypot and time-gate metadata accurately", () => {
      const input = {
        fullName: "Bot Trapper",
        email: "human@real.com",
        serviceType: "Booth Fabrication",
        brief: "Detailed brief requirements exceeding ten characters.",
        _hp: "bot_filled_value",
        _ts: 1774000000000,
      };

      const result = normalizeLeadPayload(input);
      assert.equal(result.success, true);
      assert.equal(result.data?.honeypot, "bot_filled_value");
      assert.equal(result.data?.formLoadedAt, 1774000000000);
    });
  });

  describe("Spam Defense, Honeypot & Time-Gate Engine", () => {
    it("should throttle submissions by anonymous key and reset after the window", () => {
      const limiter = new InquiryRateLimiter(2, 60_000);
      assert.equal(limiter.consume("hashed-ip", 1_000).allowed, true);
      assert.equal(limiter.consume("hashed-ip", 2_000).allowed, true);
      const limited = limiter.consume("hashed-ip", 3_000);
      assert.equal(limited.allowed, false);
      assert.equal(limited.retryAfterSeconds, 58);
      assert.equal(limiter.consume("hashed-ip", 61_000).allowed, true);
    });

    it("should reject bot submissions when honeypot field is filled", () => {
      const check = checkSpam({
        honeypot: "automated_spam_url_http://spam.org",
      });

      assert.equal(check.isSpam, true);
      assert.match(check.reason || "", /honeypot trap/i);
    });

    it("should reject bot submissions completed in under 1.5 seconds (< 1500ms)", () => {
      const now = 1774000001000;
      const formLoadedAt = now - 600; // Filled in 600ms (too fast for humans)

      const check = checkSpam({
        formLoadedAt,
        now,
        minFillTimeMs: MIN_FILL_TIME_MS,
      });

      assert.equal(check.isSpam, true);
      assert.match(check.reason || "", /faster than human threshold/i);
    });

    it("should reject submissions with impossible future timestamps (> 5s in future)", () => {
      const now = 1774000000000;
      const futureFormLoadedAt = now + 15000; // 15 seconds in future

      const check = checkSpam({
        formLoadedAt: futureFormLoadedAt,
        now,
      });

      assert.equal(check.isSpam, true);
      assert.match(check.reason || "", /future timestamp/i);
    });

    it("should approve legitimate submissions taking >= 1.5 seconds with empty honeypot", () => {
      const now = 1774000005000;
      const formLoadedAt = now - 4200; // Human took 4.2 seconds

      const check = checkSpam({
        honeypot: "",
        formLoadedAt,
        now,
      });

      assert.equal(check.isSpam, false);
      assert.equal(check.reason, undefined);
    });

    it("should hash client IP addresses to SHA-256 for PII-free storage", () => {
      const hash1 = hashIp("192.168.1.100");
      const hash2 = hashIp("192.168.1.100");
      const hashDiff = hashIp("10.0.0.1");

      assert.equal(typeof hash1, "string");
      assert.equal(hash1?.length, 64);
      assert.equal(hash1, hash2, "Same IP should produce identical deterministic hash");
      assert.notEqual(hash1, hashDiff, "Different IPs must produce different hashes");

      // Verify proxy multi-hop handling
      const proxyHash = hashIp("203.0.113.195, 70.41.3.18, 150.172.238.178");
      const singleHash = hashIp("203.0.113.195");
      assert.equal(proxyHash, singleHash);

      // Null handling
      assert.equal(hashIp(null), undefined);
      assert.equal(hashIp(undefined), undefined);
    });
  });

  describe("HTML Email Notifications & Resilient Background Queue", () => {
    it("should render studio lead alert HTML with brand aesthetics and escaped variables", () => {
      const html = renderStudioLeadAlertHtml({
        id: "inq-uuid-12345",
        fullName: "Test Client <script>alert(1)</script>",
        email: "client@test.com",
        serviceType: "LED Scenography",
        brief: "Line 1\nLine 2 & special characters > <",
        createdAt: "2026-10-22T08:00:00.000Z",
      });

      assert.ok(html.includes("NEW CLIENT LEAD RECEIVED"));
      assert.ok(html.includes("STAGE 05 // INTAKE PIPELINE"));
      assert.ok(html.includes("client@test.com"));
      assert.ok(html.includes("LED Scenography"));
      assert.ok(html.includes("&lt;script&gt;alert(1)&lt;/script&gt;"), "Must escape HTML injection");
      assert.ok(html.includes("Line 1<br/>Line 2 &amp; special characters &gt; &lt;"));
      assert.ok(html.includes("mailto:client@test.com"));
    });

    it("should render client confirmation auto-reply HTML with Art Work brand signature", () => {
      const html = renderClientConfirmationHtml("Marcus Aurelius", "Arena Rigging");

      assert.ok(html.includes("WE HAVE RECEIVED YOUR BRIEF"));
      assert.ok(html.includes("Marcus Aurelius"));
      assert.ok(html.includes("Arena Rigging"));
      assert.ok(html.includes("24-HOUR RAPID RESPONSE STANDARD"));
      assert.ok(html.includes("ahmed.artwork2026@gmail.com"));
    });

    it("should retry operations up to 3 times with exponential backoff on transient errors", async () => {
      let attempts = 0;
      const result = await retryWithBackoff(async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error("Temporary network timeout");
        }
        return "success-delivered";
      }, 3, 10);

      assert.equal(attempts, 3);
      assert.equal(result, "success-delivered");
    });

    it("should fail cleanly when maximum retries are exceeded", async () => {
      let attempts = 0;
      await assert.rejects(
        async () => {
          await retryWithBackoff(async () => {
            attempts++;
            throw new Error("Permanent SMTP authentication failure");
          }, 3, 10);
        },
        /Permanent SMTP authentication failure/
      );
      assert.equal(attempts, 3);
    });
  });

  describe("End-to-End Inquiry Pipeline Service", () => {
    it("should reject over-limit valid submissions before persistence", async () => {
      const repo = new InMemoryInquiryRepository();
      const limiter = new InquiryRateLimiter(1, 60_000);
      const makePayload = () => ({
        fullName: "Rate Limit Test",
        email: "rate-limit@example.test",
        serviceType: "Stage Design",
        brief: "A test brief that is long enough to pass validation.",
        _ts: Date.now() - 5000,
      });

      const first = await submitLeadBrief(makePayload(), repo, {
        ip: "198.51.100.88",
        rateLimiter: limiter,
        notifier: new MockNotificationService(),
        waitForNotifications: true,
      });
      const second = await submitLeadBrief(makePayload(), repo, {
        ip: "198.51.100.88",
        rateLimiter: limiter,
        notifier: new MockNotificationService(),
        waitForNotifications: true,
      });

      assert.equal(first.status, 201);
      assert.equal(second.status, 429);
      assert.ok((second.retryAfterSeconds || 0) > 0);
      const listed = await fetchInquiries(repo);
      assert.equal(listed.data?.total, 1);
    });

    it("should submit a valid lead brief, persist as pending, and trigger notifications", async () => {
      const repo = new InMemoryInquiryRepository();
      const notifier = new MockNotificationService();

      const payload = {
        fullName: "Jordan Lee",
        email: "jordan@metaverse-expo.org",
        serviceType: "Stage & Architectural Scenography",
        brief: "We need a massive curved LED stage layout with custom trusses for 10,000 attendees.",
        _hp: "",
        _ts: Date.now() - 5000, // 5 seconds ago (valid)
      };

      const result = await submitLeadBrief(payload, repo, {
        ip: "198.51.100.42",
        notifier,
        waitForNotifications: true,
      });

      assert.equal(result.ok, true);
      assert.equal(result.status, 201);
      assert.ok(result.data?.id);
      assert.equal(result.data?.fullName, "Jordan Lee");
      assert.equal(result.data?.email, "jordan@metaverse-expo.org");
      assert.equal(result.data?.status, "pending");
      assert.ok(result.data?.ipHash);

      // Verify notification delivery
      assert.equal(notifier.studioAlerts.length, 1);
      assert.equal(notifier.clientConfirmations.length, 1);
      assert.equal(notifier.webhooks.length, 1);
      assert.equal(notifier.studioAlerts[0]?.email, "jordan@metaverse-expo.org");
    });

    it("should reject spam submissions with 422 Unprocessable Entity and skip persistence", async () => {
      const repo = new InMemoryInquiryRepository();
      const notifier = new MockNotificationService();

      const spamPayload = {
        fullName: "Bot Spammer",
        email: "bot@spam-botnet.ru",
        serviceType: "SEO Optimization",
        brief: "Buy cheap backlinks now at our automated service portal.",
        _hp: "filled_by_bad_bot",
      };

      const result = await submitLeadBrief(spamPayload, repo, {
        notifier,
        waitForNotifications: true,
      });

      assert.equal(result.ok, false);
      assert.equal(result.status, 422);
      assert.match(result.error || "", /automated security filter|honeypot/i);

      // Ensure zero items written to repository or notified
      const list = await repo.list();
      assert.equal(list.total, 0);
      assert.equal(notifier.studioAlerts.length, 0);
    });

    it("should list, filter, search, update status, and delete inquiries", async () => {
      const repo = new InMemoryInquiryRepository();

      // Seed 3 inquiries
      const inq1 = await repo.create({
        fullName: "Alice Vance",
        email: "alice@blackmesa.gov",
        serviceType: "Stage Design",
        brief: "Anomalous materials presentation stage requirements.",
        status: "pending",
      });

      const inq2 = await repo.create({
        fullName: "Gordon Freeman",
        email: "gfreeman@blackmesa.gov",
        serviceType: "LED Scenography",
        brief: "Laser alignment and stage lighting integration.",
        status: "reviewed",
      });

      const inq3 = await repo.create({
        fullName: "Barney Calhoun",
        email: "barney@security.org",
        serviceType: "Custom Rigging",
        brief: "Rigging trusses and safety harnesses for event crew.",
        status: "contacted",
      });

      // 1. List all
      const all = await fetchInquiries(repo);
      assert.equal(all.ok, true);
      assert.equal(all.data?.total, 3);

      // 2. Filter by status 'reviewed'
      const reviewed = await fetchInquiries(repo, { status: "reviewed" });
      assert.equal(reviewed.ok, true);
      assert.equal(reviewed.data?.items.length, 1);
      assert.equal(reviewed.data?.items[0]?.fullName, "Gordon Freeman");

      // 3. Search query "laser"
      const searched = await fetchInquiries(repo, { search: "laser" });
      assert.equal(searched.ok, true);
      assert.equal(searched.data?.items.length, 1);
      assert.equal(searched.data?.items[0]?.id, inq2.id);

      // 4. Get by ID
      const byId = await fetchInquiryById(inq1.id, repo);
      assert.equal(byId.ok, true);
      assert.equal(byId.data?.fullName, "Alice Vance");

      // 5. Update status
      const updated = await updateInquiryStatus(inq1.id, "contacted", repo);
      assert.equal(updated.ok, true);
      assert.equal(updated.data?.status, "contacted");

      // 6. Delete
      const deleted = await removeInquiry(inq3.id, repo);
      assert.equal(deleted.ok, true);

      const afterDelete = await fetchInquiries(repo);
      assert.equal(afterDelete.data?.total, 2);
    });
  });
});
