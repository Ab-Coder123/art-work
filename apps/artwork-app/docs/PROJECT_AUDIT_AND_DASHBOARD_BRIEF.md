# Art Work Project Audit and Dashboard Generation Brief

**Audited project:** `E:\programming\Space Work\Art Work\artwork-app`  
**Audit date:** 2026-10-19  
**Purpose:** Record the current implementation and provide a concrete brief for building a two-page content dashboard.

## 1. Project overview

Art Work is a Next.js App Router marketing site for an experiential marketing and event production collective. It has three public routes: the cinematic home page (`/`), a longer proposition page (`/why-us`), and a filterable project gallery (`/gallery`). The UI is a client-heavy React experience using Framer Motion, GSAP/ScrollTrigger, Lenis, Three.js, Zustand, Tailwind CSS v4, and a set of locally served image and video assets.

The site's content is not currently managed through a CMS. Most page copy is embedded in JSX in large route files; the six gallery projects are held in a typed `PROJECTS` array in `src/app/gallery/page.tsx`. The dashboard therefore needs to introduce one centralized, typed content source and make the public pages read from it.

## 2. Architecture map

```text
src/app/layout.tsx
└── ThemeProvider + global styles and metadata
    ├── / (src/app/page.tsx)
    │   ├── ManifestoContent / WhyUsContent / ServicesContent / ContactContent
    │   ├── Capabilities3DMatrix
    │   └── shared cinematic UI, theme, scroll, doodle and sound systems
    ├── /why-us (src/app/why-us/page.tsx)
    │   └── long-form proposition, capability matrix and brief CTA
    ├── /gallery (src/app/gallery/page.tsx)
    │   └── PROJECTS array → filters, project cards and inspect modal
    └── shared components in src/components/{cinematic,theme}
        ├── Zustand state: src/hooks/*Store.ts and src/store/useDoodleStore.ts
        ├── sound engine: src/utils/soundFX.ts
        └── public/assets/{images,video}
```

### Route and content inventory

| Route | Main content | Current source |
|---|---|---|
| `/` | Hero headline and intro; three proof metrics; Why Us teaser and three cards; blueprint feature; services/capabilities; contact headline, paragraph and form labels/placeholders; stage/footer labels | `src/app/page.tsx` (large client component; content split among local JSX components) |
| `/why-us` | Proposition hero; metrics; four capability cards; technical details; brief CTA and footer | `src/app/why-us/page.tsx` (large client component) |
| `/gallery` | Gallery hero; six project records; filter labels; project card copy; spotlight blueprint; CTA; inspect modal | `src/app/gallery/page.tsx`; records are in `PROJECTS` near line 57 |

Dashboard-editable public copy should include visible labels, badges, card titles, paragraphs, section headings, CTA labels, contact form labels/placeholders, and navigation/footer text where appropriate. Decorative design and interaction labels that are not marketing content can remain fixed. The “Why Us” content appears both in the home teaser and the dedicated `/why-us` route; those occurrences should be editable from one shared record where they represent the same message.

## 3. Key findings and recommendations

### High priority

1. **No shared content layer exists.** Home and Why Us content lives in JSX, while gallery content lives in a local array. Create typed content data (for example `src/content/siteContent.ts`) and render all three public routes from those records. Avoid maintaining separate copies of repeated content.
2. **Version mismatch in framework lint configuration.** `package.json` declares `next` as `^15.2.9` but pins `eslint-config-next` at `16.4.0`. Align the framework and lint preset to compatible major versions, then validate install/build/lint in the project environment.
3. **Playwright target URLs disagree.** `playwright.config.ts` sets `baseURL` to port `3005` and configures its own `next start` server, while most browser specs hard-code `http://localhost:3000`; some tests also use fixed URLs instead of `baseURL`. Normalize specs to `page.goto('/')` and the configured base URL, and document the intended test server behavior. Do not run the Playwright suite from this audit because its webServer setting starts a server.

### Medium priority

