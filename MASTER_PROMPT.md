# Weekly Meal Planner PWA

We are going to design and build a **responsive Progressive Web App for weekly meal planning, recipe management, ingredient management, and shopping list generation**.

The application should prioritize:

- excellent UX
- very fast interactions
- mobile-first responsive design
- maintainable architecture
- strong TypeScript types
- accessibility
- simple domain modeling
- server-side authorization
- minimal unnecessary dependencies

This project will be developed using **OpenCode with GPT-based models**.

Do **not** immediately generate the entire application.

Before substantial implementation, analyze the requirements, identify ambiguities, propose the architecture and data model, and discuss important decisions with me.

---

# 1. Tech Stack

Use:

- React
- TypeScript with strict mode
- React Router 7 in **Framework Mode**
- Vite
- Tailwind CSS
- Turso
- Drizzle ORM
- Application-owned authentication
- PWA support
- Netlify for deployment

Prefer current stable versions that are mutually compatible.

Before using APIs that may have changed, consult the latest official documentation.

Official documentation should take precedence over assumptions or outdated examples.

---

# 2. General Architecture

This should be a **full-stack React Router 7 application**, not a traditional SPA with a separate REST API unless there is a strong architectural reason.

Use React Router Framework Mode capabilities appropriately:

- loaders
- actions
- `<Form>`
- `useFetcher`
- nested routes
- route-level pending states
- route-level error handling
- typed route modules
- server-side code where appropriate

Avoid fetching route data manually from `useEffect`.

Avoid unnecessary global state.

Do not introduce TanStack Query, Redux, Zustand, or similar state libraries unless there is a concrete need that React Router's data APIs cannot solve cleanly.

---

# 3. Product Goal

The application allows users to:

1. plan meals for a week;
2. manage reusable recipes;
3. manage ingredients;
4. assign one or more recipes to individual meals;
5. calculate ingredient quantities according to servings;
6. generate a shopping list from the weekly meal plan;
7. edit the generated shopping list;
8. import recipes from external URLs;
9. share meal-planning spaces with family members.

The application should feel like a cohesive application rather than a collection of CRUD screens.

---

# 4. Users and Authentication

Use application-owned email/password authentication and session management.
Passwords must use a slow, salted password hash and sessions must use opaque
random tokens whose hashes are stored server-side.

The application authentication module should initially handle:

- users
- authentication
- sessions
- password hashing and verification
- account creation and session management

Do not create a custom authentication system.

Authentication must integrate cleanly with React Router loaders and actions.

---

# 5. System Roles

There are two different authorization concepts:

## System-level role

A user can have:

- `user`
- `admin`

`admin` means administration of the overall application.

It must not be confused with permissions inside a shared meal-planning Space.

---

# 6. Spaces

All user-generated meal-planning data belongs to a **Space**.

A Space can initially be:

- `personal`
- `family`

A newly registered user should normally have a personal Space.

Users may additionally belong to one or more family Spaces.

Example:

```text
User
│
├── Personal Space
│
├── Family Space A
│
└── Family Space B
```

Personal Spaces and Family Spaces should use the same domain architecture whenever practical.

Avoid creating one set of tables or logic for personal data and another for family data.

---

# 7. Space Membership

Membership should be modeled explicitly.

Conceptually:

```text
User
  ↓
SpaceMember
  ↓
Space
```

Initial Space roles:

- `owner`
- `admin`
- `member`

A user may have different roles in different Spaces.

Example:

```text
Andrés
├── My Space
│   └── owner
│
├── Family Space
│   └── admin
│
└── Another Family
    └── member
```

Do not store domain ownership directly against `userId` when it logically belongs to the Space.

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

over:

```text
Recipe
  ↓
User
```

---

# 8. Active Space

The application should have the concept of an **active Space**.

The user should be able to switch between Spaces.

Example:

```text
┌─────────────────────────┐
│ 👨‍👩‍👧 Family Space   ▾ │
├─────────────────────────┤
│ Weekly Planner          │
│ Recipes                 │
│ Shopping List           │
└─────────────────────────┘
```

Changing the active Space changes the application context.

Recipes, ingredients, weekly plans, shopping lists and other domain data shown in the UI belong to the active Space.

