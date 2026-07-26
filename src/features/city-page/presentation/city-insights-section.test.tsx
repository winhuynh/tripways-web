import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CityInsightsSection } from "./city-insights-section";

describe("CityInsightsSection", () => {
  it("uses the current city name in its editorial heading", () => {
    const markup = renderToStaticMarkup(
      <CityInsightsSection
        cityName="Singapore"
        insights={{
          mostPopularDestination: "Bangkok",
          shortestDestination: "Kuala Lumpur",
          longestDestination: "London",
          topAirline: "Singapore Airlines",
          averageDurationMinutes: 290,
          directCountryCount: 41,
        }}
      />,
    );

    expect(markup).toContain("Singapore");
    expect(markup).toContain("Travel Insights");
    expect(markup).not.toContain("Bangkok travel insights");
  });
});
