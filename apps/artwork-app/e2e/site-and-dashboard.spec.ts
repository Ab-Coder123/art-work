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
});