Design how the active Space is represented and persisted before implementing it.

Do not trust a client-provided active Space without verifying membership server-side.

---

# 9. Authorization

Authorization must always be enforced on the server.

Every loader/action accessing Space-owned resources must verify:

1. the user has a valid application session;
2. the Space exists;
3. the authenticated user belongs to the Space;
4. their Space role permits the requested operation.

Client-side permission checks exist only for UX.

They are not security boundaries.

Authorization logic should not be duplicated throughout route modules.

Design reusable helpers such as:

```ts
requireUser();
requireSpaceMember();
requireSpaceRole();
requireSpaceOwner();
```

The exact API should be proposed before implementation.

---

# 10. Membership Invitations

Do not automatically make Family Spaces an external organization construct.

Our application domain should remain based around:

```text
Space
SpaceMember
```

Evaluate invitation and membership mechanisms when we implement:

- invitations
- invitation acceptance
- membership management
- removal of members
- role changes

Keep the implementation compatible with the existing Space and SpaceMember domain.

Discuss this before implementation.

---

# 11. Weekly Planner

The main experience of the application is the weekly planner.

A weekly plan represents a calendar week.

Example:

```text
Week of August 24

Monday
  Breakfast
  Lunch
  Dinner

Tuesday
  Breakfast
  Lunch
  Dinner

...

Sunday
  Breakfast
  Lunch
  Dinner
```

Initial meal types:

- breakfast
- lunch
- dinner

Design meal types so additional ones could be supported later without major structural changes.

---

# 12. Meals

A Meal represents a specific meal slot on a specific day.

Example:

```text
Monday
└── Lunch
    ├── Lentil salad
    ├── Grilled salmon
    └── Fruit
```

A Meal can contain **multiple recipes/dishes**.

There should be an explicit relation between:

```text
Meal
   ↓
MealRecipe
   ↓
Recipe
```

Do not assume one Meal equals one Recipe.

---

# 13. Servings

Recipes should have a default number of servings.

Example:

```text
Chicken curry
Default servings: 4
```

When assigning a Recipe to a Meal, the user should be able to specify the number of servings.

Example:

```text
Recipe
4 servings
400 g chicken

Meal assignment
6 servings

Required:
600 g chicken
```

Shopping-list quantities should scale according to the selected servings.

Keep this scaling logic in domain code and test it independently from the UI.

---

# 14. Recipes

Recipes are reusable entities belonging to a Space.

A Recipe should initially support:

- id
- spaceId
- name
- description
- instructions
- default servings
- source URL
- optional image
- timestamps

Potential future fields should not be added unless currently useful.

Do not over-model v1.

Recipes must support CRUD operations.

---

# 15. Recipe UX

Creating and editing recipes should not feel like traditional CRUD.

Prefer:

- dialogs
- drawers
- inline interactions
- autocomplete
- comboboxes
- contextual creation
- immediate feedback

For example, editing a recipe should allow ingredients to be added without navigating away from the recipe.

---

# 16. Ingredients

Ingredients should be reusable Space-level entities whenever practical.

Example:

```text
Ingredient

id
spaceId
name
```

A Recipe should not store ingredients simply as one large text field.

Use a relation similar to:

```text
Recipe
   ↓
RecipeIngredient
   ↓
Ingredient
```

`RecipeIngredient` should support information such as:

- quantity
- unit
- notes
- ordering

Example:

```text
500 g chicken breast
2 tbsp olive oil
1 onion
salt to taste
```

Design the exact representation carefully.

---

# 17. Ingredient Creation UX

Ingredient creation must be seamless.

If a user is editing a Recipe and searches for an ingredient that does not exist:

```text
Ingredient

[ Black garlic           ]

No ingredient found.

+ Create "Black garlic"
```

Selecting `Create` should:

1. create the Ingredient;
2. automatically select it;
3. return immediately to the Recipe editing flow.

The user should never need to:

```text
leave recipe
→ open ingredients page
→ create ingredient
→ return to recipe
→ search again
```

This contextual-create pattern should be reused throughout the application where appropriate.

---

# 18. Ingredient Quantities and Units

Support ingredient quantities and units.

Examples:

```text
500 g
1 kg
2 tbsp
250 ml
1 unit
```

Do not build a complex unit-conversion engine in v1.

