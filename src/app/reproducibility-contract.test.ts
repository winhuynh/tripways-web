import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const root = new URL("../../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

describe("local release candidate reproducibility", () => {
  it("does not fetch Google fonts during production build", () => {
    const layout = read("src/app/layout.tsx");
    expect(layout).not.toContain("next/font/google");
    expect(layout).not.toContain("fonts.googleapis.com");
  });

  it("documents every server-side page transport variable without secrets", () => {
    const example = read(".env.example");
    for (const name of [
      "SUPABASE_URL",
      "SUPABASE_ANON_KEY",
      "PAGE_DATA_VERSION",
      "PAGE_DATA_TIMEOUT_MS",
      "PAGE_QUERY_EDGE_URL",
      "ROUTE_SEARCH_QUERY_EDGE_URL",
      "NEXT_PUBLIC_SITE_URL",
    ]) {
      expect(example).toContain(`${name}=`);
    }
    expect(example).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  it("provides one deterministic local verification command", () => {
    const packageJson = JSON.parse(read("package.json")) as {
      scripts: Record<string, string>;
    };
    expect(packageJson.scripts["verify:p0a"]).toContain("npm run build");
    expect(packageJson.scripts["verify:p0a"]).toContain("npm run test");
    expect(packageJson.scripts.build).toBe("next build --webpack");
  });

  it("keeps backend-dependent pSEO pages dynamic during production builds", () => {
    for (const path of [
      "src/app/page.tsx",
      "src/app/flights-from/[citySlug]/page.tsx",
      "src/app/flights/[routeSlug]/page.tsx",
      "src/app/airports/[airportSlug]/page.tsx",
    ]) {
      expect(read(path)).toMatch(/export const dynamic\s*=\s*"force-dynamic"/);
    }
  });

  it("uses backend-owned SEO titles without applying the site template twice", () => {
    for (const path of [
      "src/app/page.tsx",
      "src/app/flights-from/[citySlug]/page.tsx",
      "src/app/flights/[routeSlug]/page.tsx",
      "src/app/airports/[airportSlug]/page.tsx",
    ]) {
      expect(read(path)).toMatch(/title:\s*{\s*absolute:/);
    }
  });

  it("connects every discovery form to the canonical route-search application", () => {
    for (const path of [
      "src/app/page.tsx",
      "src/app/flights-from/[citySlug]/page.tsx",
      "src/app/flights/[routeSlug]/page.tsx",
      "src/app/airports/[airportSlug]/page.tsx",
    ]) {
      expect(read(path)).toContain("searchRoutes(");
    }
    for (const path of [
      "src/features/homepage/presentation/homepage-screen.tsx",
      "src/features/city-page/presentation/city-page-screen.tsx",
      "src/features/route-page/presentation/route-page-screen.tsx",
      "src/features/airport-page/presentation/airport-page-screen.tsx",
    ]) {
      expect(read(path)).toContain("<RouteResults");
    }
  });
});
