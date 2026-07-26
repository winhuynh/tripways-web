# Web Code Organization and Documentation Design

## Goal

Make every route in `tripways-web` easy to navigate and learn from by separating route
composition, server data loading, use cases, infrastructure adapters, and UI components. Add
responsibility-focused documentation without changing rendered UI, backend contracts, or runtime
behaviour.

## Scope

This refactor covers the complete route surface currently under `src/app`:

- `/`
- `/flights-from/[citySlug]`
- `/api/city-page/destinations`
- Root layout and route loading UI where documentation is useful

It also covers the public boundaries directly used by those routes:

- `home-page`
- `city-page`
- `route-map`
- `route-discovery`
- `advertising`
- Shared editorial UI

The refactor does not change PostgreSQL RPCs, Supabase Edge Functions, seed data, visual design,
page content, SEO policy, cache duration, or existing URL/query contracts.

## Architecture

### Route Layer

Files under `src/app` remain framework entry points. They own only Next.js concerns:

- Route params and search params
- Metadata entry points
- Route-level composition
- HTTP request/response adaptation
- Route-level loading and not-found behaviour

Route files must not contain reusable UI components, DTO parsing, repository construction, or
multiple independent read-model loader implementations.

### Feature Layer

Each feature keeps one-directional dependencies:

```text
presentation -> application -> domain
infrastructure -> application/domain
server composition -> infrastructure + application
route -> feature public API
```

The expected folders are:

```text
feature/
├── application/
├── domain/
├── infrastructure/
├── presentation/
├── server.ts
└── index.ts
```

Not every feature must contain every folder. A folder is added only when it owns a real
responsibility.

### Page Composition

#### Homepage

The homepage route remains a small Server Component. Its feature owns:

- The homepage read-model use case
- The page-level composition component
- Hero, corridor, route-map, value-proposition, and directory UI sections

The route imports one public page composition rather than manually assembling presentation
details.

#### City Hub

The City Hub feature owns a server page composition and focused server section loaders. Each
loader:

- Calls one independently cached read model or one intentionally grouped query
- Handles its own available, empty, and unavailable state
- Passes a validated domain model to a presentation component

The dynamic route retains only identity resolution, metadata delegation, and the feature page
entry point. Destination, map, filters, insights, airport, FAQ, and internal-link loaders no
longer live as local functions in the route file.

#### Destination API

The API route remains a thin Next.js transport:

1. Parse supported query parameters.
2. Create the application query.
3. Call the route-discovery use case.
4. Normalize success or error into an HTTP response.

Parsing and error mapping become focused functions outside the route when they are independently
testable or reusable.

## UI Organization

React UI remains under each feature's `presentation` folder. A presentation file should own one
recognizable visual responsibility, such as:

- `CityHero`
- `CityDestinationsSection`
- `CityAirportOperations`
- `HomeCorridors`
- `AdSlot`

A file may retain small private rendering helpers when they are inseparable from that component.
Reusable UI primitives shared by two or more features belong under `src/shared/ui`.

The refactor must not create one-file-per-trivial-helper fragmentation. Files are split when they
mix route orchestration, data loading, and visual rendering, or when they contain multiple
independently understandable UI sections.

## Documentation Convention

### File Responsibility

Files with non-obvious boundaries begin with a short file-level JSDoc block explaining their
role. JSX-only presentation files may rely on the exported component JSDoc when the filename and
component already make the responsibility clear.

### Exported Boundaries

Add JSDoc to exported:

- React components
- Server composition functions
- Application use cases and query builders
- Repository contracts and repository factories
- External response parsers
- Route handlers when their transport flow is non-trivial

Documentation explains:

- What responsibility the unit owns
- Which layer supplies its input
- What it returns or renders
- Important caching, fallback, validation, or security behaviour

### Internal Helpers

Private helpers receive comments only when their intent, data assumption, or edge-case policy is
not obvious from their name and type signature.

Do not add comments that repeat syntax, restate the function name, or narrate individual JSX
elements. All code comments and JSDoc remain in English to follow repository rules.

### Orchestration Comments

Use sparse section comments to make multi-stage flow scannable:

```ts
// Resolve the indexable page identity before loading optional sections.
```

Section comments are appropriate for:

- Server orchestration
- Fallback/error normalization
- Independent Suspense/read-model boundaries
- External contract validation
- Client lifecycle cleanup

## Public APIs

Each feature `index.ts` exports only the units routes or other features are allowed to use.
Internal DTO helpers, environment readers, and implementation-specific components remain private
to the feature.

Barrel files must not introduce circular imports or expose every file by default.

## Behaviour Preservation

This is an architecture and documentation refactor. The following must remain unchanged:

- Existing HTML hierarchy and CSS class names unless a split requires a semantically equivalent
  wrapper
- Metadata values and indexability
- City Page Edge action names and request envelopes
- Route-map interactivity and MapLibre styling
- Destination filtering behaviour
- Cache tags and revalidation periods
- Existing fallback, empty, unavailable, and not-found behaviour
- Bangkok and Singapore local rendering

Known product gaps such as destination text search, airline filters, seasonality wording, and
provider-backed newsletter/advertising are documented separately and are not silently fixed in
this refactor.

## Testing Strategy

### Architecture Contracts

Add focused tests that verify:

- Route files remain thin and do not declare page-section loader functions
- Feature page composition is exported through the feature public API
- API parsing and error mapping remain isolated from the route handler

These tests protect the intended organization without asserting arbitrary line counts.

### Behaviour Tests

Preserve and run existing:

- Homepage render tests
- City Page presentation tests
- DTO validation tests
- Route-map tests
- Route-discovery tests
- Shared site chrome tests

Add tests first when moving non-trivial parsing, fallback, or orchestration logic.

### Verification

Before completion, run:

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
git diff --check
```

Verify these routes at desktop and mobile widths:

- `/`
- `/flights-from/bangkok`
- `/flights-from/singapore`

## Delivery Constraints

- Work directly on `main` as previously authorized.
- Preserve all existing user changes.
- Do not commit, push, deploy, or modify backend/external services.
- Keep the refactor incremental so every completed task leaves tests green.
- Avoid speculative base classes, factories, generic page engines, or dependency-injection
  containers.
