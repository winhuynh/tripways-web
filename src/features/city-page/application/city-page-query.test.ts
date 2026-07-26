import { describe, expect, it } from "vitest";

import {
  createCityDestinationQuery,
  createCityPageIdentity,
  readSelectedCityFilters,
} from "./city-page-query";

describe("City Page query projection", () => {
  it("normalizes a route slug into the default localized identity", () => {
    expect(createCityPageIdentity("  Bangkok ")).toEqual({
      citySlug: "bangkok",
      locale: "en-GB",
    });
  });

  it("projects supported filters into the bounded destination query", () => {
    const identity = createCityPageIdentity("Bangkok");

    expect(
      createCityDestinationQuery(identity, {
        airport: " bkk ",
        departure: "morning",
        duration: "180",
      }),
    ).toEqual({
      citySlug: "bangkok",
      locale: "en-GB",
      originAirports: ["BKK"],
      departureWindow: "morning",
      maxDurationMinutes: 180,
      limit: 8,
      offset: 0,
    });
  });

  it("ignores malformed filters instead of forwarding them to the Edge contract", () => {
    const identity = createCityPageIdentity("Singapore");

    expect(
      createCityDestinationQuery(identity, {
        airport: "singapore",
        departure: "breakfast",
        duration: "-1",
      }),
    ).toEqual({
      citySlug: "singapore",
      locale: "en-GB",
      limit: 8,
      offset: 0,
    });
  });

  it("returns only toolbar-supported selected values", () => {
    expect(
      readSelectedCityFilters({
        airport: " dmk ",
        departure: "evening",
        duration: "360",
      }),
    ).toEqual({
      airport: "DMK",
      departure: "evening",
      duration: "360",
    });

    expect(
      readSelectedCityFilters({
        airport: "invalid",
        departure: "night",
        duration: "240",
      }),
    ).toEqual({ airport: "", departure: "night", duration: "" });
  });
});
