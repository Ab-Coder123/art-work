import { test, expect } from '@playwright/test';

test('verify Pinned Viewport Scrollytelling Stage morphing', async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('artwork_intro_seen', 'true');
  });

  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  // 1. Stage 01: Hero Manifesto in fixed viewport
  await expect(page.locator('h1')).toContainText('CREATIVE IDEAS.');
  await page.screenshot({ path: 'test-results/pinned-stage01-hero.png', fullPage: false });

  // 2. Scroll down to trigger Stage 02 in the same pinned viewport
  await page.evaluate(() => {
    const track = document.getElementById('pinned-stage-track');
    if (track) {
      const maxScroll = track.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 0.35, behavior: 'instant' });
    }
  });
  await page.waitForTimeout(600);
  await expect(page.locator('text=ENGINEERED FOR STAGE & SCALE.')).toBeVisible();
  await page.screenshot({ path: 'test-results/pinned-stage02-whyus.png', fullPage: false });

  // 3. Scroll down to trigger Stage 03 (Capabilities Matrix)
  await page.evaluate(() => {
    const track = document.getElementById('pinned-stage-track');
    if (track) {
      const maxScroll = track.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 0.65, behavior: 'instant' });
    }
  });
  await page.waitForTimeout(600);
  await expect(page.locator('text=Interactive Discipline')).toBeVisible();
  await page.screenshot({ path: 'test-results/pinned-stage03-matrix.png', fullPage: false });

  // 4. Scroll down to trigger Stage 04 (Contact Form)
  await page.evaluate(() => {
    const track = document.getElementById('pinned-stage-track');
    if (track) {
      const maxScroll = track.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 0.95, behavior: 'instant' });
    }
  });
  await page.waitForTimeout(600);
  await expect(page.locator('text=LET’S INK SOMETHING')).toBeVisible();
  await page.screenshot({ path: 'test-results/pinned-stage04-contact.png', fullPage: false });

  console.log('Pinned Scrollytelling verification completed successfully!');
});
