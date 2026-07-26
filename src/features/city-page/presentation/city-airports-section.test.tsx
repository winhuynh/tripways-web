import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CityAirportsSection } from "./city-airports-section";

describe("CityAirportsSection", () => {
  it("renders the complete backend airport hub read model", () => {
    const markup = renderToStaticMarkup(
      <CityAirportsSection
        airportSummary="Bangkok is served by two major international gateways."
        cityName="Singapore"
        airports={[
          {
            iata: "DMK",
            icao: "VTBD",
            name: "Don Mueang International Airport",
            slug: "don-mueang-international-airport",
            airportType: "large_airport",
            latitude: 13.9126,
            longitude: 100.6068,
            timezone: "Asia/Bangkok",
            isPrimary: false,
            hubLabel: "LOW-COST HUB",
            description: "Bangkok's low-cost gateway.",
            displayOrder: 2,
            directDestinationCount: 3,
            domesticDestinationCount: 1,
            internationalDestinationCount: 2,
            domesticDestinationPercentage: 33,
            internationalDestinationPercentage: 67,
            airlineCount: 1,
            dominantAirlineBusinessModel: "low_cost",
            pagePath: "/flights-from/bangkok/dmk",
          },
        ]}
      />,
    );

    expect(markup).toContain("Bangkok is served by two major international gateways.");
    expect(markup).toContain("Singapore airport operations");
    expect(markup).toContain("LOW-COST HUB");
    expect(markup).toContain("3 destinations");
    expect(markup).toContain("1 airline");
    expect(markup).toContain("67% international");
    expect(markup).toContain("Low cost");
    expect(markup).toContain("Bangkok&#x27;s low-cost gateway.");
  });
});
