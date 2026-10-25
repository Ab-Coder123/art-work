import { describe, it } from "node:test";
import assert from "node:assert/strict";

// Authentication & Security
import {
  canWriteAdminData,
  generateCsrfToken,
  validateCsrfToken,
  CSRF_HEADER_NAME,
  AUTH_COOKIES,
  LoginRateLimiter,
} from "../src/auth/index";
import {
  isAllowedOrigin,
  buildCorsHeaders,
  handleCorsPreflight,
} from "../src/auth/cors";
import {
  buildContentSecurityPolicy,
  getSecurityHeadersMap,
} from "../src/auth/security-headers";

// YouTube Engine
import {
  parseYouTubeInput,
  buildYouTubeEmbedUrl,
  getYouTubePosterCandidates,
} from "../src/media/youtube";

// Content Management
import { DEFAULT_SITE_CONTENT } from "../src/content/default-content";
import {
  InMemoryContentRepository,
  fetchSiteContent,
  updateContentSection,
  fetchContentHistory,
  rollbackContent,
} from "../src/content/service";

// Lead Intake Pipeline
import {
  InMemoryInquiryRepository,
} from "../src/inquiries/repository";
import {
  submitLeadBrief,
  fetchInquiries,
  updateInquiryStatus,
  removeInquiry,
} from "../src/inquiries/service";
import {
  MockNotificationService,
} from "../src/inquiries/notifications";

