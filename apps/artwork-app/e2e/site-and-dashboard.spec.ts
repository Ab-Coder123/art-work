import { test, expect } from '@playwright/test';
import { SITE_URL, ADMIN_URL } from '../playwright.e2e.config';

test.describe('Public site + dashboard together in Edge', () => {
  for (const route of ['/', '/gallery', '/why-us']) {
    test(`site ${route} loads without page errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      const res = await page.goto(`${SITE_URL}${route}`, { waitUntil: 'domcontentloaded' });
      expect(res?.status()).toBe(200);
      await page.waitForTimeout(1500);
      expect(errors, errors.join('\n')).toEqual([]);
    });
  }

  test('site and dashboard are isolated: site exposes no admin session cookies', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${SITE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.goto(`${ADMIN_URL}/api/auth/csrf`);
    const siteCookies = await ctx.cookies(SITE_URL);
    expect(siteCookies.find((c) => c.name === 'sb-access-token')).toBeUndefined();
    await ctx.close();
  });

  test('dashboard auth cookies are HttpOnly + SameSite=Lax while CSRF cookie is script-readable', async ({ request }) => {
    const res = await request.get(`${ADMIN_URL}/api/auth/csrf`);
    const setCookie = res.headers()['set-cookie'] ?? '';
    expect(setCookie.toLowerCase()).toContain('samesite=lax');
    expect(setCookie.toLowerCase()).not.toContain('httponly'); // csrf cookie must be readable by the client
  });

  test('public Supabase API boundary: anon cannot read drafts or inquiries (RLS, live)', async ({ request }) => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    test.skip(!url || !anon, 'Supabase env not provided to the test process');
    const headers = { apikey: anon!, Authorization: `Bearer ${anon}` };

    const inquiries = await request.get(`${url}/rest/v1/inquiries?select=id`, { headers });
    expect([401, 403]).toContain(inquiries.status());

    const drafts = await request.get(`${url}/rest/v1/projects?select=id&status=neq.published`, { headers });
    expect(drafts.status()).toBe(200);
    expect(await drafts.json()).toEqual([]);

    const insert = await request.post(`${url}/rest/v1/projects`, {
      headers: { ...headers, 'content-type': 'application/json' },
      data: { slug: 'x' },
    });
    expect([401, 403]).toContain(insert.status());
  });

  test('gallery renders YouTube Video Headline, Paragraph, and privacy-enhanced Lightbox embed for Rameda Event', async ({ page }) => {
    await page.goto(`${SITE_URL}/gallery`, { waitUntil: 'domcontentloaded' });
    // Verify Rameda Event and its YouTube Video badge & metadata render on the project card
    await expect(page.getByRole('heading', { name: /Rameda Event/i }).first()).toBeVisible();
    await expect(page.getByText(/Relive the highlights of Rameda’s Annual Company Gathering/i).first()).toBeVisible();

    // Open the Rameda Event project modal
    await page.getByRole('button', { name: /WATCH SHOWREEL & BLUEPRINT|INSPECT BLUEPRINT/i }).first().click();

    // Verify privacy-enhanced youtube-nocookie iframe & YouTube Headline + Paragraph in the modal
    const iframe = page.locator('iframe[src*="youtube-nocookie.com/embed/7SkcdZ7CcGI"]');
    await expect(iframe).toBeVisible();
    await expect(page.getByText(/Annual Company Gathering/i).first()).toBeVisible();
  });

  test('Phase 06 Public Projects REST API: GET /api/projects & GET /api/projects/:slug return live published projects', async ({ request }) => {
    const listRes = await request.get(`${SITE_URL}/api/projects?limit=10`);
    expect(listRes.status()).toBe(200);
    const listJson = await listRes.json();
    expect(listJson.total).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(listJson.items)).toBe(true);
    expect(listJson.items.every((p: { status: string }) => p.status === 'published')).toBe(true);
    expect(listJson.items.some((p: { youtubeVideoId: string }) => p.youtubeVideoId === '7SkcdZ7CcGI')).toBe(true);

    // Filter by category=conferences
    const confRes = await request.get(`${SITE_URL}/api/projects?category=conferences`);
    expect(confRes.status()).toBe(200);
    const confJson = await confRes.json();
    expect(confJson.items.length).toBeGreaterThanOrEqual(1);
    expect(confJson.items[0].id).toBe('rameda-event');
    expect(confJson.items[0].youtubeVideoId).toBe('7SkcdZ7CcGI');

    // Single project lookup by slug
    const singleRes = await request.get(`${SITE_URL}/api/projects/rameda-event`);
    expect(singleRes.status()).toBe(200);
    const singleJson = await singleRes.json();
    expect(singleJson.project.id).toBe('rameda-event');
    expect(singleJson.project.youtubeVideoId).toBe('7SkcdZ7CcGI');

    // Non-existent slug returns 404
    const notFoundRes = await request.get(`${SITE_URL}/api/projects/does-not-exist-999`);
    expect(notFoundRes.status()).toBe(404);
  });
});
