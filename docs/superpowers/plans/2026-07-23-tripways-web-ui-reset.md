# Tripways Web UI Reset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xoá toàn bộ route và presentation nháp, giữ nguyên nền Clean Architecture của Route Discovery và để ứng dụng hoạt động với một homepage tối thiểu.

**Architecture:** `src/app` được thu gọn thành Next.js shell và một health-style homepage. Các tầng domain, application, infrastructure và server composition của `route-discovery` được giữ lại; presentation của feature và mọi component giao diện nháp được xoá.

**Tech Stack:** Next.js 16, React 19, TypeScript 6, Vitest, ESLint, Tailwind CSS 4.

---

### Task 1: Thiết lập contract cho frontend sau reset

**Files:**
- Create: `src/app/page.test.tsx`
- Modify: `vitest.config.ts`

- [ ] **Step 1: Viết test cho homepage tối thiểu**

Test render `HomePage()` và xác nhận output chứa `Tripways` cùng thông báo frontend sẵn sàng xây production.

- [ ] **Step 2: Chạy test để xác nhận test thất bại**

Run: `pnpm test -- src/app/page.test.tsx`

Expected: FAIL vì homepage hiện tại vẫn phụ thuộc component giao diện nháp hoặc chưa khớp nội dung reset.

- [ ] **Step 3: Cấu hình Vitest cho React Server output nếu cần**

Giữ test ở môi trường Node và kiểm tra trực tiếp React element tree, không bổ sung DOM dependency chỉ để test trang tĩnh.

### Task 2: Thu gọn Next.js shell

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Delete: `src/app/not-found.tsx`
- Delete: `src/app/routes/[from]/[to]/page.tsx`
- Delete: `src/app/flights-from/[iata]/page.tsx`

- [ ] **Step 1: Thay homepage bằng nội dung tối thiểu**

Homepage chỉ render `Tripways` và thông báo frontend đã reset, không import component ngoài.

- [ ] **Step 2: Thu gọn root layout**

Giữ metadata cơ bản, `lang="vi"` và `children`; xoá header/footer nháp.

- [ ] **Step 3: Thu gọn global CSS**

Giữ CSS reset, font mặc định và style tối thiểu cho homepage; xoá toàn bộ token và selector của UI/map nháp.

- [ ] **Step 4: Xoá các route nháp**

Xoá route động và custom not-found để URL cũ dùng 404 mặc định của Next.js.

- [ ] **Step 5: Chạy test homepage**

Run: `pnpm test -- src/app/page.test.tsx`

Expected: PASS.

### Task 3: Xoá presentation nháp, giữ core architecture

**Files:**
- Delete: `src/components/home/**`
- Delete: `src/components/layout/**`
- Delete: `src/components/ui/**`
- Delete: `src/config/**`
- Delete: các presentation component nháp ngoài nhóm `route-map*`
- Modify: `src/features/route-discovery/index.ts`

- [ ] **Step 1: Xoá component và test presentation**

Xoá homepage, layout, UI primitives và Route Discovery presentation.

- [ ] **Step 2: Thu gọn public exports**

`route-discovery/index.ts` chỉ export domain contracts và `RouteMap`; không export presentation đã xoá.

- [ ] **Step 3: Xác nhận MapLibre chỉ còn trong module bản đồ**

Run: `rg -n "AirportSearchForm|DestinationCard|FilterToolbar|RouteOptionCard|SiteHeader|SiteFooter" src`

Expected: Không còn import hoặc JSX reference; MapLibre và `RouteMap` vẫn tồn tại như foundation tái sử dụng.

### Task 4: Kiểm chứng kiến trúc và build

**Files:**
- Modify: các file còn sót import/type lỗi nếu kết quả kiểm tra chỉ ra.

- [ ] **Step 1: Kiểm tra file và import mồ côi**

Run: `rg -n "@/components|AirportSearchForm|DestinationCard|FilterToolbar|RouteOptionCard|routes/\\[from\\]|flights-from" src`

Expected: Không còn reference tới UI nháp.

- [ ] **Step 2: Chạy unit tests**

Run: `pnpm test`

Expected: Tất cả test còn lại PASS.

- [ ] **Step 3: Chạy lint**

Run: `pnpm lint`

Expected: Exit code 0.

- [ ] **Step 4: Chạy typecheck**

Run: `pnpm typecheck`

Expected: Exit code 0.

- [ ] **Step 5: Chạy production build**

Run: `pnpm build`

Expected: Build thành công và chỉ liệt kê route `/`.

- [ ] **Step 6: Kiểm tra runtime**

Khởi động hoặc dùng dev server hiện tại, xác nhận `/` trả `200`, `/routes/SGN/SIN` và `/flights-from/SGN` trả `404`.

### Task 5: Báo cáo trạng thái reset

- [ ] **Step 1: Kiểm tra Git diff**

Run: `git status --short` và `git diff --stat`

Expected: Chỉ có thay đổi thuộc UI reset cùng các thay đổi có sẵn của người dùng; không commit, push hoặc deploy.

- [ ] **Step 2: Bàn giao**

Báo cáo các phần đã xoá, core architecture được giữ lại, kết quả verification và URL local còn hoạt động.