However, units should be modeled cleanly enough that future normalization is possible.

Before implementation, propose whether units should initially be:

- normalized enums;
- canonical strings;
- database entities;
- or another simpler approach.

Prefer simplicity.

---

# 19. Shopping List

A shopping list should be generated from a weekly plan.

Conceptually:

```text
Weekly Plan
    ↓
Meals
    ↓
Meal Recipes
    ↓
Recipes
    ↓
Recipe Ingredients
    ↓
Quantity scaling
    ↓
Ingredient aggregation
    ↓
Shopping List
```

Example:

```text
Recipe A
300 g chicken

Recipe B
500 g chicken

Shopping List
800 g chicken
```

Where possible, compatible ingredient quantities should be aggregated.

---

# 20. Editable Shopping List

The generated shopping list must become an **editable snapshot**.

Users should be able to:

- mark items as purchased;
- edit quantities;
- remove generated items;
- add manual items;
- optionally group items;
- regenerate/recalculate from the meal plan.

Do not make the shopping list permanently recompute itself from the current meal plan in a way that destroys user edits.

Design how regeneration interacts with manual changes before implementing it.

Potential examples to consider:

```text
Meal plan generated:
800 g chicken

User edits:
1 kg chicken
```

Then Meal Plan changes.

We need a predictable regeneration strategy.

Propose one.

---

# 21. Weekly Planner UX

Planning should be extremely quick.

Example interaction:

```text
Monday
└── Lunch
    ├── Chicken curry
    └── + Add recipe
```

Tapping `+ Add recipe` should allow the user to search and assign a recipe without navigating away from the weekly planner.

Potential interaction:

```text
+ Add recipe

[ Search recipes... ]

Chicken curry
Salmon bowl
Lentil salad

+ Create new recipe
```

If appropriate, use `useFetcher` so mutations occur without navigation.

---

# 22. Mobile UX

The application is **mobile-first**.

Do not try to squeeze seven columns into a mobile screen.

Desktop and mobile layouts may differ.

A possible mobile approach could be:

```text
‹ Monday · Tuesday · Wednesday ›

Tuesday

Breakfast
...

Lunch
...

Dinner
...
```

or another interaction that provides better UX.

Evaluate alternatives before implementation.

Desktop may display several days simultaneously if useful.

Tablet layout should also be considered.

---

# 23. Interaction Principles

CRUD operation does **not** mean CRUD page.

Do not automatically create:

```text
/ingredients/new
/ingredients/:id/edit
/recipes/new
/recipes/:id/edit
```

as the only way to interact with data.

Route-based screens may still exist when useful, but common operations should be contextual.

Prefer:

- dialog
- drawer
- popover
- combobox
- command/search UI
- inline editing
- fetcher mutations
- optimistic feedback when safe

Navigation should occur when the user is genuinely moving to another application context, not merely because a database row needs to be created.

---

# 24. Recipe Import From URL

An important capability is creating Recipes from URLs.

Do not jump directly to AI extraction.

First design the extraction pipeline.

Preferred strategy:

```text
URL
 ↓
Validate URL
 ↓
Fetch server-side
 ↓
Structured Recipe data
 ↓
schema.org / JSON-LD
 ↓
Normalize
 ↓
If unavailable
 ↓
HTML extraction / heuristics
 ↓
If needed in the future
 ↓
AI extraction fallback
 ↓
Normalize
 ↓
Review
 ↓
User confirms
 ↓
Save
```

Structured data should be preferred when available.

---

# 25. Import Review

Imported recipes must never be saved blindly.

The user should receive an editable review UI.

Potential extracted fields:

- name
- description
- servings
- ingredients
- instructions
- image
- source URL

The user should be able to correct them before saving.

---

# 26. Recipe Import Architecture

Before implementing URL imports, discuss:

- server-side URL fetching;
- JSON-LD parsing;
- schema.org Recipe formats;
- sites containing multiple Recipe objects;
- malformed JSON-LD;
- HTML extraction;
- redirects;
- request timeouts;
- maximum response size;
- duplicate recipes;
- duplicate ingredients;
- ingredient normalization;
- unit normalization;
- image URLs;
- remote image storage vs hotlinking;
- sanitizing external HTML;
- SSRF risks;
- localhost/private network protection;
- unsupported protocols;
- failed fetches;
- sites blocking bots;
- rate limiting;
- AI extraction fallback.

