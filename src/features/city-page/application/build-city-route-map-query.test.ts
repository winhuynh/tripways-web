import { describe, expect, it } from "vitest";

import { buildCityRouteMapQuery } from "./build-city-route-map-query";

describe("buildCityRouteMapQuery", () => {
  it("maps bounded city-page filters into the independent route-map query", () => {
    expect(
      buildCityRouteMapQuery(
        { citySlug: "bangkok", locale: "en-GB" },
        {
          airport: "bkk",
          airline: ["tg", "sq"],
          country: "jp",
          duration: "360",
          departure: "morning",
        },
      ),
    ).toEqual({
      origin: { type: "city", slug: "bangkok" },
      locale: "en-GB",
      originAirports: ["BKK"],
      airlines: ["TG", "SQ"],
      destinationCountries: ["JP"],
      maxDurationMinutes: 360,
      departureWindow: "morning",
      limit: 100,
    });
  });

  it("ignores malformed route filters", () => {
    expect(
      buildCityRouteMapQuery(
        { citySlug: "bangkok", locale: "en-GB" },
        {
          airport: "INVALID",
          airline: "LONG",
          country: "JPN",
          duration: "-1",
          departure: "dawn",
        },
      ),
    ).toEqual({
      origin: { type: "city", slug: "bangkok" },
      locale: "en-GB",
      limit: 100,
    });
  });
});
