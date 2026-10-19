import { test } from '@playwright/test';

test('verify separate /why-us and / home pages', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  // 1. Visit /why-us directly
  await page.goto('http://localhost:3000/why-us');
  await page.waitForSelector('text=WHY', { timeout: 10000 });
  await page.waitForSelector('text=US?', { timeout: 10000 });
  await page.waitForTimeout(1000);

  // Capture /why-us page screenshot
  await page.screenshot({ path: 'tests/screenshots/page_why_us_separate.png', fullPage: true });

  // 2. Visit / home page
  await page.goto('http://localhost:3000');
  const skipButton = page.getByRole('button', { name: /skip/i });
  try {
    if (await skipButton.isVisible({ timeout: 2000 })) {
      await skipButton.click({ force: true, timeout: 2000 });
    }
  } catch {
    // Intro may have auto-completed
  }

  await page.waitForSelector('text=CREATIVE IDEAS.', { timeout: 10000 });
  await page.waitForTimeout(1000);

  // Capture home page screenshot
  await page.screenshot({ path: 'tests/screenshots/page_home_separate.png', fullPage: true });
});
