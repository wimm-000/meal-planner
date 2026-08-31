---
name: react-router-7-framework
description: Apply this skill when planning, implementing, reviewing, or refactoring routes, loaders, actions, forms, fetchers, pending UI, error boundaries, server/client boundaries, or data mutations in this React Router 7 Framework Mode project.
compatibility: OpenCode V2; React Router 7 Framework Mode
metadata:
  project: weekly-meal-planner
  scope: routing-data-mutations
---

# React Router 7 Framework Mode

Use this skill for all work involving routing, server data, form submissions, mutations, navigation state, and route-level UX.

This project intentionally uses **React Router 7 Framework Mode** as its full-stack application architecture.

## Primary goal

Keep route data and mutations aligned with React Router's data APIs instead of rebuilding a client-side data layer on top of them.

Prefer the simplest React Router-native solution that provides:

- clear server/client boundaries;
- typed route data;
- progressive enhancement where practical;
- local pending feedback;
- minimal duplicated state;
- predictable revalidation after mutations.

## Non-negotiable rules

### Use Framework Mode

Do not convert the project to Declarative Mode or a traditional SPA architecture.

Do not introduce a separate REST or GraphQL application API merely to move data between this React application and its own server code.

A separate API is acceptable only when there is an external-consumer or architectural requirement that React Router route modules cannot reasonably satisfy.

### Read with loaders

Use route `loader` functions for data required by a route.

Prefer route-level loading over client-side fetching after render.

Do not use `useEffect` to fetch normal route data.

Do not duplicate loader data into component state unless the user is explicitly editing a local draft or there is another concrete UI need.

### Write with actions

Use route `action` functions for server-side mutations.

Mutations must:

1. authenticate the user where required;
2. authorize access to the active Space/resource;
3. validate input server-side;
4. perform the mutation;
5. return structured errors or success data;
6. rely on React Router revalidation where appropriate.

Do not put security-sensitive mutation logic solely in client event handlers.

### Use fetchers for non-navigation interactions

Use `useFetcher` / `fetcher.Form` when an interaction should submit or load data **without changing page context**.

Typical examples in this project:

- add a Recipe to a Meal;
- remove a Recipe from a Meal;
- change MealRecipe servings;
- create an Ingredient inline;
- mark a Shopping List item purchased;
- edit a Shopping List item;
- contextual search/load operations where a route navigation would be disruptive.

Fetchers maintain independent states and are suitable for multiple concurrent interactions.

### Use navigation when the user changes context

Use normal navigation when the user genuinely moves to another application area or resource.

Examples:

- Weekly Planner → Recipes
- Recipe list → dedicated Recipe detail when a full detail route is useful
- switching to Family management
- opening application settings

Do not navigate merely because a database record needs to be created or edited.

## Forms

Prefer React Router `<Form>` when submission semantics should behave like navigation.

Prefer `fetcher.Form` when submission must remain in the current UI context.

Use native form semantics and progressive enhancement where practical.

Avoid manually reconstructing normal form behavior with click handlers unless there is a concrete reason.

## Pending UI

Every meaningful mutation should expose a clear local pending state.

Examples:

- `Adding recipe…`
- `Creating ingredient…`
- `Updating servings…`
- `Generating shopping list…`
- `Importing recipe…`

Use `fetcher.state`, navigation state, or route state rather than creating unrelated loading-state systems.

Disable or guard actions that would cause accidental duplicate submissions.

Prefer local pending feedback over blocking the entire page.

## Optimistic UI

Use optimistic UI only when rollback is straightforward and understandable.

Good candidates:

- purchased/unpurchased Shopping List item;
- simple Recipe assignment removal;
- lightweight reordering.

Be more conservative for:

- Recipe creation;
- destructive operations;
- authorization-sensitive operations;
- shopping-list regeneration;
- recipe import.

Correctness is more important than simulated speed.

## Error handling

Use route error boundaries for unexpected route-level failures.

Return structured validation/domain errors from actions when the user can correct the problem.

Distinguish where useful between:

- unauthenticated;
- unauthorized;
- validation error;
- not found;
- connectivity failure;
- server failure.

Do not expose stack traces or sensitive server details to the browser.

## Server/client boundaries

Keep secrets, database clients, application authentication configuration, privileged authorization, and external URL fetching in server-only modules.

Do not import server-only modules into browser bundles.

Keep browser-safe types and pure domain helpers separate when useful.

## Authorization integration

Every loader/action that reads or mutates Space-owned data must use the project's shared authorization helpers.

Expected conceptual helpers include:

```ts
requireUser();
requireSpaceMember();
requireSpaceRole();
requireSpaceOwner();
```

Never rely on:

- hidden buttons;
- disabled controls;
- client-provided `spaceId`;
- the active Space stored in the browser

as a security boundary.

The server must resolve and verify membership.

## Typed route modules

Use React Router's current generated route types and typed route-module APIs.

Avoid `any` and avoid manually re-declaring loader/action result types when React Router can infer or generate them.

When generated type APIs or file conventions are uncertain, consult the current official React Router documentation before coding.

## Route organization

Prefer route modules that coordinate:

- loader/action;
- route-level data;
- route UI;
- route errors.

Do not put all business logic inside route files.

Move reusable domain logic into focused server/domain modules.

Route modules should orchestrate application behavior, not become giant service layers.

## Revalidation

Understand React Router's built-in revalidation before adding custom cache invalidation.

Prefer automatic revalidation after actions when it provides correct behavior.

Optimize revalidation only after identifying an actual performance or UX problem.

Do not introduce TanStack Query, Redux, Zustand, or another server-state abstraction merely to avoid understanding React Router revalidation.

## Contextual UX examples

### Add Recipe to Meal

Preferred flow:

```text
Planner
  ↓
+ Add Recipe
  ↓
fetcher-powered search/select
  ↓
action validates Space + Meal + Recipe
  ↓
Meal updates without navigation
```

### Create Ingredient while editing Recipe

Preferred flow:

```text
Recipe editor remains open
  ↓
Ingredient combobox
  ↓
No match
  ↓
Create ingredient with fetcher
  ↓
New Ingredient automatically selected
  ↓
Continue editing Recipe
```

The user must not be sent to an Ingredients CRUD page for this flow.

## Avoid these patterns

Do not default to:

```ts
useEffect(() => {
  fetch("/api/...");
}, []);
```

for route data.

Do not create `/api/*` endpoints for ordinary internal mutations if an action/fetcher is sufficient.

Do not mirror all loader data in Zustand/Redux.

Do not create a custom request-state framework around every fetcher.

Do not use navigation for every CRUD operation.

Do not put database access directly inside React components.

## Review checklist

Before finishing React Router-related work, verify:

- [ ] Framework Mode conventions are preserved.
- [ ] Route data comes from loaders where appropriate.
- [ ] Mutations use actions.
- [ ] Non-navigation mutations use fetchers where appropriate.
- [ ] Server-side authorization is enforced.
- [ ] Input is validated server-side.
- [ ] Pending states are visible.
- [ ] Duplicate submissions are prevented where needed.
- [ ] Errors are understandable and safe.
- [ ] No unnecessary client copy of server state was introduced.
- [ ] No unnecessary state-management/data-fetching library was added.
- [ ] Important domain logic lives outside route UI components.
- [ ] Relevant tests were added or updated.

## Documentation priority

When behavior or APIs may have changed, prefer current official documentation:

- https://reactrouter.com/start/modes
- https://reactrouter.com/how-to/fetchers
- https://reactrouter.com/api/hooks/useFetcher
- https://reactrouter.com/

Official current documentation overrides examples remembered from older React Router versions.
