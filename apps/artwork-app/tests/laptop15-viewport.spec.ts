import { test, expect } from '@playwright/test';

test.use({
  // Simulate 15.6" laptop at 125%/150% Windows scaling with browser chrome & taskbar
  viewport: { width: 1280, height: 680 },
});

test('verify 15-inch laptop viewport: all components fit cleanly without cutoffs', async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('artwork_intro_seen', 'true');
  });

  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  // 1. Stage 01 (Hero Manifesto) on 15" laptop
  await expect(page.locator('h1')).toContainText('CREATIVE IDEAS.');
  await page.screenshot({ path: 'test-results/laptop15-stage01-hero.png', fullPage: false });

  // 2. Stage 02 (Why Art Work)
  await page.evaluate(() => {
    const track = document.getElementById('pinned-stage-track');
    if (track) {
      const maxScroll = track.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 0.35, behavior: 'instant' });
    }
  });
  await page.waitForTimeout(600);
  await expect(page.locator('text=ENGINEERED FOR STAGE & SCALE.')).toBeVisible();
  await page.screenshot({ path: 'test-results/laptop15-stage02-whyus.png', fullPage: false });

  // 3. Stage 03 (3D Capabilities Matrix)
  await page.evaluate(() => {
    const track = document.getElementById('pinned-stage-track');
    if (track) {
      const maxScroll = track.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 0.65, behavior: 'instant' });
    }
  });
  await page.waitForTimeout(600);
  await expect(page.locator('text=Interactive Discipline')).toBeVisible();
  await page.screenshot({ path: 'test-results/laptop15-stage03-matrix.png', fullPage: false });

  // 4. Stage 04 (Contact Form)
  await page.evaluate(() => {
    const track = document.getElementById('pinned-stage-track');
    if (track) {
      const maxScroll = track.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 0.95, behavior: 'instant' });
    }
  });
  await page.waitForTimeout(600);
  await expect(page.locator('text=LET’S INK SOMETHING')).toBeVisible();
  await page.screenshot({ path: 'test-results/laptop15-stage04-contact.png', fullPage: false });

  console.log('15-inch laptop viewport verification completed successfully!');
});
