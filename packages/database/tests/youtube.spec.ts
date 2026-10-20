import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parseYouTubeInput,
  buildYouTubeEmbedUrl,
  buildYouTubeWatchUrl,
  getYouTubePosterCandidates,
  isValidYouTubeId,
} from "../src/media/youtube";
import { YouTubeUrlSchema } from "../src/schemas/project";

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
});
