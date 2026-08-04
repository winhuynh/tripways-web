import { existsSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

import robots from "./robots";
import sitemap from "./sitemap";

describe("frontend reset indexing contract", () => {
  it("publishes only the retained Terms page in the sitemap", () => {
    expect(sitemap().map((entry) => new URL(entry.url).pathname)).toEqual(["/terms"]);
  });

  it("blocks the pSEO namespaces while they are being rebuilt", () => {
    expect(robots().rules).toEqual({
      userAgent: "*",
      allow: "/terms",
      disallow: ["/flights-from/", "/airports/", "/routes/", "/api/"],
    });
  });

  it("removes every old page route and page-specific feature file", () => {
    expect(existsSync(new URL("./page.tsx", import.meta.url))).toBe(false);

    for (const relativePath of [
      "./flights-from",
      "./airports",
      "./api/city-page",
      "../features/home-page",
      "../features/city-page",
      "../features/airport-page",
    ]) {
      const directory = new URL(relativePath, import.meta.url);
      const files = existsSync(directory)
        ? readdirSync(directory, { recursive: true }).filter((entry) =>
            entry.toString().includes("."),
          )
        : [];
      expect(files).toEqual([]);
    }
  });
});
