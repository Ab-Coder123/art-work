import { test, expect } from '@playwright/test';
import { ADMIN_URL } from '../playwright.e2e.config';

test.describe('Dashboard (admin) — security & auth events in Edge', () => {
  test('unauthenticated visit to protected pages redirects to /login with redirect param', async ({ page }) => {
    for (const route of ['/', '/projects', '/content']) {
      await page.goto(`${ADMIN_URL}${route}`);
      await expect(page).toHaveURL(new RegExp(`/login\\?redirect=${encodeURIComponent(route).replace(/%/g, '%')}`));
    }
  });

  test('login page renders the Studio OS gateway form', async ({ page }) => {
    await page.goto(`${ADMIN_URL}/login`);
    await expect(page.getByRole('heading', { name: /Art Work OS/i })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign|login|access|enter/i }).first()).toBeVisible();
  });

  test('GET /api/auth/csrf issues token and matching readable cookie', async ({ request }) => {
    const res = await request.get(`${ADMIN_URL}/api/auth/csrf`);
    expect(res.status()).toBe(200);
    const { csrfToken } = await res.json();
    expect(csrfToken).toMatch(/^[a-f0-9]{64}$/);
    expect(res.headers()['set-cookie']).toContain(`csrf-token=${csrfToken}`);
  });

  test('GET /api/auth/session without a session returns 401', async ({ request }) => {
    const res = await request.get(`${ADMIN_URL}/api/auth/session`);
    expect(res.status()).toBe(401);
    expect((await res.json()).authenticated).toBe(false);
  });

  test('mutating requests without CSRF header are blocked by middleware (403)', async ({ request }) => {
    for (const path of ['/api/auth/logout', '/api/media/youtube/resolve', '/api/projects']) {
      const res = await request.post(`${ADMIN_URL}${path}`, { data: {} });
      expect(res.status(), path).toBe(403);
    }
    const putRes = await request.put(`${ADMIN_URL}/api/projects/neon-horizon`, { data: {} });
    expect(putRes.status()).toBe(403);
    const delRes = await request.delete(`${ADMIN_URL}/api/projects/neon-horizon`);
    expect(delRes.status()).toBe(403);
    const patchRes = await request.patch(`${ADMIN_URL}/api/projects/reorder`, { data: {} });
    expect(patchRes.status()).toBe(403);
  });

  test('mismatched CSRF header vs cookie is rejected (403)', async ({ request }) => {
    const res = await request.post(`${ADMIN_URL}/api/auth/logout`, {
      headers: { 'x-csrf-token': 'a'.repeat(64), cookie: `csrf-token=${'b'.repeat(64)}` },
      data: {},
    });
    expect(res.status()).toBe(403);
  });

  test('valid CSRF but no admin session cannot use admin endpoints (401)', async ({ request }) => {
    const token = (await (await request.get(`${ADMIN_URL}/api/auth/csrf`)).json()).csrfToken as string;
    const headers = { 'x-csrf-token': token, cookie: `csrf-token=${token}` };

    const ytRes = await request.post(`${ADMIN_URL}/api/media/youtube/resolve`, {
      headers,
      data: { input: 'https://youtu.be/dQw4w9WgXcQ' },
    });
    expect(ytRes.status()).toBe(401);

    const listRes = await request.get(`${ADMIN_URL}/api/projects`);
    expect(listRes.status()).toBe(401);

    const createRes = await request.post(`${ADMIN_URL}/api/projects`, {
      headers,
      data: { title: 'Unauthorized Project' },
    });
    expect(createRes.status()).toBe(401);
  });

  test('login UI: invalid credentials show an error and stay on /login (live Supabase)', async ({ page }) => {
    await page.goto(`${ADMIN_URL}/login`);
    await page.locator('input[type="email"]').fill('nobody@example.com');
    await page.locator('input[type="password"]').fill('definitely-wrong-password');
    await page.locator('form button[type="submit"]').click();
    await expect(page.locator('form').locator('xpath=..').getByText(/invalid|failed|incorrect|credentials/i).first()).toBeVisible({ timeout: 20000 });
    await expect(page).toHaveURL(/\/login/);
    const cookies = await page.context().cookies();
    expect(cookies.find((c) => c.name === 'sb-access-token')).toBeUndefined();
  });
});
