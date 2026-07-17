import { describe, expect, it } from "vitest";

import { getAirport, listDestinationCandidates } from "./airports";

describe("airport registry", () => {
  it("normalizes a known IATA code", () => {
    expect(getAirport(" sgn ")?.city).toBe("Ho Chi Minh City");
  });

  it("returns undefined for an unknown code", () => {
    expect(getAirport("XYZ")).toBeUndefined();
  });

  it("lists every fixture airport except the origin", () => {
    const candidates = listDestinationCandidates("SGN");

    expect(candidates).toHaveLength(4);
    expect(candidates.some((airport) => airport.iata === "SGN")).toBe(false);
  });
});
