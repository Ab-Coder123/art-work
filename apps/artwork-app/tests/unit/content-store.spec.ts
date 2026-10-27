import { test, expect } from '@playwright/test';
import {
  getSiteContent,
  getSiteContentSync,
  updateSiteContent,
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
  resetToSeed,
} from '../../src/lib/contentStore';

test.describe('Unit: Content Store & Data Layer (Phase 1)', () => {
  test.beforeEach(async () => {
    // Restore clean seed state before each test
    await resetToSeed();
  });

  test.afterAll(async () => {
    // Ensure clean state remains after test run completes
    await resetToSeed();
  });

  test('should retrieve valid and complete site content schema', async () => {
    const content = await getSiteContent();

    expect(content).toBeDefined();
    expect(content.version).toBe('1.0.0');

    // Manifesto assertions
    expect(content.manifesto.headlinePart1).toBe('CREATIVE IDEAS.');
    expect(content.manifesto.headlinePart2).toBe('REAL IMPACT.');
    expect(content.manifesto.metrics).toHaveLength(3);
    expect(content.manifesto.metrics[0].num).toBe('450+');

    // Why Us Teaser assertions
    expect(content.whyUsTeaser.eyebrow).toBe('02 WHY ART WORK');
    expect(content.whyUsTeaser.bentoCards).toHaveLength(3);
    expect(content.whyUsTeaser.blueprint.image).toContain('blueprint_stage_scenography.png');

    // Contact assertions
    expect(content.contact.email).toBe('ahmed.artwork2026@gmail.com');
    expect(content.contact.formFields.length).toBeGreaterThanOrEqual(4);

    // Why Us Page assertions
    expect(content.whyUsPage.heroHeadlineRow1).toBe('WHY');
    expect(content.whyUsPage.heroHeadlineRow2).toBe('US?');
  });

  test('should provide synchronous fallback site content', () => {
    const syncContent = getSiteContentSync();
    expect(syncContent).toBeDefined();
    expect(syncContent.manifesto.headlinePart1).toBe('CREATIVE IDEAS.');
  });

  test('should perform atomic partial updates to site content', async () => {
    const original = await getSiteContent();
    const newHeadline = 'REVOLUTIONARY CONCEPTS.';

    const updated = await updateSiteContent({
      manifesto: {
        ...original.manifesto,
        headlinePart1: newHeadline,
      },
    });

    expect(updated.manifesto.headlinePart1).toBe(newHeadline);
    // Sibling fields remain intact
    expect(updated.manifesto.headlinePart2).toBe('REAL IMPACT.');
    expect(updated.manifesto.announcementBadge).toBe(original.manifesto.announcementBadge);

    // Verify persisted across subsequent read
    const refetched = await getSiteContent();
    expect(refetched.manifesto.headlinePart1).toBe(newHeadline);
  });

  test('should retrieve all 6 default gallery projects with strict types', async () => {
    const projects = await getProjects({ status: 'published' });

    expect(projects).toHaveLength(6);
    expect(projects[0].id).toBe('neon-horizon');
    expect(projects[0].category).toBe('stage');
    expect(projects[0].specs.length).toBeGreaterThan(0);
    expect(projects[0].stats).toContain('Fans');
    expect(projects[0].status).toBe('published');

    // Verify ordering sequence (1..6)
    const orders = projects.map((p) => p.order);
    expect(orders).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test('should filter gallery projects by category', async () => {
    const stageProjects = await getProjects({ category: 'stage' });
    expect(stageProjects.length).toBeGreaterThanOrEqual(1);
    expect(stageProjects.every((p) => p.category === 'stage')).toBe(true);

    const confProjects = await getProjects({ category: 'conferences' });
    expect(confProjects.length).toBeGreaterThanOrEqual(1);
    expect(confProjects[0].id).toBe('medtech-summit');
  });

  test('should filter projects by text search query', async () => {
    const searchResults = await getProjects({ query: 'medical' });
    expect(searchResults.length).toBeGreaterThanOrEqual(1);
    expect(searchResults[0].id).toBe('medtech-summit');

    const noResults = await getProjects({ query: 'non-existent-search-term-xyz' });
    expect(noResults).toHaveLength(0);
  });

  test('should support full CRUD lifecycle for gallery projects', async () => {
    // 1. Create
    const newProject = await createProject({
      title: 'HyperDrive Kinetic Tour',
      stamp: 'STAMP: HYPER_26',
      metaBadge: 'NOV 2026',
      cadId: 'CAD: HD_01',
      image: '/assets/images/gallery/project_hyperdrive.jpg',
      altText: 'HyperDrive Kinetic Tour Stage Rig',
      category: 'stage',
      tags: ['Stage, Sound & Lighting', 'Kinetic Automation'],
      stats: '⚡ 75,000 Audience',
      statsSub: 'Automated 12-Axis Rig',
      description: 'Futuristic stadium stage tour with automated kinetic ceiling rings.',
      client: 'HyperDrive Records',
      specs: ['12-Axis Kinetic Hoists', 'Custom DMX Matrix'],
      status: 'published',
    });

    expect(newProject.id).toBe('hyperdrive-kinetic-tour');
    expect(newProject.order).toBe(7);

    // Verify it exists in project list
    const fetched = await getProjectById('hyperdrive-kinetic-tour');
    expect(fetched).not.toBeNull();
    expect(fetched?.title).toBe('HyperDrive Kinetic Tour');

    // 2. Prevent duplicate ID
    await expect(
      createProject({
        id: 'hyperdrive-kinetic-tour',
        title: 'Duplicate',
        stamp: '',
        metaBadge: '',
        cadId: '',
        image: '',
        altText: '',
        category: 'stage',
        tags: [],
        stats: '',
        statsSub: '',
        description: '',
        client: '',
        specs: [],
        status: 'published',
      })
    ).rejects.toThrow(/already exists/i);

    // 3. Update
    const updated = await updateProject('hyperdrive-kinetic-tour', {
      title: 'HyperDrive Kinetic World Tour (Updated)',
      stats: '⚡ 85,000 Audience',
    });
    expect(updated.title).toBe('HyperDrive Kinetic World Tour (Updated)');
    expect(updated.stats).toBe('⚡ 85,000 Audience');

    // 4. Delete
    const deleteResult = await deleteProject('hyperdrive-kinetic-tour');
    expect(deleteResult).toBe(true);

    const afterDelete = await getProjectById('hyperdrive-kinetic-tour');
    expect(afterDelete).toBeNull();

    // Verify order normalization
    const projectsAfterDelete = await getProjects({ status: 'all' });
    expect(projectsAfterDelete).toHaveLength(6);
    expect(projectsAfterDelete.map((p) => p.order)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test('should reorder projects accurately', async () => {
    // Reverse current order
    const reversedIds = [
      'sensory-expo',
      'arena-genesis',
      'prism-brand-suite',
      'cybertruss-pavilion',
      'medtech-summit',
      'neon-horizon',
    ];

    const reordered = await reorderProjects(reversedIds);

    expect(reordered[0].id).toBe('sensory-expo');
    expect(reordered[0].order).toBe(1);
    expect(reordered[5].id).toBe('neon-horizon');
    expect(reordered[5].order).toBe(6);

    // Verify persistence
    const refetched = await getProjects({ status: 'all' });
    expect(refetched[0].id).toBe('sensory-expo');
  });
});
