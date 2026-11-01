import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parseBehanceInput,
  fetchBehanceMetadata,
  normalizeProjectInput,
  ProjectInputSchema,
} from "../src/index";
import {
  mapDbProjectToRecord,
  mapRecordToDbProject,
  isValidBehanceUrl,
  type DbProjectRecord,
  type ProjectRecord,
} from "@art-work/types";

describe("Phase 11: Behance Media Engine & Booth Portfolio Integration", () => {
  describe("1. URL Validation & Parsing (parseBehanceInput)", () => {
    it("should parse canonical Behance gallery URLs and extract project ID", () => {
      const url = "https://www.behance.net/gallery/18928374/Sensory-Expo-Custom-Pavilion";
      const result = parseBehanceInput(url);

      assert.equal(result.ok, true);
      if (result.ok) {
        assert.equal(result.projectId, "18928374");
        assert.equal(result.slug, "Sensory-Expo-Custom-Pavilion");
        assert.equal(
          result.canonicalUrl,
          "https://www.behance.net/gallery/18928374/Sensory-Expo-Custom-Pavilion"
        );
      }
    });

    it("should accept behance.net without www and normalize to canonical URL", () => {
      const url = "https://behance.net/gallery/99887766/Pharma-Booth-3D";
      const result = parseBehanceInput(url);

      assert.equal(result.ok, true);
      if (result.ok) {
        assert.equal(result.projectId, "99887766");
        assert.equal(
          result.canonicalUrl,
          "https://www.behance.net/gallery/99887766/Pharma-Booth-3D"
        );
      }
    });

    it("should reject raw HTML tags and <iframe> injection attempts", () => {
      const injection = '<iframe src="https://www.behance.net/gallery/123"></iframe>';
      const result = parseBehanceInput(injection);

      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.reason, "contains_html");
      }
    });

    it("should reject look-alike and unapproved domains", () => {
      const badHost = "https://www.behance-phishing.com/gallery/123456";
      const result = parseBehanceInput(badHost);

      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.reason, "unapproved_host");
      }
    });

    it("should reject non-HTTP/HTTPS protocols", () => {
      const badProtocol = "ftp://www.behance.net/gallery/123";
      const result = parseBehanceInput(badProtocol);

      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.reason, "unsupported_protocol");
      }
    });

    it("should handle empty or null input without throwing", () => {
      assert.equal(parseBehanceInput("").ok, false);
      assert.equal(parseBehanceInput(null).ok, false);
      assert.equal(parseBehanceInput(undefined).ok, false);
    });

    it("should expose strict type guard isValidBehanceUrl", () => {
      assert.equal(isValidBehanceUrl("https://www.behance.net/gallery/12345/Booth"), true);
      assert.equal(isValidBehanceUrl("https://fakebehance.net/test"), false);
      assert.equal(isValidBehanceUrl("<script>alert(1)</script>"), false);
      assert.equal(isValidBehanceUrl(""), false);
    });
  });

  describe("2. Metadata Resolution & Scraper (fetchBehanceMetadata)", () => {
    it("should resolve metadata from Behance oEmbed mock response", async () => {
      const mockFetch = async () =>
        new Response(
          JSON.stringify({
            title: "Nova MedTech Custom Booth 2026",
            description: "3D architectural pavilion fabricated for medical expo.",
            thumbnail_url: "https://mir-s3-cdn-cf.behance.net/projects/404/abc1234.jpg",
            author_name: "Art Work Studio",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );

      const res = await fetchBehanceMetadata(
        "https://www.behance.net/gallery/123456/Nova-MedTech",
        mockFetch as unknown as typeof fetch
      );

      assert.equal(res.ok, true);
      if (res.ok) {
        assert.equal(res.data.title, "Nova MedTech Custom Booth 2026");
        assert.equal(
          res.data.coverImageUrl,
          "https://mir-s3-cdn-cf.behance.net/projects/404/abc1234.jpg"
        );
        assert.equal(res.data.authorName, "Art Work Studio");
      }
    });

    it("should fall back to OpenGraph HTML tags when oEmbed fails", async () => {
      let callCount = 0;
      const mockFetch = async () => {
        callCount++;
        if (callCount === 1) {
          // oEmbed fails
          return new Response("Not Found", { status: 404 });
        }
        // HTML response with og meta tags
        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta property="og:title" content="Sensory Kinetic Pavilion 2026" />
              <meta property="og:description" content="Spatial 3D Truss & Light Renders" />
              <meta property="og:image" content="https://mir-s3-cdn-cf.behance.net/renders/cover_large.png" />
            </head>
            <body></body>
          </html>
        `;
        return new Response(html, { status: 200, headers: { "Content-Type": "text/html" } });
      };

      const res = await fetchBehanceMetadata(
        "https://www.behance.net/gallery/999888/Sensory-Kinetic",
        mockFetch as unknown as typeof fetch
      );

      assert.equal(res.ok, true);
      if (res.ok) {
        assert.equal(res.data.title, "Sensory Kinetic Pavilion 2026");
        assert.equal(
          res.data.coverImageUrl,
          "https://mir-s3-cdn-cf.behance.net/renders/cover_large.png"
        );
      }
    });
  });

  describe("3. Schema & Normalization Integration", () => {
    it("should validate and accept projects with valid behance_url in ProjectInputSchema", () => {
      const validPayload = {
        slug: "booth-cybertruss",
        title: "Cybertruss Exhibition Booth",
        client: "Pharmapack Global",
        category: "booths",
        year: 2026,
        description: "Full scale 3D exhibition booth with kinetic LED framing.",
        cover_image_url: "/assets/images/gallery/project_03_cybertruss.jpg",
        cover_image_alt: "Cybertruss Booth",
        behance_url: "https://www.behance.net/gallery/88776655/Cybertruss-Booth",
        images: ["/assets/images/gallery/project_03_cybertruss.jpg"],
        status: "published",
      };

      const parsed = ProjectInputSchema.safeParse(validPayload);
      assert.equal(parsed.success, true);
      if (parsed.success) {
        assert.equal(
          parsed.data.behance_url,
          "https://www.behance.net/gallery/88776655/Cybertruss-Booth"
        );
      }
    });

    it("should normalize both behanceUrl and behance_url in normalizeProjectInput", () => {
      const camelCaseInput = {
        slug: "booth-medtech",
        title: "Medtech Pavilion",
        client: "Medtech Industries",
        category: "booths",
        year: 2026,
        description: "3D modular pavilion with suspended circular displays.",
        image: "/assets/images/gallery/project_06_sensory_expo.jpg",
        behanceUrl: "https://www.behance.net/gallery/11223344/Medtech-Pavilion",
      };

      const normalized = normalizeProjectInput(camelCaseInput);
      assert.equal(normalized.ok, true);
      if (normalized.ok) {
        assert.equal(
          normalized.data.behance_url,
          "https://www.behance.net/gallery/11223344/Medtech-Pavilion"
        );
      }
    });

    it("should map behanceUrl bidirectionally in mapDbProjectToRecord and mapRecordToDbProject", () => {
      const dbRow: DbProjectRecord = {
        id: "proj-uuid-1234",
        slug: "sensory-booth",
        title: "Sensory Booth",
        client: "Nova Corp",
        category: "booths",
        year: 2026,
        description: "Kinetic interactive booth.",
        tags: ["Booth", "3D"],
        stamp: "2026",
        meta_badge: "BOOTH",
        cad_id: "CAD-BOOTH-01",
        cover_image_url: "/assets/images/gallery/project_06_sensory_expo.jpg",
        cover_image_alt: "Sensory Booth Alt",
        stats_primary: "350 m²",
        stats_secondary: "3 Levels",
        specs: ["Steel frame"],
        behance_url: "https://www.behance.net/gallery/55667788/Sensory-Booth",
        status: "published",
        order_index: 1,
        featured: true,
      };

      const record: ProjectRecord = mapDbProjectToRecord(dbRow);
      assert.equal(
        record.behanceUrl,
        "https://www.behance.net/gallery/55667788/Sensory-Booth"
      );

      const mappedBack = mapRecordToDbProject(record);
      assert.equal(
        mappedBack.behance_url,
        "https://www.behance.net/gallery/55667788/Sensory-Booth"
      );
    });
  });
});
