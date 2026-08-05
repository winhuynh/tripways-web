# Tripways Web

A small Next.js interface for learning and testing the Tripways Route Discovery foundation against
local Supabase. It deliberately separates stored route schedules from future live price search.

## Requirements

- Node.js 20 or newer
- pnpm 11
- Supabase CLI and Docker
- The sibling `tripways-backend` repository

## Local setup

Install dependencies:

```bash
pnpm install
```

Start or inspect Supabase from the backend repository:

```bash
cd ../tripways-backend
supabase start
supabase status -o env
```

Create a local environment file in this repository without committing it:

```bash
cp .env.example .env.local
```

Set `SUPABASE_URL` to the reported `API_URL` and `SUPABASE_ANON_KEY` to the reported `ANON_KEY`.
The web calls the Route Discovery Edge boundary and never receives a service-role key. Then start
the web app:

```bash
pnpm dev
```

Open the four public page families:

- `http://localhost:3000/`
- `http://localhost:3000/flights-from/bangkok`
- `http://localhost:3000/flights/bangkok-to-london`
- `http://localhost:3000/airports/suvarnabhumi-bkk`

Page shells load immutable canonical read models through `page-query`. Interactive route filters use
`route-search-query`. Fixture data is development-only and remains non-indexable through backend
publication metadata.

## Quality checks

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
```

## Current boundary

Implemented: Homepage, City Hub, Route Page, journey-led Airport Page, typed page readers, shared
route-search models, and responsive semantic UI. Skipped intentionally: auth, live prices, dated
availability, booking, unapproved affiliate offers, CMS, deployment, and production publication.
