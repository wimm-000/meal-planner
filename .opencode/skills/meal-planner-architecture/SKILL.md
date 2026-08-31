---
name: meal-planner-architecture
description: Apply this skill whenever planning, implementing, reviewing, or refactoring Weekly Meal Planner domain models, Drizzle schemas, Space isolation, permissions, recipes, ingredients, weekly plans, meals, shopping lists, recipe imports, or related business logic.
compatibility: OpenCode V2; Weekly Meal Planner project
metadata:
  project: weekly-meal-planner
  scope: domain-architecture
---

# Weekly Meal Planner Architecture

Use this skill whenever a change affects the application's domain model, persistence, authorization, or core product behavior.

The purpose of this skill is to protect the architectural decisions already made for the project and prevent accidental drift as features are implemented.

For broader product context, also respect:

- repository `AGENTS.md`;
- repository `MASTER_PROMPT.md`;
- repository `IMPLEMENTATION_PLAN.md`.

If those documents conflict with this skill, stop and surface the conflict rather than silently choosing a new architecture.

## Core invariant: everything belongs to a Space

All user-generated meal-planning domain data belongs to a `Space`.

A Space can be:

- `personal`;
- `family`.

Do not create separate domain architectures for personal and family data.

The same Recipes, Ingredients, Week Plans, Meals, and Shopping Lists model should work for both.

## User and Space membership

A User may belong to multiple Spaces through `SpaceMember`.

Conceptually:

```text
User
  ↓
SpaceMember
  ↓
Space
```

Space roles:

- `owner`
- `admin`
- `member`

System roles are separate:

- `user`
- `admin`

Never confuse application administration with permissions inside a Space.

## Ownership rules

Do not model domain ownership directly with `userId` when the resource belongs to a Space.

Prefer:

```text
Recipe
  ↓
Space
  ↓
SpaceMember
  ↓
User
```

Avoid:

```text
Recipe
  ↓
User
```

Apply the same principle to:

- Ingredients;
- Week Plans;
- Shopping Lists;
- future Space-owned settings.

## Space isolation is a security boundary

Every server-side read or mutation of Space-owned data must verify that the authenticated user is allowed to access the resource's Space.

Do not trust a browser-provided `spaceId`.

Do not rely on the currently selected Space in local storage, cookies, route params, or UI state without server verification.

Prefer APIs that make Space context explicit.

Conceptually prefer:

```ts
getRecipe({
  recipeId,
  spaceId,
});
```

or an already-authorized Space context over:

```ts
getRecipe(recipeId);
```

when the latter could make cross-Space access easy to introduce accidentally.

## Active Space

The app operates in an active Space context.

Users may switch between:

```text
My Space
Family Space
Another Family Space
```

Changing active Space changes the domain data visible in the app.

The exact persistence mechanism for active Space is an implementation decision, but it must never replace server-side membership verification.

## Authentication responsibilities

Use the application-owned authentication module for:

- authentication;
- users;
- sessions;
- account management;
- password hashing and session management.

Do not implement custom authentication.

Application-domain authorization remains explicit in the Space / SpaceMember model.

Invitation mechanisms may be evaluated later, but must not replace the core Space domain without architectural discussion.

## Weekly planning model

A `WeekPlan` represents a specific calendar week in a Space.

Initial meal types:

- breakfast;
- lunch;
- dinner.

A `Meal` represents a meal slot for a specific day/type.

A Meal can contain **multiple Recipes**.

Use an explicit join entity:

```text
Meal
  ↓
MealRecipe
  ↓
Recipe
```

Do not model a Meal as containing only one Recipe.

## Servings

A Recipe has `defaultServings`.

A MealRecipe has the servings required for that assignment.

Ingredient quantities scale according to:

```text
required quantity =
recipe ingredient quantity
× meal servings
÷ recipe default servings
```

Keep serving-scaling logic outside React UI components and test it independently.

Validate zero, negative, missing, or otherwise invalid serving values.

## Recipes

Recipes are reusable Space-owned entities.

Initial Recipe fields should include only useful v1 data:

- id;
- spaceId;
- name;
- description;
- instructions;
- default servings;
- source URL;
- optional image;
- timestamps.

Avoid speculative fields and premature generalization.

## Ingredients

Ingredients are reusable Space-owned entities.

Do not store an entire Recipe's ingredient list as one opaque text blob.

Use:

```text
Recipe
  ↓
RecipeIngredient
  ↓
Ingredient
```

`RecipeIngredient` should support:

- quantity;
- unit;
- notes;
- ordering.

Ingredient creation must support contextual creation while editing a Recipe.

Do not force the user to leave Recipe editing to create a missing Ingredient.

## Units

Keep the v1 unit system intentionally simple.

Requirements:

- support common units;
- support unit-less ingredients;
- preserve imported units when normalization is uncertain;
- allow safe future normalization;
- do not build a complex conversion engine prematurely.

Do not automatically merge quantities across incompatible units.

The exact v1 unit representation remains an implementation decision and should be proposed before committing to schema/migration choices.

## Shopping List model

A Shopping List is generated from a Week Plan through:

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
serving scaling
  ↓
compatible ingredient aggregation
  ↓