4. **Content editing is fragile and difficult to audit.** `src/app/page.tsx`, `src/app/why-us/page.tsx`, and `src/app/gallery/page.tsx` are each large client components. Moving copy and project records to typed data separates the CMS-like content from animation and interaction code.
5. **Potential dead components need confirmation.** `SceneHero.tsx`, `CinematicStage.tsx`, and `WhyUsStage.tsx` have exports but no references under `src/` in the scanned source. Confirm whether they are intentionally retained prototypes before removing them.
6. **A generated/static prototype may be stale.** `public/gallery-preview.html` is a standalone gallery preview and should be checked against the live `/gallery` implementation before keeping or updating it.
7. **Readme claims exceed evidence.** `README.md` calls the app “zero-hydration penalty” and describes several exact performance behaviors without supporting verification in this audit. Reword these as implementation notes or add repeatable evidence.

### Security and operational notes

- `.env.local` exists but is excluded by `.gitignore` (`.env*`). Git metadata inspection was denied by the execution environment, so whether it is tracked could not be confirmed. Check this locally before publishing; never expose secret values in the dashboard or report.
- The root layout uses an inline theme bootstrap script. Review its Content Security Policy implications if a strict CSP is introduced.
- `src/utils/soundFX.ts` reads and writes local storage. Most browser storage access is guarded, but the constructor's localStorage read should be made exception-safe for restricted storage contexts.
- `src/app/globals.css` imports Material Symbols from Google Fonts while the app also uses `next/font/google`; remove the external icon-font import if unused to reduce an extra runtime font dependency.
- Static asset inventory includes several multi-megabyte intro videos and duplicated image variants. Consider video/image optimization based on real delivery and caching measurements.

## 4. Dashboard generation brief

Build a private, responsive content dashboard for the existing Art Work website. It has exactly two primary pages. Reuse the project's visual language (black/white surfaces, warm yellow/gold accent, bold typography, sharp borders and compact editorial cards) while keeping the dashboard calmer and easier to scan than the animated public site. The dashboard is for editing website content and projects; changes must be reflected in the public site.

### Page 1 — Website Content

Provide a clear page selector or section navigation to edit content grouped by public route and section:

- **Home / Manifesto:** announcement and badge text, hero headline (including separately editable headline segments if needed), introduction paragraph, primary/secondary CTA labels, proof metric values and labels.
- **Home / Why Us teaser:** section eyebrow, headline, CTA label, and each capability card's title, paragraph and badge.
- **Home / Blueprint and Services:** section headings, card/component headings, descriptions, labels and CTA copy.
- **Home / Contact:** heading, supporting paragraph, field labels, placeholders, submit label, and contact details shown on the page.
- **Why Us page:** hero/proposition copy, metric values/labels, each capability card's title/body/feature bullets, and CTA content.
- Include repeated content only once in the editing model when it is shared by multiple public sections; show every page placement in the editor so the author understands where it appears.

Use labeled inputs for short text, textareas for paragraphs and repeatable rows for metrics/cards/bullets. Show the public route and section next to each group. Include Save/Publish feedback, dirty-state indication, and validation for required content and sensible text lengths. Do not silently truncate content. Keep any live preview optional and clearly tied to the selected route/section.

### Page 2 — Gallery Projects

Provide searchable, filterable project management for the existing gallery. Support adding, editing, reordering, and removing projects (with a confirmation step before deletion). Each project record should support:

- Stable ID/slug and display title.
- Featured image path/asset selection and useful alt text.
- Category (the current categories include `stage`, `conferences`, `booths`, `branding`, `tech`, and `led`) and editable tags.
- Stamp, metadata badge and CAD/reference label.
- Primary stat, supporting stat, project description and client name.
- Repeatable technical specs/details list.
- Draft/published status and display order if publishing workflow is supported.

Show a compact card/table overview with thumbnail, title, category, status and actions. The edit form should make required fields and image-path constraints clear. Preserve the current gallery filtering and project inspect modal on the public page.

