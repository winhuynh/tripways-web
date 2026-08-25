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

  it("documents a complete and secret-safe env file for every environment", () => {
    const expectedVariables = [
      "APP_ENV",
      "NEXT_PUBLIC_SITE_URL",
      "SUPABASE_URL",
      "SUPABASE_ANON_KEY",
      "PAGE_DATA_VERSION",
      "PAGE_DATA_TIMEOUT_MS",
      "PAGE_QUERY_EDGE_URL",
      "ROUTE_SEARCH_QUERY_EDGE_URL",
      "HOMEPAGE_STATISTICS_EDGE_URL",
      "FLIGHT_AFFILIATE_HANDOFF_EDGE_URL",
      "CITY_PAGE_EDGE_URL",
      "REVALIDATE_SECRET",
    ];

    for (const file of [
      ".env.local.example",
      ".env.staging.example",
      ".env.production.example",
    ]) {
      const example = read(file);
      for (const name of expectedVariables) {
        expect(example).toContain(`${name}=`);
      }
      expect(example).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    }
  });

  it("provides one deterministic local verification command", () => {
    const packageJson = JSON.parse(read("package.json")) as {
      scripts: Record<string, string>;
    };
    expect(packageJson.scripts["verify:p0a"]).toContain("npm run build");
    expect(packageJson.scripts["verify:p0a"]).toContain("npm run test");
    expect(packageJson.scripts.build).toBe("next build --webpack");
  });

  it("loads an explicit env file for each environment build", () => {
    const packageJson = JSON.parse(read("package.json")) as {
      scripts: Record<string, string>;
    };

    expect(packageJson.scripts["build:local"]).toContain(
      "scripts/build-with-env.mjs .env.local",
    );
    expect(packageJson.scripts["build:staging"]).toContain(
      "scripts/build-with-env.mjs .env.staging",
    );
    expect(packageJson.scripts["build:production"]).toContain(
      "scripts/build-with-env.mjs .env.production",
    );
  });

  it("targets Cloudflare Workers through OpenNext, not Vercel or static Pages", () => {
    const packageJson = JSON.parse(read("package.json")) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
      scripts: Record<string, string>;
    };
    const wranglerConfig = read("wrangler.jsonc");

    expect(packageJson.dependencies["@opennextjs/cloudflare"]).toBeTruthy();
    expect(packageJson.devDependencies.wrangler).toBeTruthy();
    expect(packageJson.scripts["cloudflare:build:staging"]).toContain(
      "opennextjs-cloudflare build --env staging",
    );
    expect(packageJson.scripts["cloudflare:deploy:production"]).toContain(
      'opennextjs-cloudflare deploy --env ""',
    );
    expect(read("open-next.config.ts")).toContain("defineCloudflareConfig");
    expect(wranglerConfig).toContain(".open-next/worker.js");
    expect(wranglerConfig).toContain('"nodejs_compat"');
    expect(wranglerConfig).toContain("staging.tripways.app");
    expect(wranglerConfig).toContain("tripways.app");
    expect(wranglerConfig).toContain('"APP_ENV": "staging"');
    expect(wranglerConfig).toContain('"APP_ENV": "production"');
    expect(read(".gitignore")).toContain(".open-next/");
    expect(read("public/_headers")).toContain("/_next/static/*");
  });

  it("keeps backend-dependent pSEO pages ISR-cached for 24 hours", () => {
    for (const path of [
      "src/app/flights-from/[citySlug]/page.tsx",
      "src/app/flights/[routeSlug]/page.tsx",
      "src/app/airports/[airportSlug]/page.tsx",
    ]) {
      expect(read(path)).toMatch(/export const revalidate\s*=\s*86400/);
    }
  });

  it("loads runtime homepage statistics outside static prerendering", () => {
    expect(read("src/app/page.tsx")).toMatch(/export const dynamic\s*=\s*["']force-dynamic["']/);
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

  it("keeps route discovery on detail pages and the homepage statistics-only", () => {
    for (const path of [
      "src/app/flights-from/[citySlug]/page.tsx",
      "src/app/flights/[routeSlug]/page.tsx",
      "src/app/airports/[airportSlug]/page.tsx",
    ]) {
      expect(read(path)).toContain("searchRoutes(");
    }
    for (const path of [
      "src/features/city-page/presentation/city-page-screen.tsx",
      "src/features/route-page/presentation/route-page-screen.tsx",
      "src/features/airport-page/presentation/airport-page-screen.tsx",
    ]) {
      expect(read(path)).toContain("<RouteResults");
    }
    expect(read("src/app/page.tsx")).not.toContain("searchRoutes(");
    expect(read("src/features/homepage/presentation/homepage-screen.tsx")).not.toContain(
      "<RouteResults",
    );
  });
});
