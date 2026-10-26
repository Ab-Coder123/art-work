# Art Work Project Audit Report

- **Audit date:** 2026-10-26
- **Repository snapshot:** `main` at `0f51b86`
- **Review type:** Read-only codebase audit. No application code was changed for this audit.

## Executive Summary

Art Work has a sensible monorepo foundation: the public website and studio dashboard are separate Next.js applications, shared types and database services live in workspace packages, and Supabase provides persistence and row-level security. The repository also contains meaningful API, database, and browser test coverage, plus written architecture and phase plans.

The main concern is the gap between the security and reliability design in the documents and its implementation in a few critical paths. The revalidation webhook has a known fallback secret, company write paths do not consistently enforce editor permissions, company service fallbacks can report successful writes that were only kept in memory, the database reset command can drop the entire public schema, and the current GitHub Actions run failed before migrations and builds were checked. Dependency auditing also reports five production-tree advisories.

**Overall score: 5.6/10.** This is a functional product foundation with a reasonable architecture, but the current security, data-integrity, and CI findings should be resolved before calling it release-ready.

## Scores

| Area | Score | Assessment |
| --- | ---: | --- |
| Coupling | 5.5/10 | Shared packages and separate apps are a good start; duplicated content sources, legacy persistence code, and broad package exports weaken boundaries. |
| Phases | 5/10 | The plans are detailed, but the active integration plan is incomplete and current CI is red. |
| Architecture | 7/10 | The two-app monorepo and Supabase-backed service approach are appropriate; some boundaries are inconsistently enforced. |
| System design | 5/10 | The design includes useful security layers, but permission, cache invalidation, transaction, rate-limit, and operational safeguards have gaps. |
| Clean code | 5.5/10 | There are useful schemas, services, and tests, but very large client pages and duplicated/legacy implementations make changes harder to maintain. |
| **Overall** | **5.6/10** | **Good foundation; security and release-readiness need focused work.** |

Scores are a qualitative engineering assessment for this repository snapshot, not a formal certification.

## Project Overview

This is a pnpm/Turborepo monorepo containing:

- `apps/artwork-app`: public marketing website, public API routes, contact submission, gallery, company showcase, and public content rendering.
- `apps/admin`: studio dashboard, authentication routes, and administrative APIs for content, projects, inquiries, and companies.
- `packages/database`: Supabase/PostgreSQL clients, schemas, repositories, services, auth helpers, migration tools, and notification code.
- `packages/types`: shared TypeScript contracts and mapping helpers.
- `supabase/migrations` and `supabase/seed.sql`: database schema, access policies, and seed data.
- `docs`: backend architecture blueprint and API integration/verification plan.
- `.github/workflows`: CI workflow for type-checking, linting, tests, migrations, and builds.

The architecture blueprint intentionally rejects a separate Express service and places backend functionality in Next.js route handlers backed by Supabase. The implementation follows this broad topology.

### Request and Data Flow

~~~mermaid
flowchart TD
  Visitor[Public visitor] --> Web[apps/artwork-app]
  Web --> PublicAPI[Public route handlers]
  PublicAPI --> SharedDB[packages/database services and repositories]
  SharedDB --> Supabase[(Supabase Auth and PostgreSQL with RLS)]
  PublicAPI -->|contact brief| Supabase

  Editor[Studio editor] --> Admin[apps/admin]
  Admin --> Middleware[Session and CSRF middleware]
  Middleware --> AdminAPI[Admin route handlers]
  AdminAPI --> SharedDB
  AdminAPI -->|content revalidation request| Web

  Web --> Types[packages/types]
  Admin --> Types
  SharedDB --> Types
  Supabase --> Migrations[supabase/migrations]
  CI[GitHub Actions] --> Web
  CI --> Admin
  CI --> Migrations
~~~

### Architectural Strengths

- Public site and admin dashboard are separate applications with separate route and middleware layers.
- Shared types reduce contract drift between the two apps and database package.
- Several domain services accept repository interfaces, enabling deterministic in-memory tests.
- Admin mutations generally use the user's Supabase session, and core tables have RLS policies.
- The admin middleware enforces CSRF checks for mutating API requests.
- Project and content domains have validation schemas and automated tests.
- YouTube content stores validated IDs and builds privacy-enhanced embed URLs instead of persisting arbitrary iframe markup.
- The backend blueprint documents the risks of service-role access and recommends defense in depth.

