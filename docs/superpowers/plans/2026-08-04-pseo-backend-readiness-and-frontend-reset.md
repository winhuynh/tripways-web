# pSEO Backend Readiness and Frontend Reset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cập nhật roadmap Tripways theo các gap pSEO đã audit và dọn frontend về app shell chỉ còn trang Terms để chuẩn bị rebuild từ backend contracts.

**Architecture:** Backend tiếp tục là nguồn sự thật duy nhất cho dữ liệu và nội dung pSEO; roadmap phải ưu tiên contract versionless, page read models, content completeness, commercial modules và publication gates. Frontend giữ Next.js app shell, Terms, design/shared infrastructure và xoá toàn bộ route/feature page cũ.

**Tech Stack:** PostgreSQL/Supabase, Next.js 16, React 19, TypeScript, Vitest.

---

### Task 1: Cập nhật roadmap pSEO

**Files:**
- Modify: `tripways-backend/docs/product/tripways-mvp-roadmap.md`
- Modify: `tripways-backend/docs/technical/tripways-technical-roadmap.md`
- Modify: các PRD P0–P4 có liên quan trong `tripways-backend/docs/product/` và `tripways-backend/docs/technical/`

- [x] Ghi rõ P0 chuẩn hoá contract versionless và content backend-only.
- [x] Ghi rõ P1 ingestion/coverage cho graph, price và airport guidance.
- [x] Ghi rõ P2 licensed schedule/fare data và freshness.
- [x] Ghi rõ P3 advertising/affiliate configuration.
- [x] Bổ sung P4 scale, completeness, indexability và observability.

### Task 2: Khoá indexing contract cho frontend reset

**Files:**
- Modify: `src/app/indexing-contract.test.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/robots.ts`

- [x] Viết test yêu cầu sitemap chỉ có `/terms` và robots không công bố các route pSEO đã xoá.
- [x] Chạy test và xác nhận thất bại vì contract cũ.
- [x] Sửa sitemap/robots tối thiểu để test qua.

### Task 3: Xoá các page cũ

**Files:**
- Delete: `src/app/page.tsx`, `src/app/page.test.tsx`
- Delete: `src/app/flights-from/`
- Delete: `src/app/airports/`
- Delete: `src/app/api/city-page/`
- Delete: `src/features/home-page/`
- Delete: `src/features/city-page/`
- Delete: `src/features/airport-page/`
- Keep: `src/app/terms/`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/design/`, shared infrastructure

- [x] Xoá đúng các route/feature page cũ, kể cả test page-specific.
- [x] Tìm import/reference còn sót và loại bỏ.

### Task 4: Xác minh

**Files:**
- Verify only.

- [x] Chạy `pnpm lint`.
- [x] Chạy `pnpm typecheck`.
- [x] Chạy `pnpm test`.
- [x] Chạy `pnpm build`.
- [x] Rà lại `git diff --stat`, route tree và các reference page cũ.
