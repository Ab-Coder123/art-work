import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ProjectInputSchema,
  YouTubeVideoIdSchema,
  YouTubeUrlSchema,
  SlugSchema,
  SiteContentInputSchema,
  HeroSectionDataSchema,
  InquiryInputSchema,
  AdminUserInputSchema,
  ContentAuditLogSchema,
} from "../src/index";

describe("Phase 02: Relational Schemas & Zod Constraints", () => {
  describe("Project Showcase Schema", () => {
    const validProject = {
      slug: "neon-horizon-stage",
      title: "Neon Horizon World Tour",
      client: "Global Music Live",
      category: "stage" as const,
      year: 2026,
      description: "Parametric LED stage rig with 360-degree kinetic motion.",
      tags: ["Stage", "LED", "Kinetic"],
      stamp: "ARENA // 2026",
      meta_badge: "IMMERSIVE LED",
      cad_id: "CAD-REV-04",
      cover_image_url: "/assets/images/gallery/project_01.jpg",
      cover_image_alt: "Neon Horizon concert stage",
      stats_primary: "52,000",
      stats_secondary: "FANS / NIGHT",
      specs: ["100% Custom Rig", "0.0s DMX Latency"],
      youtube_video_id: "dQw4w9WgXcQ",
      youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      status: "published" as const,
      order_index: 1,
      featured: true,
    };

    it("should accept a complete and valid project payload", () => {
      const parsed = ProjectInputSchema.parse(validProject);
      assert.equal(parsed.slug, "neon-horizon-stage");
      assert.equal(parsed.year, 2026);
      assert.equal(parsed.category, "stage");
      assert.equal(parsed.status, "published");
      assert.equal(parsed.youtube_video_id, "dQw4w9WgXcQ");
    });

    it("should reject invalid year constraints (year < 2020 or year > 2035)", () => {
      // Too old
      assert.throws(() => {
        ProjectInputSchema.parse({ ...validProject, year: 2018 });
      }, /Year must be 2020 or later/);

      // Too far in the future
      assert.throws(() => {
        ProjectInputSchema.parse({ ...validProject, year: 2040 });
      }, /Year cannot exceed 2035/);
    });

    it("should reject invalid slug formats", () => {
      const invalidSlugs = [
        "Upper_Case_Slug",
        "has spaces in slug",
        "slug_with_underscores",
        "slug@special!chars",
        "-leading-hyphen",
        "trailing-hyphen-",
      ];

      for (const slug of invalidSlugs) {
        assert.throws(() => {
          SlugSchema.parse(slug);
        }, /Slug must be lowercase alphanumeric with hyphens/);
      }
    });

    it("should strictly reject raw iframe HTML snippets in youtube_video_id", () => {
      const xssIframePayloads = [
        '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>',
        '<script>alert("xss")</script>',
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // URL is not ID
        "too-long-video-identifier-12345",
        "short",
      ];

      for (const payload of xssIframePayloads) {
        assert.throws(() => {
          YouTubeVideoIdSchema.parse(payload);
        }, /YouTube video ID must be an exact 11-character identifier/);
      }

      // Valid 11-char ID
      assert.equal(YouTubeVideoIdSchema.parse("dQw4w9WgXcQ"), "dQw4w9WgXcQ");
      assert.equal(YouTubeVideoIdSchema.parse(null), null);
      assert.equal(YouTubeVideoIdSchema.parse(undefined), undefined);
    });

    it("should validate YouTube URLs properly", () => {
      assert.ok(YouTubeUrlSchema.parse("https://www.youtube.com/watch?v=dQw4w9WgXcQ"));
      assert.ok(YouTubeUrlSchema.parse("https://youtu.be/dQw4w9WgXcQ"));

      assert.throws(() => {
        YouTubeUrlSchema.parse("https://vimeo.com/12345678");
      }, /approved YouTube host/);
    });

    it("should reject invalid project categories", () => {
      assert.throws(() => {
        ProjectInputSchema.parse({ ...validProject, category: "concert" as any });
      });
    });
  });

  describe("Site Content Schema", () => {
    it("should validate Hero section data contract", () => {
      const validHero = {
        headline_highlight: "KINETIC STAGES.",
        headline_suffix: "UNFORGETTABLE EXPERIENCES.",
        subheadline: "We engineer architectural scenography and immersive concert stages.",
        tags: ["Scenography", "Lighting Architecture", "3D Trussing"],
        cta_primary_text: "Explore Showcase",
        cta_primary_href: "/gallery",
        cta_secondary_text: "Our Philosophy",
        cta_secondary_href: "/why-us",
        banner_badge: "WORLD TOUR 2026",
      };

      const parsed = HeroSectionDataSchema.parse(validHero);
      assert.equal(parsed.headline_highlight, "KINETIC STAGES.");

      const siteContentRecord = SiteContentInputSchema.parse({
        section_key: "hero",
        data: validHero,
        status: "published",
        version: 1,
      });
      assert.equal(siteContentRecord.section_key, "hero");
      assert.equal(siteContentRecord.version, 1);
    });

    it("should reject invalid section keys", () => {
      assert.throws(() => {
        SiteContentInputSchema.parse({
          section_key: "non_existent_section" as any,
          data: {},
        });
      });
    });
  });

  describe("Client Inquiry Schema", () => {
    it("should accept a valid client intake form submission", () => {
      const validInquiry = {
        full_name: "John Doe",
        email: "john@example.com",
        service_type: "Concert Stage Design",
        brief: "We are organizing a 3-city arena tour and need full kinetic stage scenography.",
        status: "pending" as const,
      };

      const parsed = InquiryInputSchema.parse(validInquiry);
      assert.equal(parsed.full_name, "John Doe");
      assert.equal(parsed.status, "pending");
    });

    it("should reject invalid emails in inquiries", () => {
      assert.throws(() => {
        InquiryInputSchema.parse({
          full_name: "John Doe",
          email: "not-an-email",
          service_type: "Stage",
          brief: "Detailed project brief with more than ten characters.",
        });
      }, /Please provide a valid email address/);
    });

    it("should reject briefs shorter than 10 characters", () => {
      assert.throws(() => {
        InquiryInputSchema.parse({
          full_name: "John Doe",
          email: "john@example.com",
          service_type: "Stage",
          brief: "too short",
        });
      }, /Project brief must be at least 10 characters/);
    });
  });

  describe("Admin User Membership Schema", () => {
    it("should validate administrator records", () => {
      const validAdmin = {
        user_id: "00000000-0000-0000-0000-000000000001",
        email: "superadmin@artwork.stage",
        full_name: "Chief Studio Architect",
        role: "super_admin" as const,
        is_active: true,
      };

      const parsed = AdminUserInputSchema.parse(validAdmin);
      assert.equal(parsed.role, "super_admin");
      assert.equal(parsed.is_active, true);
    });

    it("should reject non-UUID user_id", () => {
      assert.throws(() => {
        AdminUserInputSchema.parse({
          user_id: "not-a-uuid",
          email: "admin@artwork.stage",
          full_name: "Admin User",
          role: "editor",
        });
      }, /user_id must be a valid UUID/);
    });
  });

  describe("Content Audit Log Schema", () => {
    it("should validate audit log creation entries", () => {
      const validAudit = {
        entity_type: "project" as const,
        entity_id: "neon-horizon-stage",
        action: "update" as const,
        actor_id: "00000000-0000-0000-0000-000000000001",
        actor_email: "editor@artwork.stage",
        before_state: { status: "draft" },
        after_state: { status: "published" },
      };

      const parsed = ContentAuditLogSchema.parse(validAudit);
      assert.equal(parsed.action, "update");
      assert.equal(parsed.entity_type, "project");
      assert.equal(parsed.actor_email, "editor@artwork.stage");
    });
  });
});
