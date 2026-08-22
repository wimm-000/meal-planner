# Weekly Meal Planner

A responsive, mobile-first **Progressive Web App** for weekly meal planning, reusable recipes, ingredient management, family spaces, and shopping-list generation.

> Project status: planning / foundation. The architecture and implementation roadmap are documented before feature development begins.

## Product goals

The app is designed to make weekly meal planning fast and frictionless:

- Plan breakfast, lunch, and dinner for each day of the week.
- Add multiple recipes to a meal.
- Manage reusable recipes and ingredients.
- Create missing ingredients inline while editing a recipe.
- Scale ingredient quantities by servings.
- Generate an editable shopping-list snapshot from the weekly plan.
- Import recipes from external URLs, preferring structured `schema.org/Recipe` / JSON-LD data.
- Support personal spaces and shared family spaces.
- Provide an installable PWA experience while requiring an internet connection in v1.

## Tech stack

- **React**
- **TypeScript** in strict mode
- **React Router 7** in Framework Mode
- **Vite**
- **Tailwind CSS**
- **Turso**
- **Drizzle ORM**
- **Better Auth**
- **Netlify**
- **PWA**

## Core architecture

All user-generated domain data belongs to a `Space`.

```text
User
  |
  +-- SpaceMember --> Personal Space
  |
  +-- SpaceMember --> Family Space
```

Spaces can be:

- `personal`
- `family`

Space membership roles:

- `owner`
- `admin`
- `member`

System-level roles are separate:

- `user`
- `admin`

Authorization is enforced server-side. Client-side permission checks are used only to improve UX.

## Main domain

```text
User
 └── SpaceMember
       └── Space
            ├── Ingredient
            ├── Recipe
            │    └── RecipeIngredient
            │
            ├── WeekPlan
            │    └── Meal
            │          └── MealRecipe
            │                └── Recipe
            │
            └── ShoppingList
                 └── ShoppingListItem
```

Key rules:

- A Meal can contain multiple Recipes.
- Recipe ingredients have quantities and units.
- `MealRecipe` stores the servings for that meal assignment.
- Ingredient quantities scale from recipe servings to meal servings.
- Shopping lists are generated as **editable snapshots**.
- Manual shopping-list changes must not be silently overwritten by regeneration.
- Personal and family spaces use the same core domain model.

## UX principles

This is not intended to feel like a collection of CRUD pages.

Prefer contextual interactions such as:

- drawers
- dialogs
- popovers
- comboboxes
- inline editing
- search/select flows
- React Router `useFetcher` mutations when navigation is not appropriate

Example: when editing a recipe, a missing ingredient should be creatable and selected immediately without leaving the recipe editor.

The weekly planner is the primary application experience and should be designed mobile-first. Mobile and desktop layouts may differ where that improves usability.

## Recipe import strategy

Recipe URL importing should be implemented incrementally:

```text
URL
 ↓
Secure server-side fetch
 ↓
schema.org / JSON-LD Recipe
 ↓
Normalize
 ↓
HTML fallback if worthwhile
 ↓
Future AI fallback if needed
 ↓
Editable review
 ↓
Explicit user confirmation
 ↓
Save
```

External URLs and content are untrusted. SSRF protection, redirect handling, timeouts, maximum response sizes, private-network blocking, and sanitization must be considered.

## PWA

The application should be installable as a PWA.

For v1:

- app installation is supported;
- static/app-shell caching may be used where appropriate;
- data operations require an internet connection;
- offline mutation queues and synchronization are intentionally out of scope.

## Project documents

| File | Purpose |
| --- | --- |
| [`MASTER_PROMPT.md`](./MASTER_PROMPT.md) | Full product and architecture brief used to start/guide agent work |
| [`AGENTS.md`](./AGENTS.md) | Durable rules that coding agents should keep in context |
| [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) | Milestone-by-milestone implementation checklist |
| [`docs/PROJECT_REFERENCE.md`](./docs/PROJECT_REFERENCE.md) | Consolidated project decisions and reference document |

## Implementation roadmap

The planned implementation order is:

1. Project foundation
2. Database, authentication, and spaces
3. Ingredients
4. Recipes
5. Weekly planner
6. Shopping list
7. Recipe URL import
8. Family sharing and membership management
9. PWA / accessibility / UX polish
10. System admin

See [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) for the detailed checklist and definition of done for each milestone.

## Initial MVP

The first useful MVP should include:

- project foundation;
- authentication and spaces;
- ingredient management;
- recipe management;
- weekly planner;
- shopping-list generation and editing;
- basic PWA installability.

Recipe URL import, family invitation UX, deeper PWA polish, and system-admin tooling can follow the core MVP.

## Development approach

- Work in small, reviewable milestones.
- Inspect existing code before changing architecture.
- Prefer React Router loaders/actions/fetchers over manual route-data fetching.
- Keep important domain logic outside React components.
- Avoid unnecessary global state and speculative abstractions.
- Use TypeScript strict mode.
- Add tests for domain logic and critical user journeys.
- Review significant architectural changes before implementing them.

## Agent setup

The project is intended to work well with OpenCode and GPT-based models.

Project-local skills should live under:

```text
.opencode/skills/
```

Included project-specific skills:

- `.opencode/skills/react-router-7-framework/SKILL.md`
- `.opencode/skills/meal-planner-architecture/SKILL.md`

Supporting external skills should cover:

- React best practices
- UX / web-design guidelines
- frontend design
- Drizzle best practices

## Deployment

Target deployment platform: **Netlify**

Database: **Turso**

Authentication: **Better Auth**

The deployment architecture should be verified early with a minimal React Router Framework Mode deployment before feature work grows.

## License

License has not yet been selected.
