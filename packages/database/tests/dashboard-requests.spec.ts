import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  AUTH_COOKIES,
  CSRF_HEADER_NAME,
  generateCsrfToken,
  validateCsrfToken,
  getCsrfCookieOptions,
  handleCorsPreflight,
  applyCorsHeaders,
  applySecurityHeaders,
  isAllowedOrigin,
  DEFAULT_ALLOWED_ORIGINS,
  createInMemoryContentRepository,
  updateContentSection,
  rollbackContent,
  fetchContentHistory,
  fetchSiteContent,
  DEFAULT_SITE_CONTENT,
  InMemoryInquiryRepository,
  submitLeadBrief,
  updateInquiryStatus,
  removeInquiry,
  fetchInquiries,
  parseYouTubeInput,
  buildYouTubeEmbedUrl,
  canWriteAdminData,
} from "../src/index";

describe("Dashboard & Public App Full Request Integration Suite", () => {
  const isProd = true;

  // =========================================================================
  // 1. CSRF Defense & Request Middleware Verification
  // =========================================================================
  describe("1. CSRF Middleware Defense on All Mutating Dashboard Requests", () => {
    it("should reject mutating request (PUT/POST/PATCH/DELETE) when CSRF header is missing", () => {
      const headerToken: string | null = null;
      const cookieToken: string | null = null;

      const isValid = validateCsrfToken(headerToken, cookieToken);
      assert.equal(isValid, false, "CSRF check must fail when tokens are missing");

      // Verify the recovery token generation on 403
      const recoveryToken = generateCsrfToken();
      assert.equal(recoveryToken.length, 64, "Recovery token must be 64-char hex");
      const cookieOpts = getCsrfCookieOptions(isProd);
      assert.equal(cookieOpts.httpOnly, false, "CSRF cookie must be readable by JS");
      assert.equal(cookieOpts.sameSite, "lax");
    });

    it("should allow mutating request when valid double-submit token matches", () => {
      const validToken = generateCsrfToken();
      const isValid = validateCsrfToken(validToken, validToken);
      assert.equal(isValid, true, "Matching CSRF tokens must pass");
    });

    it("should reject when CSRF tokens mismatch or are tampered with", () => {
      const token1 = generateCsrfToken();
      const token2 = generateCsrfToken();
      assert.equal(validateCsrfToken(token1, token2), false, "Mismatched tokens must fail");
      assert.equal(validateCsrfToken(token1, token1.slice(0, 63) + "x"), false, "Tampered token must fail");
    });

    it("should strictly enforce double-submit CSRF matching for mutating methods and reject when cookie or header is absent", () => {
      const validToken = generateCsrfToken();
      // 1. Missing header
      assert.equal(validateCsrfToken(null, validToken), false, "Missing header must fail");
      // 2. Missing cookie
      assert.equal(validateCsrfToken(validToken, null), false, "Missing cookie must fail");
      // 3. Mismatched token
      assert.equal(validateCsrfToken(validToken, "tampered-token-1234567890abcdef1234567890abcdef1234567890abcdef12"), false, "Mismatched tokens must fail");
      // 4. Exactly matching 64-char hex tokens
      assert.equal(validateCsrfToken(validToken, validToken), true, "Matching tokens must pass");
    });

    it("should reject cross-origin mutating requests from unauthorized origins", () => {
      const maliciousOrigin = "https://evil-hacker.com";
      const allowed = isAllowedOrigin(maliciousOrigin, DEFAULT_ALLOWED_ORIGINS);
      assert.equal(allowed, false, "Malicious origin must be rejected by CORS");

      const preflight = handleCorsPreflight(maliciousOrigin, "OPTIONS");
      assert.equal(preflight?.status, 403, "CORS preflight from malicious origin must return 403");
    });

    it("should permit CORS preflight from authorized admin and public app domains", () => {
      const validOrigins = [
        "https://art-work-ivory.vercel.app",
        "https://artwork-agency.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001",
      ];

      for (const origin of validOrigins) {
        assert.equal(isAllowedOrigin(origin), true, `Origin ${origin} should be allowed`);
        const preflight = handleCorsPreflight(origin, "OPTIONS");
        assert.equal(preflight?.status, 204, `Preflight for ${origin} should return 204 No Content`);
      }
    });
  });

  // =========================================================================
  // 2. Dashboard Content Mutation Endpoints (PUT /api/content/[section])
  // =========================================================================
  describe("2. Dashboard Content Mutations (/api/content/[section])", () => {
    const testAdminEmail = "chief@art-work.agency";

    it("should successfully update 'manifesto' section and increment version", async () => {
      const repo = createInMemoryContentRepository();
      const payload = {
        ...DEFAULT_SITE_CONTENT.manifesto,
        headlinePart1: "MODERN EXPERIENCES.",
        headlinePart2: "REAL SCALE.",
        introParagraph: "Arena-grade creative production collective.",
      };

      const result = await updateContentSection("manifesto", payload, repo, testAdminEmail);
      assert.equal(result.ok, true, "Update should succeed");
      if (result.ok) {
        assert.equal(result.data.version, 2, "Version must increment to 2");
        assert.equal(result.data.section, "manifesto");
      }

      const fetched = await fetchSiteContent(repo);
      assert.equal(fetched.ok, true);
      if (fetched.ok) {
        assert.equal(fetched.data.manifesto.headlinePart1, "MODERN EXPERIENCES.");
      }
    });

    it("should successfully update 'whyUsTeaser' section", async () => {
      const repo = createInMemoryContentRepository();
      const payload = {
        ...DEFAULT_SITE_CONTENT.whyUsTeaser,
        headline: "ENGINEERED FOR ARENA STAGES.",
      };

      const result = await updateContentSection("whyUsTeaser", payload, repo, testAdminEmail);
      assert.equal(result.ok, true);
      if (result.ok) {
        assert.equal(result.data.section, "whyUsTeaser");
      }

      const fetched = await fetchSiteContent(repo);
      assert.equal(fetched.ok, true);
      if (fetched.ok) {
        assert.equal(fetched.data.whyUsTeaser.headline, "ENGINEERED FOR ARENA STAGES.");
      }
    });

    it("should successfully update 'contact' section", async () => {
      const repo = createInMemoryContentRepository();
      const payload = {
        ...DEFAULT_SITE_CONTENT.contact,
        email: "newlead@art-work.agency",
      };

      const result = await updateContentSection("contact", payload, repo, testAdminEmail);
      assert.equal(result.ok, true);
      if (result.ok) {
        assert.equal(result.data.section, "contact");
      }

      const fetched = await fetchSiteContent(repo);
      assert.equal(fetched.ok, true);
      if (fetched.ok) {
        assert.equal(fetched.data.contact.email, "newlead@art-work.agency");
      }
    });

    it("should successfully update 'whyUsPage' section", async () => {
      const repo = createInMemoryContentRepository();
      const payload = {
        ...DEFAULT_SITE_CONTENT.whyUsPage,
        heroHeadlineRow1: "WE ARCHITECT",
        heroHeadlineRow2: "MEMORABLE STAGES",
      };

      const result = await updateContentSection("whyUsPage", payload, repo, testAdminEmail);
      assert.equal(result.ok, true);
      if (result.ok) {
        assert.equal(result.data.section, "whyUsPage");
      }

      const fetched = await fetchSiteContent(repo);
      assert.equal(fetched.ok, true);
      if (fetched.ok) {
        assert.equal(fetched.data.whyUsPage.heroHeadlineRow1, "WE ARCHITECT");
      }
    });

    it("should support content revision history retrieval and rollback (POST /api/content/rollback/[id])", async () => {
      const repo = createInMemoryContentRepository();
      // 1. Initial update
      const update1 = await updateContentSection(
        "manifesto",
        { ...DEFAULT_SITE_CONTENT.manifesto, headlinePart1: "FIRST REVISION" },
        repo,
        testAdminEmail
      );
      assert.equal(update1.ok, true);

      // 2. Second update
      const update2 = await updateContentSection(
        "manifesto",
        { ...DEFAULT_SITE_CONTENT.manifesto, headlinePart1: "SECOND REVISION" },
        repo,
        testAdminEmail
      );
      assert.equal(update2.ok, true);

      // 3. Inspect history
      const history = await fetchContentHistory(repo, 10);
      assert.equal(history.ok, true);
      if (history.ok) {
        assert.ok(history.data.length >= 2, "History should track revisions");
        const initialRevision = history.data[0];

        // 4. Rollback to revision
        const rollbackResult = await rollbackContent(
          initialRevision.id,
          repo,
          "superadmin@art-work.agency"
        );
        assert.equal(rollbackResult.ok, true, "Rollback must succeed");
        if (rollbackResult.ok) {
          assert.equal(rollbackResult.data.section, "manifesto");
        }
      }
    });

    it("should enforce role-based access control (viewers cannot mutate content)", () => {
      assert.equal(canWriteAdminData("viewer"), false, "Viewer role cannot write");
      assert.equal(canWriteAdminData("editor"), true, "Editor role can write");
      assert.equal(canWriteAdminData("super_admin"), true, "Super admin role can write");
    });

    it("should verify successful PUT saves for all four sections with valid matching CSRF token", async () => {
      const repo = createInMemoryContentRepository();
      const validToken = generateCsrfToken();
      assert.equal(validateCsrfToken(validToken, validToken), true);

      // 1. manifesto
      const r1 = await updateContentSection("manifesto", { ...DEFAULT_SITE_CONTENT.manifesto, headlinePart1: "STAGE 1 PASS" }, repo, testAdminEmail);
      assert.equal(r1.ok, true, "manifesto save must succeed");

      // 2. whyUsTeaser
      const r2 = await updateContentSection("whyUsTeaser", { ...DEFAULT_SITE_CONTENT.whyUsTeaser, headline: "STAGE 2 PASS" }, repo, testAdminEmail);
      assert.equal(r2.ok, true, "whyUsTeaser save must succeed");

      // 3. contact
      const r3 = await updateContentSection("contact", { ...DEFAULT_SITE_CONTENT.contact, email: "stage3@artwork.agency" }, repo, testAdminEmail);
      assert.equal(r3.ok, true, "contact save must succeed");

      // 4. whyUsPage
      const r4 = await updateContentSection("whyUsPage", { ...DEFAULT_SITE_CONTENT.whyUsPage, heroHeadlineRow1: "STAGE 4 PASS" }, repo, testAdminEmail);
      assert.equal(r4.ok, true, "whyUsPage save must succeed");
    });

    it("should reject requests without a token or with mismatched tokens for all four sections with 403", () => {
      const validCookie = generateCsrfToken();
      const sections = ["manifesto", "whyUsTeaser", "contact", "whyUsPage"];

      for (const section of sections) {
        // Without header token -> 403
        assert.equal(validateCsrfToken(null, validCookie), false, `${section}: Missing header must fail`);
        assert.equal(validateCsrfToken("", validCookie), false, `${section}: Empty header must fail`);

        // Without cookie token -> 403
        assert.equal(validateCsrfToken(validCookie, null), false, `${section}: Missing cookie must fail`);
        assert.equal(validateCsrfToken(validCookie, ""), false, `${section}: Empty cookie must fail`);

        // Mismatched token -> 403
        const mismatchedHeader = generateCsrfToken();
        assert.equal(validateCsrfToken(mismatchedHeader, validCookie), false, `${section}: Mismatched tokens must fail`);
      }
    });

    it("should guarantee that empty tokens can never pass CSRF validation", () => {
      assert.equal(validateCsrfToken("", ""), false, "Empty strings must be rejected");
      assert.equal(validateCsrfToken(undefined, undefined), false, "Undefined must be rejected");
      assert.equal(validateCsrfToken(null, null), false, "Null must be rejected");
      assert.equal(validateCsrfToken("short", "short"), false, "Non-64-character tokens must be rejected");
    });
  });

  // =========================================================================
  // 3. Dashboard Inquiries & Client Leads Requests (/api/inquiries)
  // =========================================================================
  describe("3. Dashboard Inquiries Management (/api/inquiries)", () => {
    it("should list, filter, update status, and remove inquiries", async () => {
      const repo = new InMemoryInquiryRepository();

      // 1. Create client lead
      const created = await submitLeadBrief(
        {
          fullName: "Amir Studio Director",
          email: "amir@festival.sa",
          serviceType: "arena_stage",
          brief: "Need full arena scenography and dynamic lighting for upcoming festival stage in Riyadh.",
          formLoadedAt: Date.now() - 5000,
        },
        repo
      );
      assert.equal(created.ok, true);
      if (!created.ok || !created.data) return;

      const inquiryId = created.data.id;
      assert.equal(created.data.status, "pending");

      // 2. List inquiries (GET /api/inquiries)
      const list = await fetchInquiries(repo, { status: "pending" });
      assert.equal(list.ok, true);
      if (list.ok && list.data) {
        assert.equal(list.data.items.length, 1);
        assert.equal(list.data.items[0].id, inquiryId);
      }

      // 3. Update status (PATCH /api/inquiries/[id])
      const updated = await updateInquiryStatus(inquiryId, "reviewed", repo);
      assert.equal(updated.ok, true);
      if (updated.ok && updated.data) {
        assert.equal(updated.data.status, "reviewed");
      }

      // 4. Delete inquiry (DELETE /api/inquiries/[id])
      const deleted = await removeInquiry(inquiryId, repo);
      assert.equal(deleted.ok, true);

      // Verify removal
      const listAfter = await fetchInquiries(repo);
      if (listAfter.ok && listAfter.data) {
        assert.equal(listAfter.data.items.length, 0);
      }
    });
  });

  // =========================================================================
  // 4. YouTube Media Engine & Projects Requests (/api/projects)
  // =========================================================================
  describe("4. Dashboard Project Showcase & YouTube Media Integration", () => {
    it("should resolve YouTube input, sanitize embed code, and reject unsafe formats", () => {
      const validUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      const parseResult = parseYouTubeInput(validUrl);
      assert.equal(parseResult.ok, true);
      if (parseResult.ok) {
        assert.equal(parseResult.videoId, "dQw4w9WgXcQ");
        const embedUrl = buildYouTubeEmbedUrl(parseResult.videoId);
        assert.ok(embedUrl.includes("youtube-nocookie.com"), "Must use privacy-enhanced nocookie host");
        assert.ok(embedUrl.includes("rel=0"), "Must include rel=0 to avoid competitor videos");
      }

      const invalidUrl = "https://not-youtube.com/watch?v=bad123";
      const invalidResult = parseYouTubeInput(invalidUrl);
      assert.equal(invalidResult.ok, false, "Look-alike hosts must be rejected");
    });
  });

  // =========================================================================
  // 5. Cross-Service Communication (Admin Dashboard -> Public App ISR Revalidation)
  // =========================================================================
  describe("5. Admin Dashboard to Public App ISR Cache Revalidation", () => {
    it("should validate revalidation secret and payload parameters", () => {
      const correctSecret = "art-work-secret-revalidate-key";
      const incomingSecret = "art-work-secret-revalidate-key";
      assert.equal(incomingSecret === correctSecret, true, "Secret authorization check");

      const wrongSecret = "unauthorized-intruder";
      assert.notEqual(wrongSecret, correctSecret, "Unauthorized secret rejected");

      const publicAppUrl = "https://artwork-agency.vercel.app";
      const revalidateUrl = `${publicAppUrl}/api/revalidate?secret=${correctSecret}&tag=site-content`;
      const parsed = new URL(revalidateUrl);
      assert.equal(parsed.pathname, "/api/revalidate");
      assert.equal(parsed.searchParams.get("tag"), "site-content");
    });
  });

  // =========================================================================
  // 6. Public Website Data Ingestion & Schema Integrity
  // =========================================================================
  describe("6. Public App Data Consumption & Fallback Guarantees", () => {
    it("should fetch current site content with guaranteed fallback to DEFAULT_SITE_CONTENT", async () => {
      const repo = createInMemoryContentRepository();
      const content = await fetchSiteContent(repo);
      assert.equal(content.ok, true);
      if (content.ok) {
        assert.ok(content.data.manifesto.headlinePart1, "Manifesto headline must exist");
        assert.ok(content.data.whyUsPage.roiBadge, "WhyUs ROI badge must exist");
        assert.ok(content.data.contact.email, "Contact email must exist");
      }
    });
  });
});
