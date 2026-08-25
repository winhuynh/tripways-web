import { describe, expect, it } from "vitest";

import { getLocalFilteredRouteSearchFixture } from "./route-search-model.fixture";

describe("getLocalFilteredRouteSearchFixture", () => {
  it("filters destination countries using their canonical ISO code", () => {
    const result = getLocalFilteredRouteSearchFixture({
      destination_countries: ["JP"],
    });

    expect(result.options.map((option) => option.id)).toEqual(["BKK-NRT"]);
  });
});
