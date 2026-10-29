import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parseYouTubeInput,
  buildYouTubeEmbedUrl,
  buildYouTubeWatchUrl,
  buildYouTubeShortsUrl,
  getYouTubePosterCandidates,
  isValidYouTubeId,
  extractDescriptionFromHtml,
  fetchYouTubeMetadata,
  isGenericYouTubeDescription,
} from "../src/media/youtube";
import { YouTubeUrlSchema } from "../src/schemas/project";
import { resolveSafeYouTubeEmbed } from "@art-work/types";

const ID = "dQw4w9WgXcQ";

describe("Phase 05: YouTube Media Engine", () => {
  const accepted: [string, string][] = [
    [ID, "bare id"],
    [`https://www.youtube.com/watch?v=${ID}`, "watch"],
    [`https://youtube.com/watch?v=${ID}`, "watch no www"],
    [`http://www.youtube.com/watch?v=${ID}`, "http"],
    [`https://m.youtube.com/watch?v=${ID}`, "mobile"],
    [`https://music.youtube.com/watch?v=${ID}`, "music"],
    [`https://www.youtube.com/watch?v=${ID}&t=42s`, "timestamp"],
    [`https://www.youtube.com/watch?feature=share&v=${ID}`, "param order"],
    [`https://youtu.be/${ID}`, "short"],
    [`https://youtu.be/${ID}?t=10`, "short timestamp"],
    [`https://www.youtube.com/embed/${ID}`, "embed"],
    [`https://www.youtube-nocookie.com/embed/${ID}`, "nocookie embed"],
    [`https://www.youtube.com/shorts/${ID}`, "shorts"],
    [`https://www.youtube.com/live/${ID}`, "live"],
    [`https://www.youtube.com/v/${ID}`, "legacy /v/"],
    [`www.youtube.com/watch?v=${ID}`, "no protocol"],
    [`  https://youtu.be/${ID}  `, "whitespace padded"],
  ];

  for (const [input, label] of accepted) {
    it(`should extract the ID from ${label}`, () => {
      const r = parseYouTubeInput(input);
      assert.ok(r.ok, `expected ok for ${input}`);
      if (r.ok) {
        assert.equal(r.videoId, ID);
        assert.equal(r.canonicalUrl, `https://www.youtube.com/watch?v=${ID}`);
      }
    });
  }

  it("should reject raw iframe HTML", () => {
    const html = `<iframe src="https://www.youtube.com/embed/${ID}"></iframe>`;
    const r = parseYouTubeInput(html);
    assert.deepEqual(r, { ok: false, reason: "contains_html" });
  });

  it("should reject script/unsafe protocols", () => {
    for (const bad of ["javascript:alert(1)", "data:text/html;base64,AAAA", "ftp://youtube.com/watch?v=" + ID]) {
      const r = parseYouTubeInput(bad);
      assert.equal(r.ok, false, bad);
    }
  });

  it("should reject look-alike and unapproved hosts", () => {
    const bad = [
      `https://evil.com/watch?v=${ID}`,
      `https://youtube.com.evil.com/watch?v=${ID}`,
      `https://evil.com/?u=youtube.com&v=${ID}`,
      `https://notyoutube.com/watch?v=${ID}`,
      `https://youtu.be.evil.com/${ID}`,
      `https://user:pass@www.youtube.com/watch?v=${ID}`,
    ];
    for (const b of bad) {
      const r = parseYouTubeInput(b);
      assert.equal(r.ok, false, b);
    }
  });

  it("should reject missing or malformed IDs", () => {
    assert.deepEqual(parseYouTubeInput("https://www.youtube.com/watch"), { ok: false, reason: "missing_video_id" });
    assert.deepEqual(parseYouTubeInput("https://www.youtube.com/"), { ok: false, reason: "missing_video_id" });
    assert.deepEqual(parseYouTubeInput("https://www.youtube.com/watch?v=short"), { ok: false, reason: "invalid_video_id" });
    assert.deepEqual(parseYouTubeInput("https://www.youtube.com/watch?v=" + ID + "extra"), { ok: false, reason: "invalid_video_id" });
  });

  it("should handle empty and non-string input without throwing", () => {
    assert.equal(parseYouTubeInput("").ok, false);
    assert.equal(parseYouTubeInput("   ").ok, false);
    assert.equal(parseYouTubeInput(null).ok, false);
    assert.equal(parseYouTubeInput(undefined).ok, false);
    assert.equal(parseYouTubeInput(42).ok, false);
  });

  it("should build embed URLs only from the approved nocookie host", () => {
    const url = new URL(buildYouTubeEmbedUrl(ID));
    assert.equal(url.origin, "https://www.youtube-nocookie.com");
    assert.equal(url.pathname, `/embed/${ID}`);
    assert.equal(url.searchParams.get("rel"), "0");
    assert.equal(url.searchParams.get("autoplay"), null);

    const timed = new URL(buildYouTubeEmbedUrl(ID, { start: 12.9, autoplay: true }));
    assert.equal(timed.searchParams.get("start"), "12");
    assert.equal(timed.searchParams.get("autoplay"), "1");
  });

  it("should use the privacy-enhanced host for embeds returned to public pages", () => {
    const result = resolveSafeYouTubeEmbed(`https://www.youtube.com/shorts/${ID}`);
    assert.ok(result);
    if (!result) return;
    const url = new URL(result.embedUrl);
    assert.equal(url.origin, "https://www.youtube-nocookie.com");
    assert.equal(url.pathname, `/embed/${ID}`);
    assert.equal(result.isShort, true);
  });

  it("should refuse to build URLs from an invalid ID (no injection)", () => {
    for (const bad of ["../../evil", `${ID}"onload="x`, "short", ""]) {
      assert.throws(() => buildYouTubeEmbedUrl(bad));
      assert.throws(() => buildYouTubeWatchUrl(bad));
      assert.throws(() => getYouTubePosterCandidates(bad));
    }
  });

  it("should order poster candidates best-first on ytimg host", () => {
    const posters = getYouTubePosterCandidates(ID);
    assert.equal(posters.length, 3);
    assert.ok(posters[0].endsWith("/maxresdefault.jpg"));
    assert.ok(posters[2].endsWith("/hqdefault.jpg"));
    assert.ok(posters.every((p) => p.startsWith("https://i.ytimg.com/vi/")));
  });

  it("should expose a strict ID type guard", () => {
    assert.equal(isValidYouTubeId(ID), true);
    assert.equal(isValidYouTubeId("<iframe>"), false);
    assert.equal(isValidYouTubeId(123), false);
  });

  it("should harden the project youtube_url schema against look-alike hosts", () => {
    assert.ok(YouTubeUrlSchema.safeParse(`https://youtu.be/${ID}`).success);
    assert.ok(YouTubeUrlSchema.safeParse(null).success);
    assert.equal(YouTubeUrlSchema.safeParse("https://evil.com/?youtube.com").success, false);
    assert.equal(YouTubeUrlSchema.safeParse("https://www.youtube.com/").success, false);
  });

  it("should detect YouTube Shorts/Reels format on /shorts/ URLs", () => {
    const shortRes = parseYouTubeInput(`https://www.youtube.com/shorts/${ID}`);
    assert.ok(shortRes.ok);
    if (shortRes.ok) {
      assert.equal(shortRes.isShort, true);
    }

    const watchRes = parseYouTubeInput(`https://www.youtube.com/watch?v=${ID}`);
    assert.ok(watchRes.ok);
    if (watchRes.ok) {
      assert.equal(watchRes.isShort, undefined);
    }

    assert.equal(buildYouTubeShortsUrl(ID), `https://www.youtube.com/shorts/${ID}`);
  });

  it("should extract and decode meta description from YouTube HTML safely", () => {
    const sampleHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta property="og:description" content="Volumetric 8K &amp; Kinetic Stage Rig &#39;Live&#39; in Arena." />
      </head>
      </html>
    `;
    const desc = extractDescriptionFromHtml(sampleHtml);
    assert.equal(desc, "Volumetric 8K & Kinetic Stage Rig 'Live' in Arena.");
  });

  it("should fetch YouTube Headline (title) and Paragraph (description) via mocked fetch", async () => {
    const mockFetch: typeof fetch = async (input) => {
      const url = String(input);
      if (url.includes("/oembed")) {
        return new Response(
          JSON.stringify({
            title: "NEON GENESIS ARENA — Official 9:16 Reel",
            author_name: "Art Work Studio",
            thumbnail_url: `https://i.ytimg.com/vi/${ID}/hqdefault.jpg`,
            width: 315,
            height: 560,
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        );
      }
      return new Response(
        `<html><head><meta name="description" content="Behind the scenes of our 180-degree curved LED megastructure and kinetic lighting choreography."></head></html>`,
        { status: 200, headers: { "content-type": "text/html" } },
      );
    };

    const meta = await fetchYouTubeMetadata(`https://www.youtube.com/shorts/${ID}`, mockFetch);
    assert.ok(meta.ok);
    if (meta.ok) {
      assert.equal(meta.data.videoId, ID);
      assert.equal(meta.data.isShort, true);
      assert.equal(meta.data.headline, "NEON GENESIS ARENA — Official 9:16 Reel");
      assert.equal(
        meta.data.paragraph,
        "Behind the scenes of our 180-degree curved LED megastructure and kinetic lighting choreography.",
      );
      assert.equal(meta.data.authorName, "Art Work Studio");
    }
  });

  it("should accurately detect generic YouTube boilerplate slogans in English and Arabic", () => {
    assert.equal(
      isGenericYouTubeDescription(
        "Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube."
      ),
      true
    );
    assert.equal(
      isGenericYouTubeDescription(
        "يمكنك الاستمتاع بالفيديوهات والموسيقى التي تحبها وتحميل المحتوى الأصلي ومشاركته بكامله مع أصدقائك وأفراد عائلتك والعالم أجمع على YouTube."
      ),
      true
    );
    assert.equal(isGenericYouTubeDescription(""), true);
    assert.equal(isGenericYouTubeDescription(null), true);
    assert.equal(
      isGenericYouTubeDescription(
        "Rameda Cycle Meeting 2022\n\nCelebrating the people behind the progress."
      ),
      false
    );
  });

  it("should reject generic YouTube boilerplate meta tags and extract true JSON shortDescription", () => {
    const htmlWithGenericMetaAndRealJson = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="description" content="Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.">
        <meta property="og:description" content="Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.">
      </head>
      <body>
        <script>
          var ytInitialPlayerResponse = {
            "videoDetails": {
              "title": "Rameda Cycle meeting 2022",
              "shortDescription": "Rameda Cycle Meeting 2022\\n\\nCelebrating the people behind the progress. Rameda’s 2022 Cycle Meeting brought the team together."
            }
          };
        </script>
      </body>
      </html>
    `;
    const desc = extractDescriptionFromHtml(htmlWithGenericMetaAndRealJson);
    assert.ok(desc);
    assert.equal(
      desc,
      "Rameda Cycle Meeting 2022\n\nCelebrating the people behind the progress. Rameda’s 2022 Cycle Meeting brought the team together."
    );
  });

  it("should return null if HTML contains only generic boilerplate without a genuine description", () => {
    const htmlWithOnlyGenericMeta = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="description" content="Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.">
      </head>
      </html>
    `;
    const desc = extractDescriptionFromHtml(htmlWithOnlyGenericMeta);
    assert.equal(desc, null);
  });
});
