import { test } from '@playwright/test';

test('capture live stitch page with Phase 05 Why Us', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000');

  // Try clicking skip button or wait for video
  const skipButton = page.getByRole('button', { name: /skip/i });
  try {
    if (await skipButton.isVisible({ timeout: 2000 })) {
      await skipButton.click({ force: true, timeout: 2000 });
    }
  } catch {
    // Intro may have auto-completed
  }

  // Wait until main hero text is visible
  await page.waitForSelector('text=CREATIVE IDEAS.', { timeout: 10000 });
  await page.waitForTimeout(1000);

  // Capture hero
  await page.screenshot({ path: 'tests/screenshots/live_stitch_hero.png' });

  // Scroll to Stage 02: Why Us
  const stage02 = page.locator('#stage-02');
  await stage02.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Capture Stage 02 (Why Us)
  await page.screenshot({ path: 'tests/screenshots/phase05_why_us.png' });

  // Capture Full Page
  await page.screenshot({ path: 'tests/screenshots/live_stitch_ui.png', fullPage: true });
});
