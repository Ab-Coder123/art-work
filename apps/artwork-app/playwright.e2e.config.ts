import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

// Load only the public Supabase vars from the (git-ignored) admin env for the RLS boundary test.
try {
  const envFile = fs.readFileSync(path.resolve(__dirname, '../admin/.env.local'), 'utf8');
  for (const line of envFile.split(/\r?\n/)) {
    const m = line.match(/^(NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY)="?([^"]*)"?$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {
  /* env file optional */
}

/**
 * Cross-app E2E (Microsoft Edge): public site + admin dashboard.
 * Playwright owns the server lifecycle (started for the run, stopped after).
 * Uses dedicated ports (never 3000): site 3105, dashboard 3101.
 * Requires production builds (`pnpm run build`) to exist.
 */
export const SITE_URL = 'http://localhost:3105';
export const ADMIN_URL = 'http://localhost:3101';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 45000,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'test-report-e2e' }]],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'msedge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
  ],
  webServer: [
    {
      command: 'npx next start -p 3105',
      cwd: '.',
      url: SITE_URL,
      reuseExistingServer: false,
      timeout: 60000,
    },
    {
      command: 'npx next start -p 3101',
      cwd: '../admin',
      url: `${ADMIN_URL}/login`,
      reuseExistingServer: false,
      timeout: 60000,
    },
  ],
});
