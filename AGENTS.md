# Weekly Meal Planner

## Stack

- React
- TypeScript strict
- React Router 7 Framework Mode
- Vite
- Tailwind CSS
- Turso
- Drizzle ORM
- Better Auth
- Netlify
- Installable PWA

## Core Architecture

- All user-generated domain data belongs to a `Space`.
- Spaces can be `personal` or `family`.
- Users access Spaces through `SpaceMember`.
- Space roles are `owner`, `admin`, and `member`.
- System roles (`user`, `admin`) are separate from Space roles.
- Always enforce Space authorization server-side.
- A user may belong to multiple Spaces.
- The application operates in the context of an active Space.
- Never trust a client-provided Space without verifying membership server-side.

## Domain Rules

- Recipes belong to a Space.
- Ingredients belong to a Space.
- Weekly Plans belong to a Space.
- Shopping Lists belong to a Space.
- A Meal represents a meal slot for a specific day.
- A Meal can contain multiple Recipes.
- Recipe ingredients contain quantity, unit, optional notes, and ordering.
- A `MealRecipe` assignment specifies servings.
- Recipe ingredient quantities scale according to assigned servings.
- Shopping Lists are generated editable snapshots.
- Manual shopping-list edits must not be silently destroyed by recalculation.
- Keep personal and family Spaces on the same domain model whenever practical.

## Authentication and Authorization

- Use Better Auth for authentication and session management.
- Do not implement custom authentication.
- Keep application-level admin permissions separate from Space membership permissions.
- Authorization must be enforced in loaders/actions and other server-side entry points.
- Prefer shared authorization helpers such as:
  - `requireUser()`
  - `requireSpaceMember()`
  - `requireSpaceRole()`
  - `requireSpaceOwner()`
- UI permission checks are for UX only and are never a security boundary.

## React Router

- Use React Router 7 Framework Mode.
- Prefer loaders for route data.
- Prefer actions for server mutations.
- Use `useFetcher` for mutations that should not navigate.
- Use `<Form>` when form submission/navigation semantics are appropriate.
- Do not fetch route data from `useEffect`.
- Use route-level pending and error states.
- Keep server-only modules separate from browser-safe modules.
- Use typed route APIs.
- Avoid duplicating server data unnecessarily in client state.
- Do not introduce a separate REST API without a clear reason.
- Do not add TanStack Query, Redux, Zustand, or similar state libraries unless there is a demonstrated need.

## UX

- Design mobile-first.
- Desktop and mobile layouts may differ when that improves usability.
- The weekly planner is the primary product experience.
- CRUD operations should not automatically become CRUD pages.
- Prefer contextual interactions:
  - inline editing
  - dialogs
  - drawers
  - popovers
  - comboboxes
  - search/command interfaces
- Adding a Recipe to a Meal should not require leaving the weekly planner.
- Creating an Ingredient while editing a Recipe must not navigate away from the Recipe flow.
- Prioritize fast interactions, clear pending states, and accessible controls.
- Avoid excessive cards, gradients, shadows, oversized headings, and nested rounded containers.
- The UI should feel like a focused productivity application.

## Recipe Import

- Prefer structured recipe data first:
  1. schema.org / JSON-LD
  2. HTML extraction / heuristics
  3. future AI fallback
- Never save imported recipes without a user review step.
- Preserve the source URL.
- Treat external URLs and HTML as untrusted input.
- Consider SSRF protection, redirects, timeouts, maximum response size, sanitization, and private-network blocking.

## Shopping List

- Generate Shopping Lists from a Weekly Plan.
- Scale ingredients using MealRecipe servings.
- Aggregate compatible quantities where practical.
- Generated Shopping Lists become editable snapshots.
- Support manual items, edits, removal, and purchased state.
- Regeneration behavior must be predictable and must preserve intentional user edits when possible.

## PWA

- The app must be installable as a PWA.
- Internet connection is required in v1.
- Do not implement offline database synchronization.
- Do not implement conflict resolution for offline edits.
- Provide a clear UX when connectivity is unavailable.

## Database

- Use Turso with Drizzle ORM.
- Use Drizzle schema definitions and migrations.
- Prefer database constraints where useful:
  - foreign keys
  - unique constraints
  - indexes
  - cascading behavior
- Space isolation is critical.
- Prefer Space-aware domain APIs over resource lookup by ID alone.
- Avoid domain ownership directly on `userId` when ownership logically belongs to a Space.

## Engineering

- TypeScript strict mode is mandatory.
- Avoid `any`.
- Avoid unnecessary type assertions.
- Prefer small focused components and modules.
- Keep domain logic separate from UI.
- Keep authorization logic centralized.
- Validate data server-side.
- Use client validation to improve UX, not as a security boundary.
- Avoid unnecessary global state.
- Avoid speculative abstractions.
- Avoid unnecessary dependencies.
- Avoid giant route components and giant service modules.
- Prefer simple, explicit code over theoretical flexibility.
- Inspect existing code before changing architecture.
- Do not rewrite unrelated code during focused tasks.

## Testing

Prioritize tests for important domain logic and critical user flows.

At minimum consider:

- serving scaling
- shopping-list aggregation
- permission rules
- ingredient normalization
- adding a Recipe to a Meal
- creating an Ingredient inline
- editing Shopping List items
- switching active Space

Prefer pragmatic coverage over large low-value test suites.

## Project Skills

Use project-specific skills for detailed rules when relevant.

OpenCode-first location:

```text
.opencode/skills/
```

Important project skills:

- `react-router-7-framework`
- `meal-planner-architecture`

Use external skills for:

- React best practices
- UX/web design guidelines
- frontend design principles
- Drizzle best practices

Do not duplicate entire skill documents inside this file.

## Working Style

When implementing:

1. inspect the relevant existing code;
2. explain the next small objective when the change is significant;
3. make focused changes;
4. run relevant checks;
5. fix errors introduced by the change;
6. summarize what changed;
7. stop at sensible review points.

Do not race through multiple major roadmap items in one task unless explicitly requested.

## Session Handoff

- At the start of a new session, read `docs/CURRENT_STATUS.md` before selecting the next roadmap task.
- At the end of a meaningful work session, update `docs/CURRENT_STATUS.md` with the current milestone, completed work, verification results, important decisions, open work, and one recommended next task.
- Keep the handoff as a concise snapshot of current state rather than an append-only log. Git history preserves previous versions.
- Confirm the handoff against `git status`, recent commits, and the relevant section of `IMPLEMENTATION_PLAN.md`.

## Important

Before making a significant architectural change, explain the reason and trade-offs first.

The project blueprint and longer-form product requirements live in `MASTER_PROMPT.md`. Keep this file focused on durable rules the coding agent should remember across sessions.
