import { test, expect } from '@playwright/test';

interface PerformanceMetrics {
  route: string;
  dnsTime: number;
  ttfb: number;
  domContentLoaded: number;
  totalLoadTime: number;
  domNodeCount: number;
  fcp?: number;
  lcp?: number;
  cls?: number;
  jsHeapSizeMB?: number;
}

test.describe('Performance & Web Application Verification (/webapp-testing)', () => {
  // Pre-seed sessionStorage so tests directly benchmark the live application pages
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('artwork_intro_seen', 'true');
    });
  });

  const routes = [
    { name: 'Home (Scrollytelling Stage)', path: '/' },
    { name: 'Gallery (Project Archive Vault)', path: '/gallery' },
    { name: 'Why Us (Agency Proposition)', path: '/why-us' },
  ];

  for (const { name, path } of routes) {
    test(`Performance Benchmarking: ${name} (${path})`, async ({ page }) => {
      // Collect console errors
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // Collect failed network requests
      const failedRequests: string[] = [];
      page.on('requestfailed', (req) => {
        failedRequests.push(`${req.method()} ${req.url()}: ${req.failure()?.errorText}`);
      });

      // Navigate and wait for DOM content
      const navigationStart = Date.now();
      await page.goto(path, { waitUntil: 'load' });
      const navigationEnd = Date.now();

      await page.waitForTimeout(500);

      // Extract Navigation and Performance Metrics from the browser
      const metrics: PerformanceMetrics = await page.evaluate((currentRoute) => {
        const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        const nav = navEntries && navEntries.length > 0 ? navEntries[0] : null;

        const paintEntries = performance.getEntriesByType('paint');
        const fcpEntry = paintEntries.find((entry) => entry.name === 'first-contentful-paint');

        const perfMemory = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;

        const domNodes = document.querySelectorAll('*').length;

        return {
          route: currentRoute,
          dnsTime: nav ? Math.round(nav.domainLookupEnd - nav.domainLookupStart) : 0,
          ttfb: nav ? Math.round(nav.responseStart - nav.requestStart) : 0,
          domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : 0,
          totalLoadTime: nav ? Math.round(nav.loadEventEnd - nav.startTime) : 0,
          domNodeCount: domNodes,
          fcp: fcpEntry ? Math.round(fcpEntry.startTime) : undefined,
          jsHeapSizeMB: perfMemory ? Number((perfMemory.usedJSHeapSize / (1024 * 1024)).toFixed(2)) : undefined,
        };
      }, path);

      console.log(`\n=== PERFORMANCE AUDIT: ${name} ===`);
      console.log(`Route: ${metrics.route}`);
      console.log(`TTFB: ${metrics.ttfb} ms`);
      console.log(`DOM Content Loaded: ${metrics.domContentLoaded} ms`);
      console.log(`Total Page Load: ${metrics.totalLoadTime || (navigationEnd - navigationStart)} ms`);
      console.log(`DOM Node Count: ${metrics.domNodeCount}`);
      if (metrics.fcp) console.log(`First Contentful Paint (FCP): ${metrics.fcp} ms`);
      if (metrics.jsHeapSizeMB) console.log(`JS Heap Size: ${metrics.jsHeapSizeMB} MB`);

      // Performance Assertions
      expect(metrics.domNodeCount).toBeGreaterThan(10);
      expect(metrics.domNodeCount).toBeLessThan(3500); // Guard against excessive DOM nodes
      expect(failedRequests.filter((r) => !r.includes('analytics'))).toHaveLength(0);

      // Verify no horizontal scrollbar overflow
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);

      // Capture screenshot
      const safeName = path.replace(/\//g, '_') || 'home';
      await page.screenshot({ path: `tests/screenshots/perf_${safeName}.png` });
    });
  }

  test('Responsive Layout & Logo Visibility across Viewports', async ({ page }) => {
    const viewports = [
      { name: 'Mobile_iPhone14', width: 390, height: 844 },
      { name: 'Tablet_iPadAir', width: 820, height: 1180 },
      { name: 'Desktop_1080p', width: 1440, height: 900 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(600);

      // Verify brand logo container is rendered and visible
      const logo = page.locator('img[alt="Art Work Logo"]').first();
      await expect(logo).toBeVisible({ timeout: 5000 });

      // Check bounding box
      const box = await logo.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }

      // Capture screenshot for visual inspection
      await page.screenshot({ path: `tests/screenshots/viewport_${vp.name}.png` });
    }
  });

  test('Theme Switcher Performance (Light <-> Dark transition)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    const themeToggleBtn = page.getByRole('button', { name: /mode/i }).first();
    await expect(themeToggleBtn).toBeVisible({ timeout: 5000 });

    // Measure toggle switch time
    const toggleStart = Date.now();
    await themeToggleBtn.click();
    await page.waitForTimeout(300);
    const toggleDuration = Date.now() - toggleStart;

    console.log(`Theme switch transition time: ${toggleDuration} ms`);
    expect(toggleDuration).toBeLessThan(1000); // Smooth switch under 1s

    // Check html classes
    const htmlClasses = await page.locator('html').getAttribute('class');
    expect(typeof htmlClasses).toBe('string');

    // Toggle back
    await themeToggleBtn.click();
    await page.waitForTimeout(300);
  });

  test('Scrollytelling Frame Rate & Scroll Interaction', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(600);

    // Measure scroll performance through 4 stages
    const scrollPerf = await page.evaluate(async () => {
      const scrollStep = 300;
      const totalHeight = 3000;
      let frames = 0;
      const start = performance.now();

      const animId = requestAnimationFrame(function loop() {
        frames++;
        requestAnimationFrame(loop);
      });

      for (let y = 0; y <= totalHeight; y += scrollStep) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 60));
      }

      cancelAnimationFrame(animId);
      const duration = (performance.now() - start) / 1000;
      return {
        fps: Math.round(frames / duration),
        durationSec: Number(duration.toFixed(2)),
      };
    });

    console.log(`\n=== SCROLL ANIMATION AUDIT ===`);
    console.log(`Average FPS during scroll: ${scrollPerf.fps} FPS`);
    console.log(`Scroll Test Duration: ${scrollPerf.durationSec}s`);

    expect(scrollPerf.fps).toBeGreaterThanOrEqual(10); // Software headless rendering threshold
  });
});
