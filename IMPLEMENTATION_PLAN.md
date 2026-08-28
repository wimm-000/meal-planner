# Weekly Meal Planner — Implementation Plan

This document is the execution roadmap for the Weekly Meal Planner project.

The goal is to implement the application in **small, reviewable milestones**, avoiding large batches of unrelated work.

Use this together with:

- `MASTER_PROMPT.md` — full product and architecture brief
- `AGENTS.md` — durable coding-agent rules
- project skills under `.opencode/skills/`

---

# Guiding Rules

- Work one milestone at a time.
- Do not implement future abstractions before they are needed.
- Keep all user-generated domain data scoped to a `Space`.
- Enforce authentication and authorization server-side.
- Prefer React Router loaders/actions/fetchers over client-side fetching patterns.
- Keep important domain logic outside React components.
- Add tests alongside important domain logic and critical workflows.
- Mobile-first UX is a requirement.
- CRUD operations should not automatically become separate pages.
- PWA installation is required, but offline data synchronization is not part of v1.

---

# Milestone 0 — Project Foundation

## Repository and application setup

- [x] Create the React Router 7 project in **Framework Mode**
- [x] Enable TypeScript strict mode
- [x] Configure Vite
- [x] Install and configure Tailwind CSS
- [x] Configure project aliases/import conventions
- [x] Define initial folder/module structure
- [x] Add `.env.example`
- [x] Ensure secrets are never exposed to the browser
- [x] Add basic error boundary structure
- [x] Add basic loading/pending-state conventions

## Netlify

- [x] Configure the project for Netlify deployment
- [ ] Verify React Router server execution on Netlify
- [x] Define required environment variables
- [ ] Create a minimal deployment early
- [ ] Verify server-side routes/actions work in deployed environment

## Quality tooling

- [x] Configure linting
- [x] Configure formatting
- [x] Configure type-check command
- [x] Configure Vitest
- [x] Configure React Testing Library
- [x] Configure Playwright
- [x] Add standard project commands for:
  - [x] dev
  - [x] build
  - [x] typecheck
  - [x] lint
  - [x] test
  - [x] test:e2e

## Agent setup

- [x] Add `AGENTS.md`
- [x] Add `MASTER_PROMPT.md`
- [x] Add project-local skills directory
- [x] Add `react-router-7-framework` skill
- [x] Add `meal-planner-architecture` skill
- [x] Add/enable React best-practices skill
- [x] Add/enable UX/web-design guidelines skill
- [x] Add/enable frontend-design skill
- [x] Add/enable Drizzle best-practices skill

## Definition of done

- [x] App runs locally
- [x] App builds successfully
- [ ] App deploys successfully to Netlify
- [x] Type checking passes
- [x] Test infrastructure is working
- [ ] Agent/project instructions are committed

---

# Milestone 1 — Database, Authentication and Spaces

This milestone establishes the security and tenancy model before any meal-planning data exists.

## Turso + Drizzle

- [ ] Create Turso database
- [ ] Configure database connection
- [ ] Configure Drizzle ORM
- [ ] Configure Drizzle migrations
- [ ] Establish migration workflow
- [ ] Verify migrations locally and against Turso

## Better Auth

- [ ] Install Better Auth
- [ ] Configure Better Auth with the chosen authentication method(s)
- [ ] Add Better Auth database tables
- [ ] Integrate session handling with React Router
- [ ] Create login flow
- [ ] Create signup flow
- [ ] Create logout flow
- [ ] Add protected application layout
- [ ] Add session-aware loaders

## System roles

- [ ] Add system-level role support:
  - [ ] `user`
  - [ ] `admin`
- [ ] Keep system roles separate from Space roles

## Spaces

- [ ] Add `Space` table
- [ ] Add Space type:
  - [ ] `personal`
  - [ ] `family`
- [ ] Add `SpaceMember` table
- [ ] Add membership roles:
  - [ ] `owner`
  - [ ] `admin`
  - [ ] `member`
- [ ] Add unique constraint for `(spaceId, userId)`
- [ ] Add appropriate indexes
- [ ] Define deletion/cascade rules

## Personal Space provisioning

- [ ] Automatically create a personal Space for a new user
- [ ] Add the user as `owner`
- [ ] Ensure provisioning is idempotent
- [ ] Test account creation + personal Space provisioning

## Active Space

- [ ] Decide how active Space is represented in URLs/session/preferences
- [ ] Implement active Space resolution
- [ ] Add Space switcher UI
- [ ] Verify active Space membership server-side
- [ ] Provide sensible default Space selection
- [ ] Handle users belonging to multiple Spaces

