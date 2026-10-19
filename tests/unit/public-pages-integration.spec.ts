import { test, expect } from '@playwright/test';
import {
  getSiteContent,
  updateSiteContent,
  getProjects,
  createProject,
  updateProject,
  resetToSeed,
} from '../../src/lib/contentStore';
import { ProjectCategory } from '../../src/types/content';

test.describe('Unit & Integration: Public Pages Dynamic Content Consumption (Phase 2)', () => {
  test.beforeEach(async () => {
    await resetToSeed();
  });

  test.afterAll(async () => {
    await resetToSeed();
  });

  test('Home Page data contract: provides valid manifesto, whyUsTeaser, and contact sections', async () => {
    const content = await getSiteContent();

    // Manifesto props contract
    expect(content.manifesto).toBeDefined();
    expect(content.manifesto.headlinePart1).toBe('CREATIVE IDEAS.');
    expect(content.manifesto.headlinePart2).toBe('REAL IMPACT.');
    expect(content.manifesto.introParagraph).toBeTruthy();
    expect(content.manifesto.metrics.length).toBeGreaterThanOrEqual(3);
    content.manifesto.metrics.forEach((metric) => {
      expect(metric.num).toBeTruthy();
      expect(metric.label).toBeTruthy();
    });

    // Why Us Teaser contract
    expect(content.whyUsTeaser).toBeDefined();
    expect(content.whyUsTeaser.eyebrow).toBe('02 WHY ART WORK');
    expect(content.whyUsTeaser.headline).toBeTruthy();
    expect(content.whyUsTeaser.bentoCards).toHaveLength(3);
    content.whyUsTeaser.bentoCards.forEach((card) => {
      expect(card.number).toBeTruthy();
      expect(card.title).toBeTruthy();
      expect(card.badge).toBeTruthy();
      expect(card.description).toBeTruthy();
    });
    expect(content.whyUsTeaser.blueprint).toBeDefined();
    expect(content.whyUsTeaser.blueprint.title).toBeTruthy();
    expect(content.whyUsTeaser.blueprint.image).toContain('.png');

    // Contact props contract
    expect(content.contact).toBeDefined();
    expect(content.contact.headline).toBeTruthy();
    expect(content.contact.email).toContain('@');
    expect(content.contact.formFields.length).toBeGreaterThanOrEqual(4);
  });

  test('Why-Us Page data contract: provides hero typography, badges, presentation, metrics, doodle stickers', async () => {
    const content = await getSiteContent();
    const whyUs = content.whyUsPage;

    expect(whyUs).toBeDefined();
    expect(whyUs.heroHeadlineRow1).toBe('WHY');
    expect(whyUs.heroHeadlineRow2).toBe('US?');
    expect(whyUs.sceneBadge).toBeTruthy();
    expect(whyUs.sceneTitle).toBeTruthy();
    expect(whyUs.statusBadge).toBeTruthy();
    expect(whyUs.roiBadge).toBeTruthy();
    expect(whyUs.contentCreationBadge).toBeTruthy();

    // Doodle stickers
    expect(whyUs.doodleStickers.length).toBeGreaterThanOrEqual(4);

    // Presentation brief & schematics
    expect(whyUs.presentationTitle).toBeTruthy();
    expect(whyUs.presentationSubtitle).toBeTruthy();
    expect(whyUs.presentationImage).toContain('.png');

    // Metrics
    expect(whyUs.metrics.length).toBeGreaterThanOrEqual(4);
    whyUs.metrics.forEach((metric) => {
      expect(metric.num).toBeTruthy();
      expect(metric.label).toBeTruthy();
    });
  });

  test('Gallery Page data contract: returns only published projects with required schema and valid categories', async () => {
    const publishedProjects = await getProjects({ status: 'published' });

    expect(publishedProjects.length).toBeGreaterThan(0);

    const validCategories: ProjectCategory[] = [
      'all',
      'stage',
      'booths',
      'conferences',
      'led',
      'branding',
      'tech',
    ];

    publishedProjects.forEach((proj) => {
      expect(proj.id).toBeTruthy();
      expect(proj.title).toBeTruthy();
      expect(proj.status).toBe('published');
      expect(validCategories).toContain(proj.category);
      expect(proj.image).toBeTruthy();
      expect(proj.stamp).toBeTruthy();
      expect(proj.metaBadge).toBeTruthy();
      expect(proj.cadId).toBeTruthy();
      expect(proj.stats).toBeTruthy();
      expect(proj.statsSub).toBeTruthy();
      expect(proj.tags.length).toBeGreaterThanOrEqual(1);
    });
  });

  test('Real-time propagation: updating store dynamically reflects on public page data providers', async () => {
    // 1. Mutate Home Manifesto
    const customHeadline = 'UNCOMPROMISING VISION.';
    await updateSiteContent({
      manifesto: {
        headlinePart1: customHeadline,
        headlinePart2: 'FLAWLESS EXECUTION.',
        introParagraph: 'Updated live from centralized content store.',
        metrics: [
          { num: '500+', label: 'Mega Shows' },
          { num: '99.9%', label: 'Uptime' },
          { num: '10M+', label: 'Audiences' },
        ],
      },
    });

    const updatedHomeContent = await getSiteContent();
    expect(updatedHomeContent.manifesto.headlinePart1).toBe(customHeadline);
    expect(updatedHomeContent.manifesto.metrics[0].num).toBe('500+');

    // 2. Add new project and verify it appears in Gallery Page provider
    const newProj = await createProject({
      title: 'Neon Oasis Festival 2026',
      stamp: 'STAMP_PASS: FEST_26',
      metaBadge: 'SUMMER 2026',
      cadId: 'CAD_ID: NO_2026',
      image: '/assets/images/gallery/project_oasis.jpg',
      altText: 'Neon Oasis Kinetic Stage',
      category: 'stage',
      tags: ['Stage Design', 'Mega Truss', 'Laser Scenography'],
      stats: '⚡ 80,000 Fans / Night',
      statsSub: '1,400 sqm LED Wall',
      description: 'Dynamic multi-tiered kinetic stage for 80,000 festival attendees.',
      client: 'Soundstorm Entertainment',
      specs: ['Custom Truss Grid', 'Notch Shaders'],
      status: 'published',
      order: 10,
    });

    const updatedGalleryProjects = await getProjects({ status: 'published' });
    const foundNewProj = updatedGalleryProjects.find((p) => p.id === newProj.id);
    expect(foundNewProj).toBeDefined();
    expect(foundNewProj?.title).toBe('Neon Oasis Festival 2026');

    // 3. Unpublish the project (e.g. via dashboard toggle) and verify gallery no longer displays it
    await updateProject(newProj.id, { status: 'draft' });
    const afterUnpublish = await getProjects({ status: 'published' });
    expect(afterUnpublish.find((p) => p.id === newProj.id)).toBeUndefined();
  });
});
