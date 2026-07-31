import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import robots from "./robots";
import sitemap from "./sitemap";

describe("P0A indexing contract", () => {
  it("disallows crawling and emits no fixture sitemap entries", () => {
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
    expect(sitemap()).toEqual([]);
  });

  it("forces city and airport metadata to noindex with canonical paths", () => {
    for (const relativePath of [
      "../features/city-page/presentation/city-page-metadata.ts",
      "../features/airport-page/presentation/airport-page-metadata.ts",
    ]) {
      const source = readFileSync(new URL(relativePath, import.meta.url), "utf8");
      expect(source).toContain("alternates: { canonical:");
      expect(source).toContain("robots: { index: false, follow: true }");
      expect(source).not.toContain("? index: true");
    }
  });

  it("provides bounded dependency error UI for city and airport routes", () => {
    for (const relativePath of [
      "./flights-from/[citySlug]/error.tsx",
      "./airports/[airportSlug]/error.tsx",
    ]) {
      const source = readFileSync(new URL(relativePath, import.meta.url), "utf8");
      expect(source).toContain("Something went wrong while loading");
      expect(source).toContain("Try again");
      expect(source).not.toContain("error.message");
      expect(source).not.toContain("error.stack");
    }
  });
});
