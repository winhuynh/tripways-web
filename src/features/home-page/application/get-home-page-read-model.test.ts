import { describe, expect, it } from "vitest";

import { getHomePageReadModel } from "./get-home-page-read-model";

describe("getHomePageReadModel", () => {
  it("returns the approved editorial homepage content", () => {
    const readModel = getHomePageReadModel();

    expect(readModel.issueLabel).toBe(
      "A global mobility journal — Issue 01",
    );
    expect(readModel.hero).toMatchObject({
      headingLead: "Discover",
      headingEmphasis: "where",
      headingTail: "the world connects.",
      ctaLabel: "Search routes",
      ctaHref: "/flights-from/bangkok#route-search",
    });
    expect(readModel.directories).toHaveLength(5);
    expect(readModel.corridors).toHaveLength(4);
    expect(readModel.valuePropositions).toHaveLength(3);
  });

  it("uses stable unique keys for every homepage collection", () => {
    const readModel = getHomePageReadModel();

    for (const entries of [
      readModel.directories,
      readModel.corridors,
      readModel.valuePropositions,
    ]) {
      const keys = entries.map((entry) => entry.key);
      expect(new Set(keys).size).toBe(keys.length);
    }
  });
});
