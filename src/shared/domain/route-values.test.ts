import { describe, expect, it } from "vitest";

import { formatDuration, formatPriceEstimate } from "./route-values";

describe("route value formatters", () => {
  it("formats durations without losing minute precision", () => {
    expect(formatDuration(785)).toBe("13h 05m");
    expect(formatDuration(45)).toBe("45m");
  });

  it("does not turn an unavailable price into zero", () => {
    expect(formatPriceEstimate({ state: "unavailable", reason: "missing" })).toBe(
      "Fare unavailable",
    );
    expect(
      formatPriceEstimate({
        state: "available",
        priceMin: 45,
        priceMax: 95,
        currencyCode: "GBP",
      }),
    ).toBe("£45–£95");
  });
});