## Authorization helpers

- [ ] `requireUser()`
- [ ] `requireSpaceMember()`
- [ ] `requireSpaceRole()`
- [ ] `requireSpaceOwner()`
- [ ] Add shared authorization error handling
- [ ] Add tests for role/permission behavior
- [ ] Verify no loader/action trusts client-side permissions

## Definition of done

- [ ] User can sign up, log in and log out
- [ ] Every user receives a personal Space
- [ ] User can switch between Spaces they belong to
- [ ] Unauthorized Space access is blocked server-side
- [ ] Authorization helpers are reusable by future features

---

# Milestone 2 — Ingredients

Ingredients are implemented before Recipes because Recipe editing depends on them.

## Data model

- [ ] Add `Ingredient` table
- [ ] Scope Ingredient to `spaceId`
- [ ] Add name
- [ ] Add timestamps
- [ ] Define ingredient-name uniqueness strategy
- [ ] Add search/index strategy

## Domain operations

- [ ] List ingredients for active Space
- [ ] Search ingredients
- [ ] Create ingredient
- [ ] Rename ingredient
- [ ] Delete ingredient safely
- [ ] Prevent cross-Space access

## UX

- [ ] Create Ingredient management screen
- [ ] Add fast search/filter
- [ ] Add create interaction
- [ ] Add edit interaction
- [ ] Add delete interaction with appropriate confirmation
- [ ] Build reusable Ingredient combobox/autocomplete
- [ ] Support contextual creation from combobox
- [ ] Automatically select newly created Ingredient
- [ ] Do not navigate away during contextual creation

## Validation

- [ ] Reject empty names
- [ ] Normalize whitespace
- [ ] Define case-sensitivity/duplicate behavior
- [ ] Handle duplicate creation gracefully

## Tests

- [ ] Ingredient CRUD domain tests
- [ ] Space-isolation tests
- [ ] Ingredient search tests
- [ ] Inline-create interaction test

## Definition of done

- [ ] Ingredients can be fully managed
- [ ] Ingredient selector is reusable by Recipe editor
- [ ] New Ingredients can be created inline without navigation

---

# Milestone 3 — Recipes

## Data model

- [ ] Add `Recipe` table
- [ ] Include `spaceId`, name, description, instructions, default servings, source URL, optional image and timestamps
- [ ] Add `RecipeIngredient` table
- [ ] Include recipeId, ingredientId, quantity, unit, notes and ordering
- [ ] Add indexes and constraints
- [ ] Define cascade behavior

## Units

- [ ] Decide canonical unit representation
- [ ] Define supported common units
- [ ] Support unit-less ingredients
- [ ] Avoid complex automatic conversion in v1
- [ ] Document which units may be aggregated later

## Domain logic

- [ ] Create Recipe
- [ ] Read Recipe
- [ ] Update Recipe
- [ ] Delete Recipe
- [ ] Search Recipes
- [ ] Add RecipeIngredient
- [ ] Edit RecipeIngredient
- [ ] Remove RecipeIngredient
- [ ] Reorder RecipeIngredients
- [ ] Validate default servings
- [ ] Prevent cross-Space references

## Recipe list UX

- [ ] Responsive Recipe list
- [ ] Search/filter
- [ ] Clear empty state
- [ ] Quick create action
- [ ] Recipe summary/detail view

## Recipe editor UX

- [ ] Edit name
- [ ] Edit description
- [ ] Edit default servings
- [ ] Edit instructions
- [ ] Edit source URL
- [ ] Edit optional image
- [ ] Add Ingredients using combobox
- [ ] Create missing Ingredient inline
- [ ] Edit quantity/unit/notes
- [ ] Reorder Ingredients
- [ ] Remove Ingredient
- [ ] Handle pending states cleanly
- [ ] Handle validation errors inline

## Tests

- [ ] Recipe CRUD tests
- [ ] RecipeIngredient tests
- [ ] Space-isolation tests
- [ ] Serving input validation tests
- [ ] Recipe editor interaction test
- [ ] Inline Ingredient creation while editing Recipe

## Definition of done

- [ ] Recipes can be created and edited efficiently
- [ ] Ingredients can be managed entirely inside Recipe editing flow
- [ ] Recipe data is correctly isolated by Space

---

# Milestone 4 — Weekly Planner

This is the primary product experience.

## Data model

- [ ] Add `WeekPlan` table
- [ ] Scope to Space
- [ ] Define week-start representation
- [ ] Prevent duplicate plans for same Space/week if appropriate
- [ ] Add `Meal` table
- [ ] Represent day/date and meal type
- [ ] Add meal types:
  - [ ] breakfast
  - [ ] lunch
  - [ ] dinner