The first implementation does not need to solve every possible website.

Build this incrementally.

---

# 27. PWA

The application should be an installable PWA.

Support:

- web app manifest;
- icons;
- appropriate app metadata;
- standalone installation experience;
- service worker where appropriate;
- cached application assets where useful.

However:

## Offline support is NOT required in v1.

The application requires an internet connection for data operations.

Do not implement offline database synchronization.

Do not build conflict-resolution logic.

If the user loses connectivity, provide a good UX explaining that the application currently requires a connection.

---

# 28. Deployment

Deploy on **Netlify**.

Architecture and dependencies should be compatible with:

- React Router 7 Framework Mode;
- Netlify server execution;
- application-owned authentication;
- Turso.

Avoid deployment assumptions based on Next.js or Vercel.

Environment variables and secrets must never be exposed to the browser unless explicitly safe.

---

# 29. Database

Use:

- Turso
- Drizzle ORM

Use Drizzle schema definitions and migrations.

Before creating migrations, propose the relational model.

Initial entities to evaluate include:

```text
User
AuthSession
Space
SpaceMember

WeekPlan
Meal
MealRecipe

Recipe
Ingredient
RecipeIngredient

ShoppingList
ShoppingListItem
```

This list is not necessarily final.

Analyze whether additional entities are required.

Do not create unnecessary tables.

---

# 30. Data Integrity

Use database constraints wherever they provide useful protection.

Consider:

- foreign keys
- unique constraints
- indexes
- cascading behavior
- ordering fields
- createdAt
- updatedAt

Consider uniqueness such as:

```text
SpaceMember
unique(spaceId, userId)
```

but propose the complete strategy before implementation.

---

# 31. Space Isolation

Space data isolation is critical.

Every Space-owned resource must be accessed through Space-aware queries.

Avoid patterns like:

```ts
getRecipe(recipeId);
```

if they allow authorization mistakes.

Prefer APIs that make Space ownership explicit, such as conceptually:

```ts
getRecipe({
  recipeId,
  spaceId,
});
```

or domain services that already operate in an authorized Space context.

Design this so accidentally leaking data between Spaces is difficult.

---

# 32. Validation

Validate data on the server.

Client-side validation exists to improve UX but is not sufficient.

Prefer shared schemas where useful.

Before adding a validation library, evaluate whether it is necessary.

If using one, explain why.

Validation should cover:

- forms;
- IDs;
- quantities;
- servings;
- roles;
- imported URL data;
- external content.

---

# 33. Error Handling

Design error states explicitly.

The UI should distinguish where useful between:

- validation error;
- authentication required;
- authorization denied;
- not found;
- connectivity error;
- server error;
- URL import failure.

Do not silently swallow errors.

Do not expose sensitive internal errors to users.

---

# 34. Pending States

Interactions must have good pending states.

Examples:

```text
Adding recipe...
Creating ingredient...
Updating servings...
Generating shopping list...
Importing recipe...
```

Avoid double submissions.

Use React Router pending/fetcher state where appropriate.

---

# 35. Optimistic UI

Use optimistic UI selectively.

It may be suitable for interactions like:

- marking shopping items purchased;
- adding/removing simple meal assignments;
- reordering items.

Avoid optimistic updates where rollback would create confusing behavior.

Correctness should take precedence over perceived speed.

---

# 36. Accessibility

Accessibility is a requirement.

Use semantic HTML first.

Use ARIA only when necessary.

Ensure:

- keyboard navigation;
- visible focus states;
- accessible dialogs;
- accessible comboboxes;
- appropriate labels;
- sufficient touch target size;
- form error association;
- screen-reader-friendly pending states where relevant.

Do not create custom UI primitives when a well-tested accessible primitive would substantially reduce complexity.

---

# 37. UI Component Strategy

Before installing a large UI framework, discuss the trade-offs.

We want:

- accessible primitives;
- full visual control;
- good mobile behavior;
- low unnecessary complexity.

Do not automatically install a huge component framework.

For sophisticated primitives such as:

- dialogs;
- dropdown menus;
- popovers;
- comboboxes;
- select;
- tooltip;

