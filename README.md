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

Open:

- `http://localhost:3000/`
- `http://localhost:3000/flights-from/SGN`
- `http://localhost:3000/routes/SGN/LHR`

The SGN to LHR development fixture should return two direct routes and one valid one-stop route via
SIN. Fixture data is development-only and must not be used for production or indexable pages.

## Quality checks

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
```

## Current boundary

Implemented: fixture airport navigation, stored route filters, Route Discovery RPC loading, and
responsive route pages. Skipped intentionally: auth, live prices, dated availability, booking,
real map tiles, newsletter persistence, CMS, deployment, and production pSEO publication.
