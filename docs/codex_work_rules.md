# Codex Workflow Rules

## 1. Required context

Read this file before changing code. Use the approved design and implementation plan under
`docs/superpowers/` as the current product scope.

## 2. Scope and repository safety

- Never revert user changes or use destructive Git commands without explicit approval.
- Do not commit, push, deploy, or connect external services automatically.
- Keep this local prototype intentionally small; do not add speculative abstractions or features.
- Use English for code, identifiers, comments, and file-level headings.

## 3. Architecture boundaries

- Organize application code by clear UI responsibility and keep server integration under `src/lib`.
- Postgres RPC remains the source of truth for route discovery rules, ranking, and eligibility.
- Server Components load route data; Client Components own only browser interaction and navigation.
- Keep the Supabase service-role key server-only. Never expose it through `NEXT_PUBLIC_*`, browser
  bundles, props, logs, or returned error messages.
- Fixture airport metadata is navigation support for this prototype, not production route data.

## 4. TypeScript and interface conventions

- Use strict TypeScript, explicit boundary types, readable names, and small focused functions.
- Validate external RPC envelopes before rendering them.
- Prefer native platform features and direct code over additional dependencies.
- Build accessible controls with labels, keyboard focus states, and responsive layouts.
- Match the approved navy, blue, and off-white visual direction without copying third-party branding.

## 5. Testing and verification

- Use test-first development for parsing, validation, and non-trivial behavior.
- Observe a relevant test failure before adding its implementation.
- Before completion, run tests, lint, typecheck, production build, and responsive browser checks.
- Report completion as `implemented: X; skipped: Y; add when: Z`, including verification evidence.