evaluate suitable accessible primitives before implementing them manually.

---

# 38. Visual Design

The visual language should be:

- clean;
- modern;
- functional;
- food-oriented without becoming decorative;
- friendly;
- easy to scan;
- mobile-friendly;
- information-dense where useful;
- visually restrained.

Avoid generic AI-generated UI characteristics such as excessive:

- cards;
- gradients;
- huge headings;
- shadows;
- rounded containers inside rounded containers.

Use hierarchy intentionally.

The planner should feel like a productivity application.

---

# 39. Project Skills

Use agent skills to reinforce project conventions.

Initial skills should include or be inspired by:

```text
React best practices
Web design / UX guidelines
Frontend design principles
Drizzle best practices
```

We also want project-specific skills.

Create or maintain:

```text
react-router-7-framework
meal-planner-architecture
```

Prefer project-local Agent Skills stored in:

```text
.opencode/skills/
```

when possible so they remain portable between compatible coding agents.

---

# 40. React Router Skill

Our React Router project skill should reinforce principles such as:

```text
Use Framework Mode.

Prefer loaders for route data.

Prefer actions for server mutations.

Use fetchers when a mutation should happen without navigation.

Do not fetch route data from useEffect.

Use Form when navigation/submission semantics are appropriate.

Use route-level pending states.

Use route-level error boundaries.

Keep server-only modules separate from browser-safe modules.

Use generated/typed route APIs.

Avoid unnecessary client-side state duplication.

Do not add a separate API layer without a reason.
```

---

# 41. Meal Planner Architecture Skill

Our domain skill should document invariant rules such as:

```text
All user-generated domain data belongs to a Space.

A User may belong to multiple Spaces.

A Space can be personal or family.

Space membership controls access.

Recipes belong to a Space.

Ingredients belong to a Space.

Week plans belong to a Space.

Shopping lists belong to a Space.

A Meal can contain multiple Recipes.

Recipe ingredients have quantities and units.

Meal recipe assignments have servings.

Shopping lists are generated snapshots and remain editable.
```

The skill should contain domain rules rather than implementation trivia.

---

# 42. Testing

Testing should be designed from the beginning.

Before implementation, propose a lightweight testing strategy.

At minimum consider:

### Unit tests

For domain logic such as:

- serving scaling;
- shopping-list aggregation;
- permission rules;
- ingredient normalization.

### Component/integration tests

For important interactions such as:

- adding a Recipe to a Meal;
- creating an Ingredient inline;
- editing a shopping item;
- switching Space.

### End-to-end tests

For a few critical user journeys.

Potential tooling:

- Vitest
- React Testing Library
- Playwright

Do not create enormous low-value test suites.

Prioritize important domain logic and critical workflows.

---

# 43. Security

Security must be considered from the beginning.

Important areas include:

- application session validation;
- Space authorization;
- CSRF/security expectations of mutations;
- external URL fetching;
- SSRF protection;
- sanitization;
- remote image handling;
- secrets;
- environment variables;
- database isolation;
- unsafe redirects;
- user-provided URLs.

Do not rely on hidden UI controls as authorization.

---

# 44. Engineering Principles

Use:

- TypeScript strict mode;
- explicit domain types;
- small focused components;
- small focused modules;
- reusable domain logic;
- server-side authorization;
- server-side validation;
- semantic HTML;
- progressive enhancement where practical;
- database constraints;
- feature/domain organization where useful.

Avoid:

- `any`;
- unnecessary type assertions;
- giant route components;
- giant service modules;
- premature abstractions;
- unnecessary repositories/interfaces;
- unnecessary dependency injection;
- duplicated business logic;
- global state by default;
- unnecessary third-party dependencies;
- one-screen-per-database-operation CRUD design;
- excessive generic abstractions;
- speculative functionality.

Prefer simple code.

---

# 45. Naming

Use clear domain terminology consistently.

Prefer:

```text
Meal
Recipe
Ingredient
Weekly Plan
Shopping List
Space
Space Member
```

Avoid ambiguous terminology such as `plate` when `Recipe` or `MealRecipe` expresses the concept more accurately.

---

# 46. Suggested Application Areas

The primary application areas will probably include:

