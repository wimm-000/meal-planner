# Current Project Status

Updated: 2026-09-04
Branch: `feat/active-space-authorization`
Last implementation commit: `2b28bf1 feat: add active Space switching and role authorization`

## Current Milestone

Milestone 1: Database, Authentication and Spaces is functionally complete
locally. Applying the current migration to Turso and verifying the Netlify
deployment remain external deployment tasks.

## Last Completed

- Created the React Router 7 Framework Mode application with SSR enabled.
- Enabled strict TypeScript, Vite, Tailwind CSS, and the `~/*` app alias.
- Added the initial route, root error boundary, and connectivity notice.
- Added Netlify build configuration and server-only environment placeholders.
- Configured ESLint, Prettier, Vitest, React Testing Library, and Playwright.
- Added desktop and mobile end-to-end coverage for the foundation screen.
- Added the installable PWA manifest, service worker generation, and app icons.
- Changed the page background to white and added a pale-green header.
- Added semantic light and dark color tokens that follow the operating-system
  preference.
- Strengthened structural divider contrast, clarified the logo boundary, and
  italicized only "Eat well." in the hero heading.
- Aligned the PWA theme and background colors with the current light palette.
- Installed project-scoped React, web-design, frontend-design, and Drizzle
  supporting skills with sources pinned in `skills-lock.json`.
- Reconciled the Milestone 0 roadmap checkboxes against the repository.
- Added a LibSQL/SQLite Drizzle database with the initial User, AuthSession,
  Space, and SpaceMember schema and local migration workflow.
- Added application-owned email/password authentication with hashed passwords,
  opaque hashed session tokens, signup, login, logout, and protected app route.
- Added idempotent personal-Space provisioning during signup.
- Added an authentication E2E flow covering signup and personal-Space access.
- Removed Better Auth and updated project architecture documentation to reflect
  application-owned authentication.
- Added an active-Space selector backed by an `HttpOnly`, `SameSite=Lax` cookie.
- Verified every Space change against server-side membership before setting the
  cookie; a client-provided Space ID is never trusted.
- Added `requireSpaceRole()` and `requireSpaceOwner()` authorization helpers
  with explicit 404/403 behavior.
- Added role, ownership, cross-Space, and cookie tests.
- Made Playwright migrate a reproducible local database before starting its web
  server in a clean checkout.
- Reconciled the Milestone 1 checklist with the implementation.

## Verification

The active-Space and authorization increment passed on 2026-09-04:

- `npm run typecheck`
- `npm run lint`
- `npm run format:check`
- `npm test` - 6 tests passed across 2 test files
- `npm run build`
- `npm run test:e2e` successfully prepared/migrated the clean local database
  and started the application, but browser execution could not run because the
  current environment does not have Playwright Chromium installed.

The generated `build/client/manifest.webmanifest` was also inspected and uses
`#f1f6e9` for `theme_color` and `#ffffff` for `background_color`.

Light and dark themes were also rendered at desktop and 390px mobile widths.
No horizontal overflow, console errors, or material color-accessibility issues
were found.

## Important Decisions

- The application uses React Router 7 Framework Mode with server rendering.
- Route data and mutations should use loaders, actions, and fetchers rather than
  a separate client-side data layer.
- User-generated domain data will be owned by a Space and authorized
  server-side.
- The initial theme follows `prefers-color-scheme`; there is no manual theme
  selector yet.
- The light palette uses a white page, pale-green header, leaf-green heading,
  warm orange accents, and olive structural lines.
- The dark palette uses olive-charcoal surfaces rather than pure black.
- PWA installation is supported, but application data still requires an
  internet connection.
- Active Space is persisted in an `HttpOnly`, `SameSite=Lax` cookie. The server
  resolves a sensible membership default and validates the selected Space on
  every change.
- Role helpers accept explicit allowed roles instead of assuming an implicit
  owner/admin/member permission hierarchy before the permission matrix is
  finalized.
- Supporting third-party skills are installed at project scope under
  `.agents/skills/`; restart OpenCode to load newly installed skills.
- Netlify deployment is intentionally deferred while local development
  continues. The expired CLI credential was removed and requires a fresh login
  before deployment.

## Open Work

- Deploy the foundation to Netlify and verify SSR and server execution in the
  deployed environment.
- Run the current application-owned-auth migration against the existing Turso
  production database using a rotated token.
- Verify the active-Space selector in desktop and mobile Chromium.
- Add shared authorization error handling if duplication grows.
- Add rate limiting, password reset, email verification, and account recovery
  before treating authentication as production-ready.
- Address the Vite `envFile` deprecation and React Router 8 future-flag warnings
  when doing so is useful and low risk.

## Next Recommended Task

Apply the current migration to Turso with the rotated token, then start
Milestone 2 with the Space-owned Ingredient schema, normalization rules, and
server-side CRUD operations.

## Session Handoff Routine

At the start of the next session:

1. Read `AGENTS.md`.
2. Read this file.
3. Read the current milestone in `IMPLEMENTATION_PLAN.md`.
4. Run `git status --short --branch` and inspect recent commits.
5. Continue from `Next Recommended Task`, unless the user provides a different
   priority.

At the end of a meaningful work session, replace this file's current-state
sections rather than appending a session log. Git history preserves older
handoffs.