- [ ] Add `MealRecipe` table
- [ ] Include mealId, recipeId, servings and ordering

## Week/date domain utilities

- [ ] Define week-start convention
- [ ] Add previous-week navigation
- [ ] Add next-week navigation
- [ ] Add current-week navigation
- [ ] Add locale-aware display
- [ ] Add tests around week boundaries/year changes

## Planner loaders/actions

- [ ] Load week plan for active Space
- [ ] Create plan lazily or explicitly
- [ ] Add Recipe to Meal
- [ ] Remove Recipe from Meal
- [ ] Change servings
- [ ] Reorder Recipes within a Meal
- [ ] Handle empty Meals
- [ ] Enforce Space authorization everywhere

## Mobile UX

- [ ] Design day navigation
- [ ] Show Breakfast/Lunch/Dinner clearly
- [ ] Make add-recipe action prominent
- [ ] Use touch-friendly controls
- [ ] Keep week switching fast
- [ ] Avoid seven compressed columns

## Desktop/tablet UX

- [ ] Design multi-day/week view
- [ ] Keep scanability high
- [ ] Avoid excessive card nesting
- [ ] Support quick meal editing

## Add Recipe flow

- [ ] Open contextual Recipe search
- [ ] Search existing Recipes
- [ ] Add Recipe without leaving planner
- [ ] Support multiple Recipes per Meal
- [ ] Set/edit servings during assignment
- [ ] Optionally launch Recipe creation from the same flow
- [ ] Return to Meal context after Recipe creation

## Pending and optimistic UX

- [ ] Pending state when adding Recipe
- [ ] Pending state when removing Recipe
- [ ] Pending state when changing servings
- [ ] Prevent duplicate submissions
- [ ] Use optimistic updates only where rollback is predictable

## Tests

- [ ] Add Recipe to Meal
- [ ] Add multiple Recipes to same Meal
- [ ] Remove Recipe
- [ ] Change servings
- [ ] Space-isolation tests
- [ ] Week-navigation tests
- [ ] Critical responsive planner E2E flow

## Definition of done

- [ ] A user can plan Breakfast/Lunch/Dinner for a full week
- [ ] Each Meal supports multiple Recipes
- [ ] Recipe assignment requires no page navigation
- [ ] Planner works well on mobile and desktop

---

# Milestone 5 — Shopping List

## Data model

- [ ] Add `ShoppingList` table
- [ ] Link ShoppingList to Space
- [ ] Link ShoppingList to WeekPlan where appropriate
- [ ] Add `ShoppingListItem` table
- [ ] Support ingredient reference when generated
- [ ] Support manual text item
- [ ] Support quantity and unit
- [ ] Support purchased state
- [ ] Track manual/generated source
- [ ] Add ordering/grouping if required
- [ ] Add metadata needed for predictable regeneration

## Generation domain logic

- [ ] Gather WeekPlan Meals
- [ ] Gather MealRecipes
- [ ] Scale RecipeIngredient quantities based on servings
- [ ] Aggregate identical Ingredients
- [ ] Aggregate only compatible units
- [ ] Preserve incompatible units separately
- [ ] Handle ingredients without quantity
- [ ] Handle ingredients without unit
- [ ] Produce deterministic output

## Snapshot behavior

- [ ] Generate Shopping List as editable snapshot
- [ ] Keep generated list stable after creation
- [ ] Do not silently overwrite user edits

## Editable list UX

- [ ] Mark item purchased/unpurchased
- [ ] Edit quantity
- [ ] Edit unit
- [ ] Remove item
- [ ] Add manual item
- [ ] Reorder/group if useful

## Regeneration strategy

- [ ] Detect Meal Plan changes since generation
- [ ] Define how regeneration treats untouched generated items
- [ ] Define how regeneration treats manually edited generated items
- [ ] Preserve manual items
- [ ] Avoid silently discarding intentional user edits
- [ ] Add clear confirmation/explanation where needed

## Tests

- [ ] Serving-scaling unit tests
- [ ] Ingredient aggregation unit tests
- [ ] Incompatible-unit tests
- [ ] Manual-item preservation tests
- [ ] Regeneration tests
- [ ] Purchased-state interaction test

## Definition of done

- [ ] Shopping List can be generated from a week
- [ ] Quantities respect Meal servings
- [ ] Compatible ingredients aggregate correctly
- [ ] User can edit the generated snapshot safely

---