### Data, persistence and implementation constraints

- First inspect the existing project state and select persistence that fits the deployment: a database/CMS only if configured, otherwise a server-side JSON or other durable store suitable for the hosting environment. Do not imply that browser-only state is durable or shared.
- Define TypeScript schemas for site content and projects. Preserve stable project IDs so filters, links, and modal selection remain reliable.
- Refactor `/`, `/why-us`, and `/gallery` to render from the shared data source; keep design, animation, accessibility and responsive behavior intact.
- Add a protected dashboard route and authentication/authorization before enabling writes. Do not expose secrets in client bundles. If authentication or durable storage is not available, clearly mark those as prerequisites and do not present unsaved local edits as published content.
- Validate text, arrays, categories and image paths on the server. Handle save errors and prevent accidental loss of unsaved edits.
- Preserve alt text, keyboard access, visible focus, reduced-motion support, and the current light/dark theme.
- Dashboard navigation should contain only the two requested destinations: **Website Content** and **Gallery Projects**. The dashboard can be served under a route such as `/admin`; keep the public routes unchanged.

### Suggested completion criteria

1. Editors can update headings and paragraphs for the major content sections on `/` and `/why-us`, including headings on component cards.
2. Editors can create, update, reorder and delete gallery projects with all fields used by the existing gallery card and inspect modal.
3. Public pages render the saved content after refresh and do not diverge from the dashboard data.
4. Dashboard writes require authorization; validation and save failures are visible and recoverable.
5. Existing routes, filters, responsive layouts, theme toggle, motion preferences and keyboard interactions continue to work.
6. The project build and automated checks pass after implementation; do not auto-start a server outside the test runner's explicitly configured test process.

## 5. Audit scope and limitations

This was a static source/configuration review. The source tree, application route files, shared components, state/hooks/utilities, styles, project scripts, README, dependency manifest, lockfile version declarations and Playwright specs were inspected. Asset files were inventoried, not opened individually. Build, lint, dependency vulnerability checks and browser tests were not run. Git status/tracked-file checks could not complete because access to `.git` on the supplied `E:` project path was denied. The audit therefore identifies code-based risks and verification gaps; it does not claim that the application currently builds or that the noted behaviors reproduce at runtime.

## 6. Main source tree (excluding generated output and dependency/vendor folders)

```text
artwork-app/
├── AGENTS.md                         # Local Next.js implementation constraints
├── README.md                         # Product and setup overview
├── package.json / package-lock.json  # Scripts and dependency versions
├── next.config.ts                    # Next.js config
├── eslint.config.mjs                 # Next.js ESLint presets
├── tsconfig.json                     # Strict TypeScript and @/* alias
├── postcss.config.mjs                # Tailwind CSS v4 PostCSS plugin
├── playwright.config.ts              # Browser test server, base URL and reporter
├── scripts/process_transparent_intro.py # ffmpeg helper for intro video variants
├── src/app/
│   ├── layout.tsx                    # Metadata, fonts, theme provider and shell
│   ├── globals.css                   # Tailwind theme, global styles and animations
│   ├── page.tsx                      # Home route and four-stage scrollytelling
│   ├── why-us/page.tsx               # Standalone proposition route
│   └── gallery/page.tsx              # Project archive, filters and inspector modal
├── src/components/cinematic/         # Animation, stage, matrix, canvas, toggles
├── src/components/theme/ThemeProvider.tsx # Light/dark/system theme state
├── src/hooks/                        # Intro, scene and smooth-scroll state/hooks
├── src/store/useDoodleStore.ts        # Doodle canvas state
├── src/utils/soundFX.ts               # Web Audio UI sound engine
├── public/assets/images/              # Brand, hero, team, capability and project art
├── public/assets/video/               # Intro loader MP4/WebM variants
├── public/gallery-preview.html         # Standalone gallery preview artifact
└── tests/                              # Playwright unit, route, responsive and visual specs
```