describe("Phase 10: End-to-End System Integration Suite", () => {
  describe("E2E Flow 1: Client Lead Intake & Notification Pipeline", () => {
    it("should accept valid submission, filter spam, store inquiry, and dispatch studio notifications", async () => {
      const repo = new InMemoryInquiryRepository();
      const notifier = new MockNotificationService();

      // 1. Client submits contact brief with valid time-gate and empty honeypot
      const submissionResult = await submitLeadBrief(
        {
          full_name: "Tarek Mansour",
          email: "tarek@globalstage.ae",
          service_type: "stage_design",
          brief: "We require a kinetic LED stage design for the 2026 Middle East Marketing Summit.",
          _hp: "", // honeypot empty
          _ts: Date.now() - 3500, // 3.5 seconds fill time (> 1.5s threshold)
        },
        repo,
        {
          notifier,
          ip: "197.35.120.45",
        }
      );

      assert.equal(submissionResult.ok, true);
      assert.ok(submissionResult.data?.id);
      const inquiryId = submissionResult.data!.id;
      assert.ok(inquiryId.length > 0);

      // 2. Verify notifications dispatched to both studio and client
      assert.equal(notifier.studioAlerts.length, 1);
      assert.equal(notifier.studioAlerts[0]?.email, "tarek@globalstage.ae");
      assert.match(notifier.studioAlerts[0]?.brief || "", /kinetic LED stage/);

      assert.equal(notifier.clientConfirmations.length, 1);
      assert.equal(notifier.clientConfirmations[0]?.email, "tarek@globalstage.ae");

      // 3. Admin retrieves inquiry list
      const inquiriesList = await fetchInquiries(repo);
      assert.equal(inquiriesList.ok, true);
      assert.equal(inquiriesList.data?.items.length, 1);
      assert.equal(inquiriesList.data?.items[0]?.fullName, "Tarek Mansour");
      assert.equal(inquiriesList.data?.items[0]?.status, "pending");

      // 4. Admin updates status to 'reviewed' then 'contacted'
      const updatedToReview = await updateInquiryStatus(
        inquiryId,
        "reviewed",
        repo
      );
      assert.equal(updatedToReview.ok, true);
      assert.equal(updatedToReview.data?.status, "reviewed");

      const updatedToContacted = await updateInquiryStatus(
        inquiryId,
        "contacted",
        repo
      );
      assert.equal(updatedToContacted.ok, true);
      assert.equal(updatedToContacted.data?.status, "contacted");

      // 5. Admin archives/deletes inquiry
      const deleteResult = await removeInquiry(inquiryId, repo);
      assert.equal(deleteResult.ok, true);

      const afterDelete = await fetchInquiries(repo);
      assert.equal(afterDelete.ok, true);
      assert.equal(afterDelete.data?.items.length, 0);
    });

    it("should reject bot submissions with filled honeypot or suspicious fill time", async () => {
      const repo = new InMemoryInquiryRepository();
      const notifier = new MockNotificationService();

      // Bot with honeypot triggered
      const botSubmission = await submitLeadBrief(
        {
          full_name: "Spam Bot",
          email: "spammer@botnet.ru",
          service_type: "branding",
          brief: "Buy cheap backlinks now for high search rankings",
          _hp: "http://spam-link.ru", // Honeypot filled
          _ts: Date.now() - 5000,
        },
        repo,
        { notifier }
      );

      assert.equal(botSubmission.ok, false);
      assert.equal(botSubmission.status, 422);
      assert.equal(notifier.studioAlerts.length, 0);

      // Time-gate triggered (submitted in 200ms)
      const rapidSubmission = await submitLeadBrief(
        {
          full_name: "Speedy Bot",
          email: "fast@bot.com",
          service_type: "branding",
          brief: "Super fast form submission from automated script",
          _hp: "",
          _ts: Date.now() - 200, // < 1500ms
        },
        repo,
        { notifier }
      );

      assert.equal(rapidSubmission.ok, false);
      assert.equal(rapidSubmission.status, 422);
    });
  });

  describe("E2E Flow 2: YouTube Media Engine & Embed Resolution", () => {
    it("should resolve YouTube URLs, produce secure embed codes, and generate thumbnail cascades", () => {
      const rawUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

      // 1. Parse and extract 11-char ID
      const parseResult = parseYouTubeInput(rawUrl);
      assert.equal(parseResult.ok, true);
      if (!parseResult.ok) return;

      assert.equal(parseResult.videoId, "dQw4w9WgXcQ");
      assert.equal(parseResult.canonicalUrl, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");

      // 2. Generate privacy-enhanced embed URL
      const embedUrl = buildYouTubeEmbedUrl(parseResult.videoId);
      assert.match(embedUrl, /^https:\/\/www\.youtube-nocookie\.com\/embed\/dQw4w9WgXcQ/);

      // 3. Poster thumbnail candidates
      const posters = getYouTubePosterCandidates(parseResult.videoId);
      assert.ok(posters.length >= 2);
      assert.equal(posters[0], "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg");
      assert.equal(posters[2], "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg");
    });
  });

  describe("E2E Flow 3: Dynamic Site Content & Revision History", () => {
    it("should manage content editing, audit trail, and rollback snapshots", async () => {
      const repo = new InMemoryContentRepository();

      // 1. Initial content fetch returns default copy
      const initial = await fetchSiteContent(repo);
      assert.equal(initial.ok, true);
      assert.equal(initial.data?.manifesto.headlinePart1, DEFAULT_SITE_CONTENT.manifesto.headlinePart1);

      // 2. Admin updates Manifesto section
      const updatedManifesto = {
        ...initial.data!.manifesto,
        headlinePart1: "TRANSFORMING SPACES.",
        headlinePart2: "LEGENDARY REALMS.",
      };

      const updateResult = await updateContentSection(
        "manifesto",
        updatedManifesto,
        repo,
        "admin@artwork-agency.com"
      );

      assert.equal(updateResult.ok, true);
      assert.equal(updateResult.data?.section, "manifesto");

      // 3. Content fetch reflects the updated values
      const afterUpdate = await fetchSiteContent(repo);
      assert.equal(afterUpdate.ok, true);
      assert.equal(afterUpdate.data?.manifesto.headlinePart1, "TRANSFORMING SPACES.");

      // 4. Audit history contains the change record
      const historyResult = await fetchContentHistory(repo);
      assert.equal(historyResult.ok, true);
      assert.ok((historyResult.data?.length || 0) >= 1);
      assert.equal(historyResult.data![0]?.actorEmail, "admin@artwork-agency.com");

      // 5. Admin rolls back to the previous snapshot
      const rollbackResult = await rollbackContent(
        historyResult.data![0]!.id,
        repo,
        "rollback-superadmin@artwork-agency.com"
      );

      assert.equal(rollbackResult.ok, true);
      assert.equal(rollbackResult.data?.section, "manifesto");

      // 6. Verify content is restored to previous value
      const afterRollback = await fetchSiteContent(repo);
      assert.equal(afterRollback.ok, true);
      assert.equal(afterRollback.data?.manifesto.headlinePart1, DEFAULT_SITE_CONTENT.manifesto.headlinePart1);
    });
  });

  describe("E2E Flow 4: Security, Authentication, CORS & Headers Enforcement", () => {
    it("should enforce rate limiting on brute force and permit active administrators", async () => {
      const rateLimiter = new LoginRateLimiter({ maxAttempts: 3, windowMs: 10000 }); // 3 attempts max
      const throttleKey = "127.0.0.1:admin@artwork-agency.com";

      // Simulate 3 failed login attempts
      rateLimiter.recordFailure(throttleKey);
      rateLimiter.recordFailure(throttleKey);
      rateLimiter.recordFailure(throttleKey);

      // 4th attempt is locked
      const limitStatus = rateLimiter.checkLimit(throttleKey);
      assert.equal(limitStatus.allowed, false);
      assert.ok((limitStatus.retryAfterSeconds || 0) > 0);

      // Success resets the throttle
      rateLimiter.recordSuccess(throttleKey);
      assert.equal(rateLimiter.checkLimit(throttleKey).allowed, true);
    });

    it("should validate CSRF tokens, permissions, and security headers", () => {
      // 1. CSRF Token Lifecycle
      const token = generateCsrfToken();
      assert.equal(token.length, 64);
      assert.equal(validateCsrfToken(token, token), true);
      assert.equal(validateCsrfToken(token, "tampered-token"), false);

      // 2. Role Permissions
      assert.equal(canWriteAdminData("super_admin"), true);
      assert.equal(canWriteAdminData("editor"), true);
      assert.equal(canWriteAdminData("viewer"), false);

      // 3. CORS Defense
      assert.equal(isAllowedOrigin("https://artwork-agency.vercel.app"), true);
      assert.equal(isAllowedOrigin("https://evil-hacker.com"), false);

      const preflight = handleCorsPreflight("https://artwork-agency.vercel.app", "OPTIONS");
      assert.equal(preflight?.status, 204);
      assert.equal(
        preflight?.headers.get("Access-Control-Allow-Origin"),
        "https://artwork-agency.vercel.app"
      );

      // 4. Security Headers (CSP, HSTS, Clickjacking defense)
      const csp = buildContentSecurityPolicy({ appType: "admin", isProduction: true });
      assert.match(csp, /frame-ancestors 'none'/);
      assert.match(csp, /https:\/\/www\.youtube-nocookie\.com/);
      assert.match(csp, /https:\/\/\*\.supabase\.co/);
      assert.match(csp, /upgrade-insecure-requests/);

      const headers = getSecurityHeadersMap({ appType: "admin", isProduction: true });
      assert.equal(headers["X-Frame-Options"], "DENY");
      assert.equal(headers["X-Content-Type-Options"], "nosniff");
      assert.equal(headers["Strict-Transport-Security"], "max-age=63072000; includeSubDomains; preload");
    });
  });
});
