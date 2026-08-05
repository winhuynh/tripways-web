import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

import robots from "./robots";
import sitemap from "./sitemap";

describe("public frontend indexing contract", () => {
  it("publishes the homepage and stable informational pages", () => {
    expect(sitemap().map((entry) => new URL(entry.url).pathname)).toEqual([
      "/", "/about", "/accessibility", "/contact", "/cookies", "/privacy", "/terms",
    ]);
  });

  it("allows public pages while keeping API routes out of search", () => {
    expect(robots().rules).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    });
  });

  it("restores all four page families", () => {
    for (const relativePath of [
      "./page.tsx",
      "./flights-from",
      "./airports",
      "./flights",
      "../features/homepage",
      "../features/city-page",
      "../features/airport-page",
      "../features/route-page",
    ]) {
      expect(existsSync(new URL(relativePath, import.meta.url))).toBe(true);
    }
  });
});
