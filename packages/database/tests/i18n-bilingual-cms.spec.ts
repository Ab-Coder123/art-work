import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  DEFAULT_COMPANIES,
  UI_DICTIONARY,
  getUiDictionary,
  isRtlLocale,
  normalizeLocale,
  resolveLocalizedCompany,
  resolveLocalizedProject,
  type ProjectRecord,
} from "@art-work/types";
import {
  DEFAULT_SITE_CONTENT,
  DEFAULT_SITE_CONTENT_AR,
  ProjectInputSchema,
  CompanyRecordSchema,
  createInMemoryContentRepository,
  fetchBilingualSiteContent,
  fetchSiteContent,
  normalizeSiteContent,
  rollbackContent,
  updateContentSection,
} from "../src/index";

describe("Bilingual AR/EN i18n Contracts, CMS Versioning & UI Wiring", () => {
  const rootDir = path.resolve(process.cwd(), "../..");

  it("1. normalizes locales, detects RTL, and resolves complete EN/AR UI dictionaries", () => {
    assert.equal(normalizeLocale("en"), "en");
    assert.equal(normalizeLocale("ar"), "ar");
    assert.equal(normalizeLocale("ar-EG"), "ar");
    assert.equal(normalizeLocale("unknown"), "en");
    assert.equal(isRtlLocale("ar"), true);
    assert.equal(isRtlLocale("en"), false);

    const en = getUiDictionary("en");
    const ar = getUiDictionary("ar");
    assert.equal(en.switchLanguageLabel, "AR");
    assert.equal(ar.switchLanguageLabel, "EN");
    assert.ok(ar.gallery.watchVideo.length > 0);
    assert.ok(ar.projectCategories.booths.length > 0);
    assert.deepEqual(
      Object.keys(UI_DICTIONARY.en),
      Object.keys(UI_DICTIONARY.ar),
      "EN and AR UI dictionaries must have identical top-level namespaces"
    );
  });

  it("2. resolves localized projects and companies with field-by-field fallback to English", () => {
    const baseProject: ProjectRecord = {
      id: "rameda-event",
      slug: "rameda-event",
      title: "Rameda Event",
      stamp: "2026",
      metaBadge: "ANNUAL GATHERING",
      cadId: "CAD-01",
      image: "/assets/images/gallery/project_01_neon_horizon.jpg",
      altText: "Rameda Event Stage",
      category: "conferences",
      year: 2026,
      tags: ["Conferences"],
      stats: "500 Attendees",
      statsSub: "Cairo",
      description: "English description for Rameda annual event.",
      client: "Rameda Pharmaceuticals",
      specs: ["3D Stage"],
      status: "published",
      order: 1,
      featured: true,
      translations: {
        ar: {
          title: "فعالية شركة راميدا للأدوية",
          description: "تنظيم متكامل لفعالية راميدا السنوية.",
        },
      },
    };

    const enProj = resolveLocalizedProject(baseProject, "en");
    assert.equal(enProj.title, "Rameda Event");

    const arProj = resolveLocalizedProject(baseProject, "ar");
    assert.equal(arProj.title, "فعالية شركة راميدا للأدوية");
    assert.equal(arProj.description, "تنظيم متكامل لفعالية راميدا السنوية.");
    assert.equal(arProj.client, "Rameda Pharmaceuticals");

    const baseCompany = {
      ...DEFAULT_COMPANIES[0],
      translations: {
        ar: {
          name: "راميدا للأدوية",
          highlight: "الملتقى السنوي",
        },
      },
    };
    const arComp = resolveLocalizedCompany(baseCompany, "ar");
    assert.equal(arComp.name, "راميدا للأدوية");
    assert.equal(arComp.highlight, "الملتقى السنوي");
    assert.equal(resolveLocalizedCompany(baseCompany, "en").name, baseCompany.name);
  });

  it("3. normalizes Arabic 8-section defaults and keeps EN/AR CMS mutations & rollback isolated", async () => {
    const arNormalized = normalizeSiteContent({}, "ar");
    assert.equal(arNormalized.manifesto.headlinePart1, DEFAULT_SITE_CONTENT_AR.manifesto.headlinePart1);
    assert.equal(arNormalized.services.disciplines.length, 12);
    assert.equal(arNormalized.layout.navHomeLabel, "الرئيسية");

    const repo = createInMemoryContentRepository();
    const initialBoth = await fetchBilingualSiteContent(repo);
    assert.equal(initialBoth.ok, true);
    if (!initialBoth.ok) return;
    assert.equal(initialBoth.data.en.manifesto.headlinePart1, DEFAULT_SITE_CONTENT.manifesto.headlinePart1);
    assert.equal(initialBoth.data.ar.manifesto.headlinePart1, DEFAULT_SITE_CONTENT_AR.manifesto.headlinePart1);

    const updatedHeroAr = {
      ...DEFAULT_SITE_CONTENT_AR.manifesto,
      headlinePart1: "نصنع تجارب استثنائية",
      headlinePart2: "تبقى في الذاكرة.",
    };

    const updateRes = await updateContentSection(
      "manifesto",
      updatedHeroAr,
      repo,
      "admin@art-work.agency",
      "ar"
    );
    assert.equal(updateRes.ok, true);
    if (!updateRes.ok) return;
    assert.equal(updateRes.data.locale, "ar");

    // Verify EN remains untouched while AR reflects the update
    const enAfter = await fetchSiteContent(repo, "en");
    const arAfter = await fetchSiteContent(repo, "ar");
    assert.ok(enAfter.ok && arAfter.ok);
    if (enAfter.ok && arAfter.ok) {
      assert.equal(enAfter.data.manifesto.headlinePart1, DEFAULT_SITE_CONTENT.manifesto.headlinePart1);
      assert.equal(arAfter.data.manifesto.headlinePart1, "نصنع تجارب استثنائية");
    }

    // Verify rollback restores only the Arabic section snapshot
    const revs = await repo.listRevisions(5);
    assert.ok(revs.length >= 1);
    assert.equal(revs[0].locale, "ar");
    const rbRes = await rollbackContent(revs[0].id, repo, "admin@art-work.agency");
    assert.equal(rbRes.ok, true);
    const arRolledBack = await fetchSiteContent(repo, "ar");
    assert.ok(arRolledBack.ok);
    if (arRolledBack.ok) {
      assert.equal(arRolledBack.data.manifesto.headlinePart1, DEFAULT_SITE_CONTENT_AR.manifesto.headlinePart1);
    }
  });

  it("4. validates bilingual translations inside ProjectInputSchema and CompanyRecordSchema", () => {
    const proj = ProjectInputSchema.safeParse({
      slug: "bilingual-booth-2026",
      title: "Custom Exhibition Booth",
      client: "Rameda",
      category: "booths",
      year: 2026,
      description: "Architectural custom pavilion engineered for maximum visitor flow.",
      cover_image_url: "/assets/images/gallery/project_06_sensory_expo.jpg",
      cover_image_alt: "Custom Booth",
      translations: {
        ar: {
          title: "جناح معرض مخصص",
          client: "راميدا للأدوية",
          specs: ["تصميم ثلاثي الأبعاد", "تشطيب فاخر"],
        },
      },
    });
    assert.equal(proj.success, true);

    const comp = CompanyRecordSchema.safeParse({
      slug: "rameda-pharma",
      name: "Rameda Pharma",
      logo_url: "https://example.com/logo.png",
      translations: {
        ar: {
          name: "راميدا للأدوية",
          highlight: "شريك نجاح",
        },
      },
    });
    assert.equal(comp.success, true);
  });

  it("5. wires LanguageToggle, Cairo RTL font rules, and Admin bilingual editors", () => {
    const layoutSrc = fs.readFileSync(
      path.join(rootDir, "apps/artwork-app/src/app/layout.tsx"),
      "utf-8"
    );
    const cssSrc = fs.readFileSync(
      path.join(rootDir, "apps/artwork-app/src/app/globals.css"),
      "utf-8"
    );
    const headerSrc = fs.readFileSync(
      path.join(rootDir, "apps/artwork-app/src/components/home/StudioHeader.tsx"),
      "utf-8"
    );
    const adminContentSrc = fs.readFileSync(
      path.join(rootDir, "apps/admin/src/app/content/page.tsx"),
      "utf-8"
    );
    const projectModalSrc = fs.readFileSync(
      path.join(rootDir, "apps/admin/src/app/projects/components/ProjectFormModal.tsx"),
      "utf-8"
    );
    const companiesSrc = fs.readFileSync(
      path.join(rootDir, "apps/admin/src/app/companies/page.tsx"),
      "utf-8"
    );

    assert.ok(layoutSrc.includes("Cairo("));
    assert.ok(layoutSrc.includes("dir={initialDir}"));
    assert.ok(cssSrc.includes('[dir="rtl"]'));
    assert.ok(cssSrc.includes("letter-spacing: 0 !important"));
    assert.ok(headerSrc.includes("<LanguageToggle />"));
    assert.ok(adminContentSrc.includes("setEditingLocale"));
    assert.ok(projectModalSrc.includes("ProjectArabicFieldsCard"));
    assert.ok(companiesSrc.includes("translations"));
  });

  it("6. wires Gallery project card Copy Link deep-linking and Admin direct number input project ordering", () => {
    const galleryModalSrc = fs.readFileSync(
      path.join(rootDir, "apps/artwork-app/src/components/gallery/GalleryProjectModal.tsx"),
      "utf-8"
    );
    const galleryPageSrc = fs.readFileSync(
      path.join(rootDir, "apps/artwork-app/src/app/gallery/page.tsx"),
      "utf-8"
    );
    const projectsTableSrc = fs.readFileSync(
      path.join(rootDir, "apps/admin/src/app/projects/components/ProjectsTable.tsx"),
      "utf-8"
    );
    const projectsHookSrc = fs.readFileSync(
      path.join(rootDir, "apps/admin/src/app/projects/hooks/useProjectsManager.ts"),
      "utf-8"
    );

    assert.ok(galleryModalSrc.includes("handleCopyProjectLink"));
    assert.ok(galleryModalSrc.includes("/gallery?project="));
    assert.ok(galleryModalSrc.includes("dict.gallery.copyLink"));
    assert.ok(galleryModalSrc.includes("dict.gallery.linkCopied"));
    assert.ok(galleryPageSrc.includes('.get("project")'));
    assert.ok(galleryPageSrc.includes('searchParams.set("project"'));
    assert.ok(galleryPageSrc.includes('shareUrl.searchParams.set("category"'));
    assert.ok(galleryPageSrc.includes('.get("category")'));
    assert.ok(projectsTableSrc.includes('type="number"'));
    assert.ok(projectsTableSrc.includes("ProjectOrderNumberInput"));
    assert.ok(projectsHookSrc.includes("handleSetOrder"));
  });
});
