# Weekly Meal Planner — Project Reference

This document consolidates the main product and architecture decisions made before implementation.

For detailed execution instructions, also see:

- [`../MASTER_PROMPT.md`](../MASTER_PROMPT.md)
- [`../AGENTS.md`](../AGENTS.md)
- [`../IMPLEMENTATION_PLAN.md`](../IMPLEMENTATION_PLAN.md)

## Product vision

Build a responsive, mobile-first PWA for weekly meal planning that makes planning, recipe management, ingredient management, and shopping-list creation feel fast and seamless rather than like a set of CRUD admin screens.

The primary experience is the weekly planner.

Users should be able to:

- plan breakfast, lunch, and dinner for each day;
- assign multiple recipes to the same meal;
- manage reusable recipes and ingredients;
- create missing ingredients inline while editing a recipe;
- scale recipe quantities according to meal servings;
- generate an editable shopping-list snapshot from a weekly plan;
- import recipes from external URLs;
- use personal spaces and shared family spaces.

## Confirmed stack

- React
- TypeScript strict mode
- React Router 7 Framework Mode
- Vite
- Tailwind CSS
- Turso
- Drizzle ORM
- Application-owned authentication
- Netlify
- PWA support

OpenCode with GPT-based models is the primary coding-agent workflow.

## Authentication and authorization

Use the application-owned authentication module for authentication and session
management. Password hashes and opaque server sessions are stored in the
database; plaintext passwords and raw session tokens are never persisted.

There are two separate authorization concepts.

### System role

- `user`
- `admin`

The system `admin` role is for administration of the whole application.

### Space role

Space membership uses:

- `owner`
- `admin`
- `member`

System roles and Space roles must never be confused.

Authorization must always be enforced server-side.

## Spaces

All user-generated domain data belongs to a `Space`.

A Space can be:

- `personal`
- `family`

A user should automatically receive a personal Space and may belong to multiple family Spaces.

Conceptually:

```text
User
  ↓
SpaceMember
  ↓
Space
```

Do not maintain separate personal and family data models.

Do not attach Recipes, Ingredients, Week Plans, or Shopping Lists directly to a user when they logically belong to a Space.

## Active Space

The application operates within an active Space.

A user may switch between spaces such as:

```text
My Space
Family Space
Another Family Space
```

Changing Space changes the recipes, ingredients, plans, and shopping lists visible in the application.

The server must always verify membership in the requested Space; client state is not a security boundary.

## Core domain model

```text
User
 └── SpaceMember
       └── Space
            ├── Ingredient
            ├── Recipe
            │    └── RecipeIngredient
            │          └── Ingredient
            │
            ├── WeekPlan
            │    └── Meal
            │          └── MealRecipe
            │                └── Recipe
            │
            └── ShoppingList
                 └── ShoppingListItem
```

## Meals and servings

Initial meal types:

- breakfast
- lunch
- dinner

A Meal represents a meal slot for a specific day and type.

A Meal may contain multiple Recipes through `MealRecipe`.

Recipes have default servings. A `MealRecipe` assignment stores the servings required for that particular meal.

Ingredient quantities should scale according to:

```text
required quantity =
recipe ingredient quantity
× meal servings
÷ recipe default servings
```

This calculation belongs in tested domain logic, not only in React components.

## Recipes and ingredients

Recipes are reusable and Space-owned.

Initial Recipe information includes:

- name;
- description;
- instructions;
- default servings;
- source URL;
- optional image;
- ingredients.

Ingredients are reusable Space-owned entities.

Use an explicit `RecipeIngredient` relationship containing information such as:

- quantity;
- unit;
- notes;
- ordering.

The v1 unit model should remain deliberately simple. Do not build a large unit-conversion system prematurely.

## Recipe editing UX

Recipe editing must support contextual ingredient creation.

Preferred flow:

```text
Edit Recipe
  ↓
Search Ingredient
  ↓
No match
  ↓
Create Ingredient
  ↓
Automatically select it
  ↓
Continue editing Recipe
```

The user should not need to leave the recipe editor and visit an Ingredients page just to create a missing ingredient.

## Weekly Planner UX

The weekly planner is the main screen.

Mobile and desktop do not need identical layouts.

On mobile, do not compress seven days into seven narrow columns. Prefer a day-focused or small-day-window experience with quick week/day navigation.

Adding a Recipe to a Meal should use contextual search/select UI and should not require leaving the planner.