```text
Weekly Planner

Recipes

Shopping List

Space / Family Management

User Settings
```

Admin functionality should remain separate from normal application functionality.

Do not assume this translates directly into the final route tree.

Propose routes based on UX and architecture.

---

# 47. Initial Design Phase

Before implementing the full application, perform a design phase.

Provide:

## A. Requirements review

Summarize the product and identify any unresolved requirements.

Do not ask questions about decisions already established in this document.

Only surface ambiguities that materially affect implementation.

---

## B. Domain model

Propose the domain entities and relationships.

Show them clearly.

For example:

```text
User
 └── SpaceMember
       └── Space
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

Refine this rather than assuming it is correct.

---

## C. Database schema proposal

Before migrations, propose:

- Drizzle tables;
- important columns;
- relations;
- foreign keys;
- indexes;
- unique constraints;
- cascade behavior.

Explain important decisions.

Do not generate all migrations yet.

---

## D. Authorization model

Explain:

- application authentication responsibilities;
- application admin role;
- Space roles;
- active Space;
- loader/action authorization;
- shared authorization helpers.

---

## E. Application route structure

Propose the React Router route hierarchy.

Explain which areas should be full routes and which interactions should use contextual dialogs/drawers/fetchers.

---

## F. Weekly Planner UX

Propose:

- mobile layout;
- tablet layout;
- desktop layout;
- meal editing;
- recipe search;
- recipe assignment;
- servings editing.

ASCII wireframes are welcome when they improve clarity.

---

## G. Recipe management UX

Propose:

- recipe list;
- search;
- create/edit;
- ingredient selection;
- inline ingredient creation;
- instructions editing.

---

## H. Shopping List UX

Propose:

- generation flow;
- aggregation;
- editable snapshot behavior;
- checked state;
- manual items;
- regeneration strategy.

---

## I. Recipe Import architecture

Propose an incremental architecture for:

```text
JSON-LD
→ HTML fallback
→ future AI fallback
```

including security considerations.

---

## J. PWA architecture

Explain:

- manifest;
- service worker;
- asset caching;
- installability;
- online-required UX.

Do not implement offline data synchronization.

---

## K. Deployment architecture

Explain how:

```text
React Router
Application authentication
Turso
Netlify
```

will work together.

Identify any deployment constraints early.

---

## L. Testing strategy

Propose which parts deserve:

- unit tests;
- integration tests;
- E2E tests.

Keep the strategy pragmatic.

---

# 48. Implementation Plan

After the architecture is agreed, divide implementation into small milestones.

A possible shape might be:

```text
Milestone 0
Project foundation

Milestone 1
Authentication + Spaces

Milestone 2
Ingredients

Milestone 3
Recipes

Milestone 4
Weekly Planner

Milestone 5
Shopping List

Milestone 6
Recipe URL Import

Milestone 7
PWA polish

Milestone 8
Family sharing / invitations

Milestone 9
Admin functionality
```

Do not assume this order is final.

Propose improvements if dependencies suggest a better order.

Each milestone should be independently reviewable.

Avoid implementing multiple large product areas in one step.

---

# 49. Working Style

When implementing:

1. explain the next small objective;
2. inspect the existing code before modifying it;
3. avoid rewriting unrelated code;
4. make focused changes;
5. run relevant checks;
6. fix errors introduced by the change;
7. summarize what changed;
8. mention important remaining decisions;
9. stop at sensible review points instead of racing through the entire roadmap.

Do not create speculative abstractions for future milestones.

---

# 50. First Task

For the first response to this prompt:

**Do not build the application yet.**

Instead provide:

1. your understanding of the product;
2. any material remaining ambiguities;
3. the proposed domain model;
4. the proposed Drizzle schema at a conceptual level;
5. the authorization architecture;
6. the proposed React Router route architecture;
7. the proposed UX structure for mobile and desktop;
8. the proposed shopping-list generation/regeneration model;
9. the recipe URL import architecture;
10. recommended supporting libraries, explaining why each one is necessary;
11. the testing strategy;
12. a milestone-based implementation roadmap.

Be opinionated when there is a clear engineering advantage, but explain important trade-offs.

Prefer simplicity over theoretical flexibility.

Wait for architectural agreement before implementing the full application.