# Milestone 6 — Recipe Import From URL

Implement incrementally.

## Secure URL fetcher

- [ ] Accept only supported protocols
- [ ] Validate URLs
- [ ] Block localhost
- [ ] Block private network ranges
- [ ] Handle redirects safely
- [ ] Set request timeout
- [ ] Set maximum response size
- [ ] Handle unsupported content types
- [ ] Add rate limiting if needed

## Structured-data extraction

- [ ] Fetch page server-side
- [ ] Parse JSON-LD
- [ ] Detect `schema.org/Recipe`
- [ ] Handle JSON-LD arrays/graphs
- [ ] Handle multiple Recipe objects
- [ ] Extract name, description, servings/yield, ingredients, instructions, image and source URL

## Normalization

- [ ] Normalize Recipe fields
- [ ] Parse ingredient lines where practical
- [ ] Match existing Ingredients where reliable
- [ ] Avoid destructive or overconfident normalization
- [ ] Preserve raw imported values for review when useful

## Review UX

- [ ] Import-by-URL entry point
- [ ] Import pending state
- [ ] Friendly extraction errors
- [ ] Show editable preview
- [ ] Allow user corrections
- [ ] Match/create Ingredients during review
- [ ] Save only after explicit confirmation

## Fallback extraction

- [ ] Evaluate HTML heuristic extraction after JSON-LD works reliably
- [ ] Add HTML fallback only if it materially improves coverage
- [ ] Keep AI extraction as a later fallback, not the primary path

## Tests

- [ ] URL validation tests
- [ ] SSRF protection tests
- [ ] JSON-LD parser fixture tests
- [ ] Multiple Recipe object tests
- [ ] Malformed JSON-LD tests
- [ ] Normalization tests
- [ ] Import review E2E test

## Definition of done

- [ ] User can paste a supported Recipe URL
- [ ] Structured Recipe data is extracted safely
- [ ] User reviews/edits before saving
- [ ] Imported Recipe becomes normal Space-owned Recipe data

---

# Milestone 7 — Family Sharing and Membership Management

## Invitation architecture

- [ ] Re-evaluate Better Auth Organization plugin specifically for invitations/membership management
- [ ] Decide between selective Better Auth Organization capabilities or application-owned invitations
- [ ] Keep `Space` / `SpaceMember` as the application domain model

## Family Space management

- [ ] Create Family Space
- [ ] Rename Family Space
- [ ] Show members
- [ ] Invite member
- [ ] Accept invitation
- [ ] Decline invitation
- [ ] Remove member
- [ ] Change member role
- [ ] Leave Space
- [ ] Transfer ownership if needed

## Permission rules

Define exactly who can:

- [ ] edit meal plans
- [ ] manage Recipes
- [ ] manage Ingredients
- [ ] edit Shopping Lists
- [ ] invite users
- [ ] remove users
- [ ] change roles
- [ ] delete Family Space

## Edge cases

- [ ] Prevent removal of final owner
- [ ] Handle expired/revoked invitations
- [ ] Prevent duplicate membership
- [ ] Prevent unauthorized role escalation

## Tests

- [ ] Invitation flow
- [ ] Role-change permissions
- [ ] Member removal
- [ ] Final-owner protection
- [ ] Cross-Space isolation

## Definition of done

- [ ] A family can share one Space
- [ ] Membership and roles are safely managed
- [ ] Personal and Family Spaces continue to use the same core domain model

---

# Milestone 8 — PWA and Product Polish

## PWA

- [ ] Add web app manifest
- [ ] Define app name and short name
- [ ] Add PWA icons
- [ ] Add favicon
- [ ] Add theme/background metadata
- [ ] Configure standalone display
- [ ] Add service worker if appropriate
- [ ] Cache only safe static/app-shell assets
- [ ] Verify installation on iOS
- [ ] Verify installation on Android/Desktop where practical

## Connectivity UX

- [ ] Detect obvious connectivity loss
- [ ] Show clear offline state/banner
- [ ] Disable or explain operations that require network
- [ ] Handle failed network mutations gracefully
- [ ] Do not queue offline mutations

## Accessibility review

- [ ] Keyboard navigation
- [ ] Focus management
- [ ] Dialog accessibility
- [ ] Combobox accessibility
- [ ] Labels and descriptions
- [ ] Form-error associations
- [ ] Touch target sizes
- [ ] Pending-state announcements where appropriate
- [ ] Color contrast

## Responsive review

- [ ] Small phone
- [ ] Large phone
- [ ] Tablet portrait
- [ ] Tablet landscape
- [ ] Desktop
- [ ] Large desktop