Use React Router fetchers where mutations should happen without navigation.

## Shopping List

Shopping List generation follows:

```text
WeekPlan
  ↓
Meals
  ↓
MealRecipes
  ↓
Recipes
  ↓
RecipeIngredients
  ↓
Serving scaling
  ↓
Compatible ingredient aggregation
  ↓
ShoppingList
```

A generated Shopping List becomes an **editable snapshot**.

Users should be able to:

- mark items purchased;
- edit quantities;
- remove items;
- add manual items.

Regeneration must not silently destroy manual edits.

The exact regeneration merge strategy remains a decision to make before that feature is implemented.

## Recipe import from URL

Import should be incremental and deterministic first:

```text
URL
 ↓
Secure server-side fetch
 ↓
schema.org / JSON-LD Recipe
 ↓
Normalize
 ↓
HTML heuristic fallback if worthwhile
 ↓
Future AI fallback if necessary
 ↓
Editable review
 ↓
Explicit user confirmation
 ↓
Save
```

Structured Recipe metadata should be preferred over AI extraction.

Imported data is never saved blindly. The user reviews and edits it first.

External pages are untrusted. Consider SSRF protection, localhost/private-network blocking, redirects, timeouts, maximum response size, malformed JSON-LD, sanitization, and image handling.

## React Router architecture

Use React Router 7 Framework Mode as the application's full-stack architecture.

Prefer:

- loaders for route data;
- actions for server mutations;
- `<Form>` where navigation/form semantics are appropriate;
- `useFetcher` / `fetcher.Form` for non-navigation mutations;
- route-level pending and error states;
- typed route APIs.

Avoid fetching normal route data using `useEffect`.

Do not add Redux, Zustand, TanStack Query, or a separate REST API without a concrete demonstrated need.

## UX principles

The application should feel like a focused productivity application.

Prefer:

- drawers;
- dialogs;
- popovers;
- comboboxes;
- inline editing;
- contextual creation;
- visible local pending states.

Avoid excessive cards, gradients, giant headings, shadows, and rounded containers nested inside more rounded containers.

Accessibility is a requirement, including keyboard navigation, focus management, accessible dialogs/comboboxes, labels, form errors, and reasonable touch target sizes.

## PWA and connectivity

The app must be installable as a PWA.

Offline data synchronization is deliberately out of scope for v1.

Data operations require an internet connection. Connectivity failures should have a clear UX, and offline mutations should not be queued for later synchronization.

## Deployment

Deploy on Netlify.

The architecture must remain compatible with:

- React Router Framework Mode server execution;
- application-owned authentication;
- Turso;
- Drizzle.

Verify deployment early with a minimal application before feature complexity grows.

## Agent setup

Project-specific OpenCode skills live in:

```text
.opencode/skills/
```

Included custom skills:

- `react-router-7-framework`
- `meal-planner-architecture`

`AGENTS.md` contains durable rules that should remain in agent context. Detailed requirements and the execution roadmap remain in their dedicated files rather than bloating `AGENTS.md`.

## Testing strategy

Use pragmatic coverage focused on domain rules and critical flows.

Likely tooling:

- Vitest
- React Testing Library
- Playwright

Priority areas include:

- serving scaling;
- shopping-list aggregation;
- permissions and Space isolation;
- ingredient normalization;
- inline ingredient creation;
- adding Recipes to Meals;
- active Space switching;
- shopping-list editing/regeneration.

## MVP scope

The first useful MVP should contain:

1. project foundation;
2. authentication, Turso/Drizzle, and Spaces;
3. Ingredients;
4. Recipes;
5. Weekly Planner;
6. Shopping List;
7. basic PWA installability.

Recipe URL import, richer family invitations, deeper PWA polish, and system-admin tooling can follow the core MVP.

## Decisions intentionally left open

Resolve these only when the relevant milestone needs them:

- password reset, email verification, and rate-limiting strategy;
- active-Space persistence strategy;
- UI primitive/component library;
- validation library;
- Ingredient uniqueness/case normalization;
- exact v1 unit representation;
- Shopping List regeneration merge semantics;
- Recipe image storage vs remote URLs;
- whether HTML extraction adds enough value after JSON-LD;
- whether invitations should be application-owned or use an external service;
- exact owner/admin/member permission matrix.

Prefer the simplest solution that satisfies the current milestone and explain significant trade-offs before changing architecture.
