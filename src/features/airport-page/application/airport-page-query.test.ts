import { describe, expect, it } from "vitest";

import {
  createAirportPageIdentity,
  parseAirportPageFilters,
} from "./airport-page-query";

describe("airport page query", () => {
  it("derives the IATA identity from the canonical slug", () => {
    expect(createAirportPageIdentity("suvarnabhumi-bkk")).toEqual({
      airportIata: "BKK",
      locale: "en-GB",
    });
  });

  it("normalizes supported route filters", () => {
    expect(
      parseAirportPageFilters({
        direction: "INBOUND",
        airline: " sq ",
        country: "sg",
        duration: "360",
      }),
    ).toEqual({
      direction: "inbound",
      airlines: ["SQ"],
      countries: ["SG"],
      maxDurationMinutes: 360,
    });
  });
});