## Prioritized Findings

### P1 — Fix Before Production Release

#### 1. Revalidation webhook has a hard-coded fallback secret and accepts the secret in the URL

The public revalidation route uses a fallback secret when the environment variable is absent. It also accepts a secret through the query string and accepts caller-selected cache tags and paths. The same fallback appears in the admin content update and rollback requests. This makes the webhook's security depend on a value present in source and allows overly broad cache invalidation if that fallback is used.

**Evidence:** `apps/artwork-app/src/app/api/revalidate/route.ts:9-20`; `apps/admin/src/app/api/content/[section]/route.ts:46-55`; `apps/admin/src/app/api/content/rollback/[revisionId]/route.ts:38-47`.

**Recommendation:** Fail closed when the secret is not configured, send it only in a request header, and allowlist cache tags and paths. Avoid logging or transmitting secrets in URLs.

#### 2. Company writes do not enforce editor-level authorization

Company POST, PUT, and DELETE handlers call `verifyAdminSessionFromCookies` without `requireWriteAccess`. That helper defaults to membership-only access. The companies RLS policy independently checks only `is_active`, rather than checking for editor or super-admin roles. A valid viewer therefore has a path to company mutations, unlike the project's other mutation routes that explicitly request write access.

**Evidence:** `apps/admin/src/app/api/companies/route.ts:42-52`; `apps/admin/src/app/api/companies/[id]/route.ts:36-47,61-71`; `supabase/migrations/20261026000001_create_companies_table.sql:45-64`.

**Recommendation:** Require write access on every company mutation and enforce the same role rule in PostgreSQL RLS. Reuse the shared authorization helper instead of maintaining a separate role predicate.

#### 3. Company create/update can report success when persistence failed

When a Supabase create or update fails, `companies/service.ts` falls back to its process-local array and returns a successful result. The dashboard can therefore display a successful save even though the record was not persisted and may disappear on another serverless instance or after restart.

**Evidence:** `packages/database/src/companies/service.ts:152-184,199-252`.

**Recommendation:** Treat a failed database mutation as a failed mutation in production. Keep in-memory behavior behind an explicit test/fallback adapter, not as a silent write path.

#### 4. Dependency audit found five production-tree advisories