## UX review

- [ ] Review Weekly Planner flow
- [ ] Review Recipe editor
- [ ] Review inline Ingredient creation
- [ ] Review Shopping List
- [ ] Review Space switching
- [ ] Remove unnecessary navigation
- [ ] Remove visual clutter
- [ ] Ensure common actions are fast

## Performance

- [ ] Review route-level code splitting
- [ ] Review bundle size
- [ ] Optimize expensive loaders/queries
- [ ] Add appropriate database indexes
- [ ] Review image loading
- [ ] Avoid unnecessary re-renders

## Definition of done

- [ ] App is installable
- [ ] Connectivity failures have clear UX
- [ ] Critical flows pass accessibility review
- [ ] Mobile and desktop experiences are polished

---

# Milestone 9 — System Admin

## Admin authorization

- [ ] Enforce system `admin` role server-side
- [ ] Create separate admin route/layout
- [ ] Prevent normal users from accessing admin functionality

## Initial admin capabilities

- [ ] User overview
- [ ] Basic Space overview if operationally useful
- [ ] Account status/diagnostic information if needed
- [ ] Avoid building unnecessary back-office tooling

## Tests

- [ ] Admin route authorization
- [ ] Normal-user denial
- [ ] Critical admin actions

---

# Cross-Cutting Tasks

## Security

- [ ] Session validation
- [ ] Server-side authorization
- [ ] Space isolation
- [ ] Input validation
- [ ] Safe redirects
- [ ] Secret management
- [ ] External URL security
- [ ] Sanitization where external HTML/content is involved

## Data integrity

- [ ] Foreign keys
- [ ] Unique constraints
- [ ] Useful indexes
- [ ] Safe cascade behavior
- [ ] Transactions for multi-step writes where needed

## Error handling

- [ ] Authentication errors
- [ ] Authorization errors
- [ ] Validation errors
- [ ] Not found
- [ ] Connectivity failures
- [ ] Server failures
- [ ] Import failures

## Loading/pending states

- [ ] Avoid double submissions
- [ ] Use fetcher/navigation state
- [ ] Provide visible feedback for mutations
- [ ] Prefer local pending feedback over blocking whole pages

## Testing

- [ ] Add tests when domain rules are introduced
- [ ] Add integration tests for complex interactions
- [ ] Keep a small critical-path Playwright suite
- [ ] Do not chase meaningless coverage percentages

---

# MVP Cut

The first genuinely useful MVP should include:

- [ ] Milestone 0 — Project Foundation
- [ ] Milestone 1 — Authentication and Spaces
- [ ] Milestone 2 — Ingredients
- [ ] Milestone 3 — Recipes
- [ ] Milestone 4 — Weekly Planner
- [ ] Milestone 5 — Shopping List
- [ ] Basic PWA installation from Milestone 8

The following can safely follow the core MVP:

- [ ] Recipe URL Import
- [ ] Family invitations/sharing UX
- [ ] deeper PWA polish
- [ ] system admin tooling

---

# Suggested Implementation Order

```text
0. Foundation
   ↓
1. Auth + Database + Spaces
   ↓
2. Ingredients
   ↓
3. Recipes
   ↓
4. Weekly Planner
   ↓
5. Shopping List
   ↓
6. Recipe URL Import
   ↓
7. Family Sharing
   ↓
8. PWA / Accessibility / UX Polish
   ↓
9. System Admin
```

---

# Decisions to Make During Implementation

- [ ] Authentication providers for Better Auth
- [ ] Exact active-Space persistence strategy
- [ ] UI primitive/component library
- [ ] Validation library, if any
- [ ] Ingredient name uniqueness/case-normalization rules
- [ ] Unit representation for v1
- [ ] Exact Shopping List regeneration semantics
- [ ] Recipe image storage vs remote image URLs
- [ ] Whether HTML recipe extraction is worth implementing after JSON-LD
- [ ] Whether Better Auth Organizations should help with family invitations
- [ ] Exact owner/admin/member permission matrix

---

# First Development Task

Start with **Milestone 0 only**.

Before writing feature code:

1. inspect the current repository;
2. propose the initial project structure;
3. verify current React Router 7 / Netlify / Better Auth / Drizzle compatibility using official documentation where needed;
4. install only the dependencies required for the foundation;
5. establish lint/typecheck/test/build commands;
6. deploy the minimal application to Netlify;
7. stop for review before moving into authentication and database domain work.

Do not implement Recipes, Ingredients, Weekly Planner, or Shopping Lists during Milestone 0.
