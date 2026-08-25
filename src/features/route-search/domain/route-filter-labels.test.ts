import { describe, expect, it } from "vitest";

import {
  formatDurationMinutes,
  formatStopsLabel,
  formatTimeBucketLabel,
  getAirlineDisplay,
  getAirportDetailedDisplay,
  getAirportDisplay,
  getCountryDisplay,
  getRegionDisplay,
} from "./route-filter-labels";

describe("route-filter-labels", () => {
  it("translates airport IATA to city name label", () => {
    expect(getAirportDisplay("SIN")).toBe("Singapore (SIN)");
    expect(getAirportDisplay("SGN")).toBe("Ho Chi Minh City (SGN)");
    expect(getAirportDisplay("BKK")).toBe("Bangkok (BKK)");
    expect(getAirportDisplay("LHR")).toBe("London (LHR)");
    expect(getAirportDisplay("UNKNOWN")).toBe("UNKNOWN");
    expect(["SIN", "BKK"].map((code) => getAirportDisplay(code))).toEqual(["Singapore (SIN)", "Bangkok (BKK)"]);
  });

  it("translates airport IATA to detailed airport name", () => {
    expect(getAirportDetailedDisplay("SGN")).toBe("Tan Son Nhat International Airport (SGN)");
    expect(getAirportDetailedDisplay("BKK")).toBe("Suvarnabhumi Airport (BKK)");
    expect(getAirportDetailedDisplay("BKK", "Suvarnabhumi")).toBe("Suvarnabhumi (BKK)");
  });

  it("translates airline IATA to airline name", () => {
    expect(getAirlineDisplay("VN")).toBe("Vietnam Airlines (VN)");
    expect(getAirlineDisplay("SQ")).toBe("Singapore Airlines (SQ)");
    expect(getAirlineDisplay("TG")).toBe("Thai Airways (TG)");
    expect(getAirlineDisplay("XX")).toBe("XX");
  });

  it("translates country code to country name", () => {
    expect(getCountryDisplay("VN")).toBe("Vietnam");
    expect(getCountryDisplay("SG")).toBe("Singapore");
    expect(getCountryDisplay("GB")).toBe("United Kingdom");
  });

  it("formats region display name", () => {
    expect(getRegionDisplay("southeast_asia")).toBe("Southeast Asia");
    expect(getRegionDisplay("asia")).toBe("Asia");
  });

  it("formats duration minutes into hours and minutes", () => {
    expect(formatDurationMinutes(90)).toBe("1h 30m");
    expect(formatDurationMinutes(120)).toBe("2h");
    expect(formatDurationMinutes(45)).toBe("45m");
  });

  it("formats stops label", () => {
    expect(formatStopsLabel(0)).toBe("Nonstop only");
    expect(formatStopsLabel(1)).toBe("Up to 1 stop");
    expect(formatStopsLabel(2)).toBe("Up to 2 stops");
  });

  it("formats time bucket label", () => {
    expect(formatTimeBucketLabel("morning")).toBe("Morning (06:00 – 12:00)");
    expect(formatTimeBucketLabel("evening")).toBe("Evening (18:00 – 24:00)");
  });
});
