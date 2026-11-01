import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("CMS Phase 5: Admin Dashboard 8-Section CMS & ★ Star Home Video Controls", () => {
  const rootDir = path.resolve(process.cwd(), "../..");
  const adminContentPagePath = path.join(
    rootDir,
    "apps/admin/src/app/content/page.tsx"
  );
  const adminProjectsPagePath = path.join(
    rootDir,
    "apps/admin/src/app/projects/page.tsx"
  );
  const adminContentSectionApiPath = path.join(
    rootDir,
    "apps/admin/src/app/api/content/[section]/route.ts"
  );
  const adminProjectByIdApiPath = path.join(
    rootDir,
    "apps/admin/src/app/api/projects/[id]/route.ts"
  );

  it("1. upgrades /content dashboard editor with all 8 full-site CMS tabs", () => {
    const src = fs.readFileSync(adminContentPagePath, "utf-8");

    for (const sectionKey of [
      "manifesto",
      "whyUsTeaser",
      "services",
      "homeShowcase",
      "contact",
      "whyUsPage",
      "galleryPage",
      "layout",
    ]) {
      assert.ok(
        src.includes(`key: "${sectionKey}"`),
        `Admin content editor must include tab for '${sectionKey}'`
      );
      assert.ok(
        src.includes(`activeSection === "${sectionKey}"`),
        `Admin content editor must render form panel for '${sectionKey}'`
      );
    }

    // Dynamic array editors across sections
    assert.ok(src.includes("Add Bento Card"));
    assert.ok(src.includes("Add Service Card"));
    assert.ok(src.includes("Add Capability Card"));
    assert.ok(src.includes("Add Step"));
    assert.ok(src.includes("serviceOptions"));
    assert.ok(src.includes("Manage ★ Home Videos"));
    assert.ok(src.includes("`/api/content/${activeSection}`"));
  });

  it("2. upgrades /projects dashboard manager with 1-click ★ Star Home Video toggle & modal checkbox", () => {
    const src = fs.readFileSync(adminProjectsPagePath, "utf-8");

    assert.ok(
      src.includes("handleToggleFeatured"),
      "Admin projects page must define handleToggleFeatured"
    );
    assert.ok(
      src.includes("★ On Home"),
      "Admin projects page must display ★ On Home active star button"
    );
    assert.ok(
      src.includes("☆ Add to Home"),
      "Admin projects page must display ☆ Add to Home button for unstarred items"
    );
    assert.ok(
      src.includes("showHomeStarredOnly"),
      "Admin projects page must allow filtering ★ Home featured videos/projects"
    );
    assert.ok(
      src.includes('id="featuredHomeCheck"'),
      "Admin project Create/Edit modal must include featuredHomeCheck ★ checkbox"
    );
    assert.ok(
      src.includes("★ Show on Home Page (Video / Showcase)"),
      "Admin project Create/Edit modal must label the ★ Home video/showcase toggle clearly"
    );
    assert.ok(
      src.includes('method: "PATCH"'),
      "handleToggleFeatured must dispatch lightweight PATCH request"
    );
  });

  it("3. ensures Admin content & project API routes return 200 and revalidate /, /why-us, /gallery", () => {
    const contentRouteSrc = fs.readFileSync(adminContentSectionApiPath, "utf-8");
    const projectRouteSrc = fs.readFileSync(adminProjectByIdApiPath, "utf-8");

    assert.ok(contentRouteSrc.includes('{ status: 200 }'));
    assert.ok(contentRouteSrc.includes('tag: "site-content"'));
    assert.ok(contentRouteSrc.includes('path: "/"'));
    assert.ok(contentRouteSrc.includes('path: "/why-us"'));
    assert.ok(contentRouteSrc.includes('path: "/gallery"'));

    assert.ok(projectRouteSrc.includes("export async function PATCH"));
    assert.ok(projectRouteSrc.includes("toggleProjectFeatured"));
    assert.ok(projectRouteSrc.includes('{ status: 200 }'));
    assert.ok(projectRouteSrc.includes('["/", "/gallery"]'));
    assert.ok(projectRouteSrc.includes('tag: "projects"'));
  });
});