ShoppingList
```

The Shopping List must become an **editable snapshot**.

It is not a permanently derived view that recomputes on every render.

Users must be able to:

- mark items purchased;
- edit quantities;
- remove items;
- add manual items.

## Shopping List regeneration

Do not silently destroy user edits.

Regeneration must be deterministic and predictable.

At minimum, distinguish conceptually between:

- untouched generated items;
- manually edited generated items;
- manually added items.

Preserve manual items.

Do not overwrite intentionally edited generated items without an explicit strategy.

The exact merge/regeneration semantics are still a product decision. Propose them before implementing this behavior.

## Recipe URL import

Recipe import is incremental.

Preferred pipeline:

```text
URL
 ↓
secure server-side fetch
 ↓
schema.org / JSON-LD Recipe
 ↓
normalize
 ↓
HTML heuristic fallback if worthwhile
 ↓
future AI fallback if needed
 ↓
editable review
 ↓
explicit confirmation
 ↓
save
```

Structured recipe metadata comes before AI extraction.

Never save imported Recipes without user review.

Treat external content as untrusted.

Consider:

- SSRF;
- localhost/private-network blocking;
- redirects;
- request timeouts;
- maximum response size;
- content type;
- malformed JSON-LD;
- multiple Recipe objects;
- sanitization;
- image handling;
- sites blocking automated requests.

## Imported ingredients

Do not overconfidently normalize imported ingredient lines.

When matching imported ingredients to existing Space Ingredients:

- normalize obvious whitespace safely;
- use exact/high-confidence matches where possible;
- allow the user to correct ambiguous matches;
- create new Ingredients when appropriate;
- preserve useful original text/notes when parsing is uncertain.

Correctness and user review are more important than aggressive automation.

## Database design principles

Use Turso with Drizzle ORM.

Prefer useful database constraints:

- foreign keys;
- unique constraints;
- indexes;
- safe cascade behavior.

Expected examples include:

```text
SpaceMember
unique(spaceId, userId)
```

Also consider uniqueness for a WeekPlan per Space/week if the product model confirms one canonical plan per week.

Avoid unnecessary tables or repository abstractions.

Schema changes must preserve Space isolation.

## Domain logic placement

Keep important business rules outside React components.

Good candidates for focused domain modules include:

- serving scaling;
- shopping-list aggregation;
- shopping-list regeneration/merge rules;
- ingredient normalization;
- role/permission checks;
- week/date utilities;
- recipe-import normalization.

Prefer pure or mostly-pure functions where practical.

This makes business rules easier to test and reduces UI coupling.

## UX architecture rules

The application should feel like a cohesive productivity app, not a CRUD admin system.

Common data operations should be contextual.

Examples:

### Recipe → Ingredient

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
Continue Recipe edit
```

### Planner → Recipe

```text
Meal
  ↓
+ Add Recipe
  ↓
Search/select
  ↓
Assign servings
  ↓
Remain in planner
```

Do not add separate pages merely because a database record is being created.

## Authorization matrix

The exact owner/admin/member permission matrix should be explicitly defined before family-sharing implementation.

Do not assume permissions ad hoc in individual routes.

Centralize role policy so loaders/actions use consistent rules.

Never allow privilege escalation through client input.

Never allow removal of the last owner of a Family Space without an ownership-transfer strategy.

## Decisions intentionally left open

Do not silently lock these down unless the relevant milestone requires them:

- password reset, email verification, and rate-limiting strategy;
- active-Space persistence mechanism;
- UI primitive/component library;
- validation library;
- Ingredient case/uniqueness normalization;
- v1 unit representation;
- exact Shopping List regeneration merge semantics;
- Recipe image storage vs remote URLs;
- whether HTML extraction is worth implementing after JSON-LD;
- whether an external service should assist with family invitations;
- exact owner/admin/member permission matrix.

When one of these becomes necessary, propose the simplest suitable option and explain trade-offs.

## Avoid these architecture mistakes

Do not:

- attach Recipes directly to users instead of Spaces;
- build separate personal/family domain tables;
- trust active Space from the client;
- query Space-owned resources without authorization;
- model Meal as one Recipe only;
- store Recipe ingredients only as an opaque string;
- calculate serving quantities only inside components;
- make Shopping List a constantly recomputed derived view;
- overwrite manual Shopping List edits silently;
- make AI the primary Recipe URL parser;
- introduce complex unit conversion before it is needed;
- create speculative abstractions for future features.

## Implementation workflow

For a new domain feature:

1. identify the owning Space;
2. state the relevant domain invariants;
3. design the minimum schema/constraints needed;
4. design server-side authorization;
5. implement domain logic separately from route UI;
6. expose it through React Router loaders/actions/fetchers as appropriate;
7. implement contextual UX;
8. add domain tests;
9. add integration/E2E tests for critical user flows;
10. review for cross-Space leakage and accidental architecture drift.

## Review checklist

Before finishing a domain change, verify:

- [ ] Every user-generated resource is scoped correctly.
- [ ] Personal and Family Spaces share the same domain model.
- [ ] Server-side Space authorization is enforced.
- [ ] System role and Space role are not confused.
- [ ] Cross-Space references cannot be introduced.
- [ ] Domain rules are not buried only in UI components.
- [ ] Database constraints support important invariants.
- [ ] Serving logic is correct and tested where relevant.
- [ ] Shopping-list edits are protected where relevant.
- [ ] Contextual UX avoids unnecessary navigation.
- [ ] No unresolved product decision was silently made.
- [ ] Relevant tests were added or updated.
