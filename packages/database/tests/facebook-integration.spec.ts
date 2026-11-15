import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parseFacebookVideoInput,
  buildFacebookEmbedUrl,
  normalizeProjectInput,
  ProjectInputSchema,
} from "../src/index";
import {
  mapDbProjectToRecord,
  mapRecordToDbProject,
  isValidFacebookVideoUrl,
  resolveSafeFacebookEmbed,
  resolveHomeShowcaseItems,
  type DbProjectRecord,
  type ProjectRecord,
} from "@art-work/types";

describe("Facebook Video & Reel Media Engine Integration", () => {
  describe("1. URL Validation & Parsing (parseFacebookVideoInput)", () => {
    it("should parse standard Facebook watch URLs", () => {
      const url = "https://www.facebook.com/watch/?v=10158237461942183";
      const result = parseFacebookVideoInput(url);

      assert.equal(result.ok, true);
      if (result.ok) {
        assert.equal(result.isReel, false);
        assert.equal(result.canonicalUrl, "https://www.facebook.com/watch/?v=10158237461942183");
        assert.ok(result.embedUrl.includes("facebook.com/plugins/video.php"));
        assert.ok(result.embedUrl.includes(encodeURIComponent(url)));
      }
    });

    it("should parse Facebook page video URLs", () => {
      const url = "https://facebook.com/artworkstudio/videos/987654321098/";
      const result = parseFacebookVideoInput(url);

      assert.equal(result.ok, true);
      if (result.ok) {
        assert.equal(result.isReel, false);
        assert.ok(result.canonicalUrl.includes("facebook.com/artworkstudio/videos/987654321098/"));
      }
    });

    it("should detect vertical 9:16 format for Facebook Reels", () => {
      const reelUrl = "https://www.facebook.com/reel/1234567890123456";
      const result = parseFacebookVideoInput(reelUrl);

      assert.equal(result.ok, true);
      if (result.ok) {
        assert.equal(result.isReel, true);
        assert.ok(result.embedUrl.includes("plugins/video.php"));
      }
    });

    it("should detect vertical 9:16 format for Facebook Reel share links (/share/r/)", () => {
      const reelShareUrl = "https://www.facebook.com/share/r/xyz123abc/";
      const result = parseFacebookVideoInput(reelShareUrl);

      assert.equal(result.ok, true);
      if (result.ok) {
        assert.equal(result.isReel, true);
      }
    });

    it("should parse Facebook Video share links (/share/v/)", () => {
      const videoShareUrl = "https://www.facebook.com/share/v/abc987xyz/";
      const result = parseFacebookVideoInput(videoShareUrl);

      assert.equal(result.ok, true);
      if (result.ok) {
        assert.equal(result.isReel, false);
      }
    });

    it("should parse fb.watch short URLs", () => {
      const fbWatchUrl = "https://fb.watch/sampleCode123/";
      const result = parseFacebookVideoInput(fbWatchUrl);

      assert.equal(result.ok, true);
      if (result.ok) {
        assert.ok(result.canonicalUrl.includes("fb.watch/sampleCode123/"));
      }
    });

    it("should support web.facebook.com and m.facebook.com hosts", () => {
      const webFb = "https://web.facebook.com/watch/?v=999888777";
      const resWeb = parseFacebookVideoInput(webFb);
      assert.equal(resWeb.ok, true);

      const mFb = "https://m.facebook.com/watch/?v=555444333";
      const resM = parseFacebookVideoInput(mFb);
      assert.equal(resM.ok, true);
    });

    it("should reject raw HTML tags and script injection attempts", () => {
      const injection = '<script>alert("xss")</script>';
      const result = parseFacebookVideoInput(injection);

      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.reason, "contains_html");
      }
    });

    it("should extract canonical Facebook URL from pasted <iframe> embed codes and reject unapproved iframes", () => {
      const validIframe =
        '<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1120918597318558%2F&show_text=false&width=267&t=0" width="267" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>';
      const validResult = parseFacebookVideoInput(validIframe);
      assert.equal(validResult.ok, true);
      if (validResult.ok) {
        assert.equal(validResult.canonicalUrl, "https://www.facebook.com/reel/1120918597318558/");
        assert.equal(validResult.isReel, true);
      }

      const invalidIframe = '<iframe src="https://evil-phishing.com/video"></iframe>';
      const invalidResult = parseFacebookVideoInput(invalidIframe);
      assert.equal(invalidResult.ok, false);
    });

    it("should reject unapproved and phishing look-alike domains", () => {
      const badHost = "https://www.facebook-fake.com/watch/?v=123";
      const result = parseFacebookVideoInput(badHost);

      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.reason, "unapproved_host");
      }
    });

    it("should reject non-HTTP/HTTPS protocols", () => {
      const badProto = "javascript:alert('xss')";
      const result = parseFacebookVideoInput(badProto);

      assert.equal(result.ok, false);
    });

    it("should handle empty or null input without throwing", () => {
      assert.equal(parseFacebookVideoInput("").ok, false);
      assert.equal(parseFacebookVideoInput(null).ok, false);
      assert.equal(parseFacebookVideoInput(undefined).ok, false);
    });
  });

  describe("2. Client Helpers (isValidFacebookVideoUrl, resolveSafeFacebookEmbed)", () => {
    it("should return true for valid Facebook video URLs and false for invalid ones", () => {
      assert.equal(
        isValidFacebookVideoUrl("https://www.facebook.com/watch/?v=10158237461942183"),
        true
      );
      assert.equal(isValidFacebookVideoUrl("https://fb.watch/shortCode123/"), true);
      assert.equal(isValidFacebookVideoUrl("https://youtube.com/watch?v=12345678901"), false);
      assert.equal(isValidFacebookVideoUrl("not a url"), false);
      assert.equal(isValidFacebookVideoUrl(""), false);
      assert.equal(isValidFacebookVideoUrl(null), false);
    });

    it("should resolve safe embed objects from string or object inputs", () => {
      const embedFromString = resolveSafeFacebookEmbed("https://www.facebook.com/reel/9988776655");
      assert.ok(embedFromString);
      assert.equal(embedFromString?.isReel, true);
      assert.ok(embedFromString?.embedUrl.includes("plugins/video.php"));

      const embedFromObj = resolveSafeFacebookEmbed({
        facebookUrl: "https://www.facebook.com/watch/?v=123456789",
      });
      assert.ok(embedFromObj);
      assert.equal(embedFromObj?.isReel, false);
    });

    it("should allow explicit isShort toggle to switch between vertical 9:16 and horizontal 16:9", () => {
      const forcedVertical = resolveSafeFacebookEmbed({
        facebookUrl: "https://www.facebook.com/watch/?v=123456789",
        isShort: true,
      });
      assert.equal(forcedVertical?.isReel, true);

      const forcedHorizontal = resolveSafeFacebookEmbed({
        facebookUrl: "https://www.facebook.com/reel/9988776655",
        isShort: false,
      });
      assert.equal(forcedHorizontal?.isReel, false);
    });
  });

  describe("3. Schema & Normalization Integration", () => {
    const baseValidProject = {
      slug: "facebook-showcase-project",
      title: "Facebook Showcase Event",
      client: "Global Entertainment Brand",
      category: "stage" as const,
      year: 2026,
      description: "An extraordinary stage and live production event with viral Facebook video coverage.",
      tags: ["Stage", "Live Production"],
      stamp: "2026",
      meta_badge: "VIRAL CAMPAIGN",
      cad_id: "CAD-FB-01",
      cover_image_url: "/assets/images/gallery/rameda_event.jpg",
      cover_image_alt: "Facebook Showcase Cover",
      stats_primary: "5M+ Views",
      stats_secondary: "100% Reach",
      specs: ["4K Broadcast", "Spatial Audio"],
      status: "published" as const,
      order_index: 1,
      featured: true,
    };

    it("should validate and accept projects with valid facebook_url in ProjectInputSchema", () => {
      const payload = {
        ...baseValidProject,
        facebook_url: "https://www.facebook.com/watch/?v=10158237461942183",
      };

      const result = ProjectInputSchema.safeParse(payload);
      assert.equal(result.success, true);
      if (result.success) {
        assert.equal(result.data.facebook_url, "https://www.facebook.com/watch/?v=10158237461942183");
      }
    });

    it("should reject invalid facebook_url in ProjectInputSchema", () => {
      const payload = {
        ...baseValidProject,
        facebook_url: "https://not-facebook.com/video/123",
      };

      const result = ProjectInputSchema.safeParse(payload);
      assert.equal(result.success, false);
    });

    it("should normalize both camelCase facebookUrl and snake_case facebook_url in normalizeProjectInput", () => {
      const fromCamel = normalizeProjectInput({
        ...baseValidProject,
        facebookUrl: "https://www.facebook.com/reel/9988776655",
      });
      assert.equal(fromCamel.ok, true);
      if (fromCamel.ok) {
        assert.equal(fromCamel.data.facebook_url, "https://www.facebook.com/reel/9988776655");
      }

      const fromSnake = normalizeProjectInput({
        ...baseValidProject,
        facebook_url: "https://fb.watch/testcode123/",
      });
      assert.equal(fromSnake.ok, true);
      if (fromSnake.ok) {
        assert.equal(fromSnake.data.facebook_url, "https://fb.watch/testcode123/");
      }
    });

    it("should map facebookUrl bidirectionally in mapDbProjectToRecord and mapRecordToDbProject", () => {
      const dbRow: DbProjectRecord = {
        id: "fb-proj-123",
        slug: "fb-proj-123",
        title: "FB Live Stage",
        client: "Media Agency",
        category: "stage",
        year: 2026,
        description: "Full stage broadcast live streamed to Facebook audiences worldwide.",
        tags: ["Live", "Facebook"],
        stamp: "2026",
        meta_badge: "LIVE",
        cad_id: "CAD-FB-99",
        cover_image_url: "/assets/images/gallery/rameda_event.jpg",
        cover_image_alt: "FB Live Stage",
        stats_primary: "100k Concurrent",
        stats_secondary: "0 Dropouts",
        specs: ["Dual Redundant Encoders"],
        status: "published",
        order_index: 1,
        featured: true,
        facebook_url: "https://www.facebook.com/watch/?v=777888999",
      };

      const record: ProjectRecord = mapDbProjectToRecord(dbRow);
      assert.equal(record.facebookUrl, "https://www.facebook.com/watch/?v=777888999");

      const backToDb = mapRecordToDbProject(record);
      assert.equal(backToDb.facebook_url, "https://www.facebook.com/watch/?v=777888999");
    });
  });

  describe("4. Home Showcase Multi-Video Integration", () => {
    it("should include projects with facebookUrl in featuredVideos when starred for Home", () => {
      const sampleProjects: ProjectRecord[] = [
        {
          id: "fb-video-project",
          title: "FB Featured Event",
          client: "Global Media",
          category: "stage",
          year: 2026,
          description: "Featured event with Facebook video",
          tags: ["Stage"],
          stamp: "2026",
          metaBadge: "FEATURED",
          cadId: "CAD-01",
          image: "/assets/images/gallery/rameda_event.jpg",
          altText: "FB Event",
          stats: "",
          statsSub: "",
          specs: [],
          status: "published",
          order: 1,
          featured: true,
          facebookUrl: "https://www.facebook.com/watch/?v=1234567890",
        },
        {
          id: "non-video-project",
          title: "Architecture Render Only",
          client: "Real Estate Group",
          category: "booths",
          year: 2026,
          description: "Architectural booth render without video",
          tags: ["Booths"],
          stamp: "2026",
          metaBadge: "BOOTH",
          cadId: "CAD-02",
          image: "/assets/images/gallery/project_06_sensory_expo.jpg",
          altText: "Booth Render",
          stats: "",
          statsSub: "",
          specs: [],
          status: "published",
          order: 2,
          featured: true,
        },
      ];

      const showcase = resolveHomeShowcaseItems(sampleProjects);
      assert.equal(showcase.featuredVideos.length, 1);
      assert.equal(showcase.featuredVideos[0]?.id, "fb-video-project");
      assert.equal(showcase.nonVideoItems.length, 1);
      assert.equal(showcase.nonVideoItems[0]?.id, "non-video-project");
    });
  });
});
