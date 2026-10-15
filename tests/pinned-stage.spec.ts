import { test, expect } from '@playwright/test';

test.describe('Phase 03: Pinned Scrollytelling & Viewport Theater Engine', () => {
  test('should pin the viewport and morph scenes in place as user scrolls', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Skip intro loader to get to live stage
    const skipButton = page.getByRole('button', { name: /skip/i });
    if (await skipButton.isVisible()) {
      await skipButton.click();
      await page.waitForTimeout(800);
    }

    // Verify initial scene is Scene 01 (Hero Manifesto)
    const headerTitle = page.locator('h1');
    await expect(headerTitle).toContainText('CREATIVE IDEAS.');
    await expect(headerTitle).toContainText('REAL IMPACT.');

    // Scroll down into Scene 02 (Why Us)
    await page.evaluate(() => {
      window.scrollTo({ top: 1200, behavior: 'instant' });
      window.dispatchEvent(new Event('scroll'));
    });
    await page.waitForTimeout(1000);

    // Verify Scene has transformed in place into Scene 02 (WHY US?)
    await expect(headerTitle).toContainText('WHY');
    await expect(headerTitle).toContainText('US?');

    // Scroll down further into Scene 03 (Capabilities)
    await page.evaluate(() => {
      window.scrollTo({ top: 2500, behavior: 'instant' });
      window.dispatchEvent(new Event('scroll'));
    });
    await page.waitForTimeout(1000);

    // Verify Scene has transformed into Scene 03 (BUILT FOR SCALE)
    await expect(headerTitle).toContainText('BUILT FOR');
    await expect(headerTitle).toContainText('SCALE.');

    // Capture screenshot of the in-place transformed scene
    await page.screenshot({ path: 'tests/screenshots/phase03_pinned_morph.png' });
  });
});
