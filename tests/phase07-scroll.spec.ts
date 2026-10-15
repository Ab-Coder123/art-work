import { test, expect } from '@playwright/test';

test('verify Phase 07: Kinetic Doodles & Scroll-Activated Cinematic Motion Engine', async ({ page }) => {
  // Set seen flag so we go straight to stage canvas
  await page.addInitScript(() => {
    sessionStorage.setItem('artwork_intro_seen', 'true');
  });

  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  // Verify Kinetic Doodles are mounted
  const plane = page.locator('.animate-plane').first();
  await expect(plane).toBeVisible();

  // Capture Hero Stage initial view
  await page.screenshot({ path: 'test-results/phase07-stage01-hero.png', fullPage: false });

  // Scroll down smoothly to Stage 02 (Why Art Work Bento)
  await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'smooth' }));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'test-results/phase07-stage02-scroll.png', fullPage: false });

  // Scroll down to Stage 03 (3D Matrix)
  await page.evaluate(() => window.scrollTo({ top: 2200, behavior: 'smooth' }));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'test-results/phase07-stage03-matrix.png', fullPage: false });

  // Scroll down to Stage 04 (Contact & Brief)
  await page.evaluate(() => window.scrollTo({ top: 3200, behavior: 'smooth' }));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'test-results/phase07-stage04-contact.png', fullPage: false });

  console.log('Phase 07 visual verification completed successfully!');
});
