import { test, expect } from '@playwright/test';

test('verify Phase 06: 3D Capabilities Matrix and Toolkit Inspector', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000');

  // Skip intro loader
  const skipButton = page.getByRole('button', { name: /skip/i });
  try {
    if (await skipButton.isVisible({ timeout: 2000 })) {
      await skipButton.click({ force: true, timeout: 2000 });
    }
  } catch {
    // Intro may have auto-completed
  }

  // Scroll to Stage 03
  const stage03 = page.locator('#stage-03');
  await stage03.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Verify filter tabs are visible
  await expect(page.getByRole('button', { name: 'ALL DISCIPLINES' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'ARENA & STAGE' })).toBeVisible();

  // Capture Stage 03 3D Matrix
  await page.screenshot({ path: 'tests/screenshots/phase06_stage03_matrix.png' });

  // Click on "MOTION DESIGNER" card to open Toolkit Modal
  const motionCard = page.locator('text=MOTION DESIGNER').first();
  await motionCard.click();
  await page.waitForTimeout(600);

  // Verify modal is open
  await expect(page.getByText('Production Deliverables & Formats')).toBeVisible();

  // Capture open modal screenshot
  await page.screenshot({ path: 'tests/screenshots/phase06_modal_inspector.png' });

  // Close modal
  const closeBtn = page.getByRole('button', { name: /close dialog/i });
  await closeBtn.click();
  await page.waitForTimeout(500);

  // Click filter tab "ARENA & STAGE"
  const stageFilter = page.getByRole('button', { name: 'ARENA & STAGE' });
  await stageFilter.click();
  await page.waitForTimeout(500);

  // Capture filtered state screenshot
  await page.screenshot({ path: 'tests/screenshots/phase06_filtered_matrix.png' });
});
