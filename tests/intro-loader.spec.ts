import { test, expect } from '@playwright/test';

test.describe('Phase 02: Cinematic Intro Loader & Splash Screen', () => {
  test('should display intro loader video and allow skipping to live canvas', async ({ page }) => {
    // Navigate to local dev server (port 3001)
    await page.goto('http://localhost:3000');

    // Verify video element exists and is playing
    const introVideo = page.locator('video');
    await expect(introVideo).toBeVisible();

    // Verify accessible Skip button is rendered
    const skipButton = page.getByRole('button', { name: /skip/i });
    await expect(skipButton).toBeVisible();

    // Capture screenshot of the playing video loader
    await page.screenshot({ path: 'tests/screenshots/phase02_intro_playing.png' });

    // Click Skip button to trigger smooth exit transition
    await skipButton.click();

    // Wait for the exit animation transition (700ms)
    await page.waitForTimeout(1000);

    // Verify the intro loader is unmounted / hidden
    await expect(page.locator('role=dialog[name="Welcome cinematic presentation"]')).toHaveCount(0);

    // Verify the hero main stage is revealed with correct typography
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toContainText('CREATIVE IDEAS.');
    await expect(heroTitle).toContainText('REAL IMPACT.');

    // Capture screenshot of the revealed hero stage
    await page.screenshot({ path: 'tests/screenshots/phase02_hero_revealed.png' });
  });

  test('should skip intro when pressing Escape key', async ({ page }) => {
    await page.goto('http://localhost:3000');
    // Clear session storage to test fresh arrival
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();

    const introDialog = page.locator('role=dialog');
    await expect(introDialog).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // Dialog dismissed
    await expect(introDialog).toHaveCount(0);
  });
});
