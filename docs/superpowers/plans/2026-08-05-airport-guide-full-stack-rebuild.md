# Airport Guide Full-Stack Rebuild Implementation Plan

> **For agentic workers:** Execute inline with TDD. Do not commit, push, or deploy.

**Goal:** Replace the legacy airport page with the approved journey-led Airport Guide across the Supabase contract and Next.js frontend.

**Architecture:** PostgreSQL owns reviewed journey content, directional ground access, lounge provenance, publishability, and verified nonstop route eligibility. The server-rendered airport page loads the editorial read model and one direction-aware route result; a small client tab component owns only Arrival/Departure interaction while verified flights remains available beneath either state.

**Tech Stack:** PostgreSQL 17, Supabase SQL source generation, Deno contract tests, Next.js, React, TypeScript, Vitest.

---

### Task 1: Lock the new contracts with failing tests

- [x] Extend SQL source contract tests to reject `airport_facts` and `airport_content_sections` and require directional access/lounge fields.
- [x] Extend airport DTO tests for direction, boarding location, best-for, lounge source/freshness/affiliate fields, and route freshness.
- [x] Extend screen tests for overview → connections → journey tabs → verified flights ordering and both journey states.
- [x] Run focused tests and observe failures caused by the missing contract/UI.

### Task 2: Remove airport legacy schema and complete the new payload

- [x] Remove the unused airport facts/content-section schema sources and generator entries.
- [x] Remove legacy seed and read-model wrapping dependencies.
- [x] Add maintained lounge access, operating window, estimated price, affiliate URL, source, and freshness fields.
- [x] Ensure payload exposes complete directional transport and lounge data plus route refresh provenance.
- [x] Regenerate deterministic migrations.

### Task 3: Implement the Airport Guide frontend contract

- [x] Expand the domain model and strict DTO parser.
- [x] Add accessible server-rendered tabs with URL-backed `journey` state.
- [x] Render airport overview and quick answers first.
- [x] Render Bangkok ↔ airport direction controls and direction-specific transport cards before journey tabs.
- [x] Render Arrival and Departure panels, with lounge utility only in Departure.
- [x] Keep Verified Flights beneath the active journey and available in both states.
- [x] Remove legacy airport actions, sequential journey layout, and unused styling.

### Task 4: Local database and application QA

- [x] Run backend format/check/tests and schema/security contract checks.
- [x] Rebuild local Supabase from generated migrations and seed.
- [x] Verify BKK page RPC and both `from`/`to` airport route searches return only nonstop routes.
- [x] Run web lint, typecheck, tests, and production build.
- [x] Start local web, verify Arrival and Departure states, both connection directions, Verified Flights, footer/header, mobile width, and absence of legacy content.
