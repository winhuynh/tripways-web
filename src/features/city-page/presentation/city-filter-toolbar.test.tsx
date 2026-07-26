import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CityFilterToolbar } from "./city-discovery-tools";

describe("CityFilterToolbar", () => {
  it("reflects the active airport filter in the rendered control", () => {
    const markup = renderToStaticMarkup(
      <CityFilterToolbar
        airports={[
          {
            iata: "BKK",
            icao: "VTBS",
            name: "Suvarnabhumi Airport",
            slug: "suvarnabhumi-airport",
            airportType: "large_airport",
            latitude: 13.69,
            longitude: 100.7501,
            timezone: "Asia/Bangkok",
            isPrimary: true,
            hubLabel: "MAIN HUB",
            description: null,
            displayOrder: 1,
            directDestinationCount: 3,
            domesticDestinationCount: 0,
            internationalDestinationCount: 3,
            domesticDestinationPercentage: 0,
            internationalDestinationPercentage: 100,
            airlineCount: 1,
            dominantAirlineBusinessModel: "full_service",
            pagePath: "/flights-from/bangkok/bkk",
          },
        ]}
        selectedAirport="BKK"
        selectedDeparture="morning"
        selectedDuration="360"
        total={3}
      />,
    );

    expect(markup).toContain('<option value="BKK" selected="">BKK</option>');
    expect(markup).toContain(
      '<option value="360" selected="">Under 6 hours</option>',
    );
    expect(markup).toContain(
      '<option value="morning" selected="">Morning</option>',
    );
  });
});