Running `pnpm audit --prod` reported **three high and two moderate vulnerabilities**. The lockfile resolves PostCSS 8.4.31 under the admin Next dependency and Zod 3.25.76. The applicable advisories include PostCSS source-map path/file disclosure issues and a Zod uncontrolled resource-consumption issue. See the [PostCSS advisory list](https://github.com/postcss/postcss/security/advisories) and [Zod advisory](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5).

**Recommendation:** Update or override the vulnerable transitive PostCSS version to a patched release. Evaluate the Zod major-version upgrade and rerun schema, API, and build checks. Re-run `pnpm audit --prod` after updating the lockfile.

#### 5. Latest GitHub Actions run failed before migration and build checks

For the reviewed commit, the CI job completed type-check and lint successfully, but failed at `Run Deterministic Unit & Database Tests`. The migration and build steps were skipped after that failure. The latest run is available at [GitHub Actions](https://github.com/Ab-Coder123/art-work/actions/runs/40303356564/job/121506348626).

**Recommendation:** Fix the failing test gate and rerun the full workflow. Do not treat successful type-check/lint or Vercel deployment status as a substitute for the skipped database and build steps.

#### 6. Database reset can drop the entire public schema without a safety guard

The `reset` command executes `DROP SCHEMA public CASCADE` against `DATABASE_URL`. There is no production-environment prohibition, target database confirmation, or interactive safety check. If the environment points at a hosted database, running this command can delete application tables and data.

**Evidence:** `packages/database/src/cli.ts:75-85`.

**Recommendation:** Refuse destructive reset in production, require an explicit opt-in flag, verify the target is local, and print the resolved host/database before proceeding.

### P2 — Address for Reliability and Maintainability

#### 7. Refresh token is stored but the session verifier does not refresh the session

Login stores an access token with its normal expiry and a refresh token with a longer expiry. The verifier later calls `getUser` with the access token directly; no refresh-token use was found in the session path. The refresh cookie appears to be cleared at logout but otherwise unused. This conflicts with the blueprint's promised refresh-token rotation and is likely to force a new login after access-token expiration.

**Evidence:** `apps/admin/src/app/api/auth/login/route.ts:43-60`; `packages/database/src/auth/admin-auth.ts:167-187`; `packages/database/src/auth/session.ts:1-4`.

**Recommendation:** Implement and test the refresh lifecycle or remove the unused refresh-cookie promise and document the shorter session behavior.

#### 8. Rate limits are process-local

Login and inquiry limiters use in-memory maps/singletons. In serverless deployment, requests may be served by separate instances, so the limits are not shared and can reset across instances. The inquiry limiter explicitly describes itself as process-local.

**Evidence:** `packages/database/src/auth/rate-limiter.ts:13-20,105-106`; `packages/database/src/inquiries/rate-limiter.ts:11-18,42`.

**Recommendation:** Use a shared rate-limit store or edge/provider-level limiting. Keep the process-local implementation for unit tests only.

#### 9. Project reorder is not atomic

The repository applies each order update as a separate Supabase request in `Promise.all`. If one request fails, other updates may already have committed. The service comment says the operation is atomic, but the implementation is not a transaction.

**Evidence:** `packages/database/src/projects/service.ts:335-348,647-670`.

**Recommendation:** Move the operation into one PostgreSQL function/transaction and test rollback behavior on partial failure.

#### 10. Content version update can race

The content repository reads the current version and then upserts the next number in a separate operation. Concurrent editors can compute the same next version or overwrite each other's changes.

**Evidence:** `packages/database/src/content/service.ts:336-367`.

**Recommendation:** Use an atomic database-side increment and optimistic concurrency check, or serialize updates per section.

#### 11. Migration hashes are recorded but not checked for drift

The migration runner stores filename, version, and hash, but later queries only filenames to decide whether migrations are already applied. An edited migration file with an existing filename is silently considered applied even if its contents changed.

**Evidence:** `packages/database/src/migrations/runner.ts:104-115,126-134`.

**Recommendation:** Compare stored hashes for every applied migration and fail with an explicit drift report if the source file differs.

#### 12. Multiple content sources and legacy store increase coupling

Content defaults exist in `packages/database/src/content/default-content.ts`, `apps/artwork-app/src/data/seedContent.ts`, `apps/artwork-app/src/data/siteContent.json`, and `supabase/seed.sql`. Project defaults also exist in JSON and TypeScript seed files. `apps/artwork-app/src/lib/contentStore.ts` retains a filesystem-backed content/project store that is not used by the current app API path but remains used by tests.

**Recommendation:** Pick one canonical content contract and one seed source. Remove or isolate the legacy store behind an explicit test adapter so future code does not accidentally depend on ephemeral deployment filesystem state.

#### 13. Large client pages carry too many responsibilities

The homepage is a client component exceeding 1,600 lines and contains multiple scene components, state, network requests, and form behavior. Other large client pages include the gallery, Why Us, admin content editor, project manager, and companies manager. This makes review, reuse, and targeted testing harder, and pushes static content into client-rendered code.

**Evidence:** `apps/artwork-app/src/app/page.tsx`; `apps/artwork-app/src/app/gallery/page.tsx`; `apps/artwork-app/src/app/why-us/page.tsx`; `apps/admin/src/app/content/page.tsx`; `apps/admin/src/app/projects/page.tsx`; `apps/admin/src/app/companies/page.tsx`.

**Recommendation:** Split by feature and move static presentation to Server Components where possible. Keep small client islands for animation, interaction, and forms. Measure bundle and Core Web Vitals before and after refactoring.

#### 14. Next.js and its ESLint preset use different major versions

The app manifests declare Next.js 15.x while `eslint-config-next` is pinned to 16.4.0. The current CI lint step passed, but the major-version mismatch can produce confusing rule/config behavior during upgrades.

**Evidence:** `apps/artwork-app/package.json`; `apps/admin/package.json`; lockfile resolves Next 15.5.28 and eslint-config-next 16.4.0.

**Recommendation:** Align the ESLint preset with the installed Next major, or document and validate the intentional mismatch.

#### 15. Security policy permits unsafe script execution sources

The generated Content Security Policy includes `unsafe-inline` and `unsafe-eval` for scripts. This weakens CSP's ability to mitigate script injection. Review whether production can use nonce/hash-based inline allowances and remove `unsafe-eval` where not required.

**Evidence:** `packages/database/src/auth/security-headers.ts:19-22`.

#### 16. CI migration environment differs from Supabase

The workflow uses a plain `postgres:17-alpine` service, while application migrations grant privileges to Supabase roles and policies refer to Supabase auth helpers. Once the test step is fixed, the migration gate should be verified against an environment that creates those roles/functions, or the workflow should provision Supabase-compatible test fixtures.

**Evidence:** `.github/workflows/ci.yml:14-27,68-75`; `supabase/migrations/20261019000002_rls_policies.sql:14-48,152-161`.

## Phase Assessment

There are two ten-phase documents whose phase numbering differs after the early setup and contract work. The table below follows the status in `docs/API_INTEGRATION_10_PHASES.md` and distinguishes code completion from its acceptance gate.

| API integration phase | Recorded status | Audit assessment |
| --- | --- | --- |
| 1. Baseline audit and test inventory | Passed | Inventory and baseline evidence are recorded. |
| 2. Canonical API contracts | Passed | Compatibility normalization and contract tests are recorded. |
| 3. Authentication, CSRF, and RLS boundaries | Passed at application/migration-code level | The progress log says the role migration has not been applied to the hosted database, so hosted RLS behavior remains unverified. |
| 4. Public content API and page bindings | Passed for selected surfaces | Hero, Why Us, and Contact are bound; the log notes other copy surfaces remain outside the editor contract. |
| 5. Admin content editor | Passed | Save, history, rollback, validation, CSRF, and persistence were recorded as verified. |
| 6. Projects and YouTube media | Passed | Project lifecycle and embed checks are recorded as verified. |
| 7. Inquiry/contact integration | In progress | The live valid-submit to dashboard status-update and cleanup round trip is explicitly pending. |
| 8. Cache/revalidation behavior | Not completed in progress log | Revalidation code exists, but the current security and verification gaps prevent treating the gate as passed. |
| 9. End-to-end regression | Not completed in progress log | No complete isolated end-to-end gate is recorded. |
| 10. Release readiness | Not completed in progress log | Current GitHub Actions run failed, and migration/build steps were skipped. |

The backend blueprint's phase 7 is the dynamic content engine, while the integration plan's phase 7 is inquiry/contact. Align these documents or rename them as distinct workstreams to avoid status ambiguity.

## Verification Snapshot and Limitations

- **Read-only review:** No application code was changed during the audit.
- **Dependency audit:** `pnpm audit --prod` returned five findings: three high and two moderate.
- **CI:** The reviewed commit's latest workflow passed type-check and lint, failed the test step, and skipped migrations/builds.
- **Vercel:** GitHub reported the `artwork-app` deployment completed for this commit; the `art-work` project status was skipped as not affected. Deployment status does not establish that every workflow gate passed.
- **Tests/builds:** No local tests or builds were run as part of this audit. This report uses the recorded CI result and static code/configuration review.
- **Database:** The hosted migration state was not directly queried; the integration progress log states that the editor-role migration had not been applied at the time of its entry.

## Recommended Work Order

1. Remove the revalidation fallback secret and restrict the revalidation API.
2. Enforce Editor/Super Admin roles for company mutations in both routes and RLS.
3. Remove success-on-memory-fallback behavior from company writes.
4. Fix the failing CI test step; then run migrations and builds successfully in CI.
5. Update vulnerable production dependencies and re-run the audit.
6. Add guardrails to destructive database commands and verify migration hashes.
7. Complete access-token refresh and shared rate limiting.
8. Make reorder and content version updates atomic.
9. Consolidate seed/content sources and decompose large client pages.
10. Complete the remaining integration-phase acceptance gates and update the two roadmap documents.
