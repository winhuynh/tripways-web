import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CityQuickFactsSection } from "./city-quick-facts-section";

describe("CityQuickFactsSection", () => {
  it("renders counts and linked route extremes from its own read model", () => {
    const markup = renderToStaticMarkup(
      <CityQuickFactsSection
        cityName="Bangkok"
        quickFacts={{
          airportCount: 2,
          directDestinationCount: 5,
          directCountryCount: 5,
          airlineCount: 2,
          shortestRoute: {
            destinationName: "Chiang Mai",
            destinationSlug: "chiang-mai",
            routePath: "/flights/bangkok-to-chiang-mai",
            durationMinutes: 75,
          },
          longestRoute: {
            destinationName: "Paris",
            destinationSlug: "paris",
            routePath: "/flights/bangkok-to-paris",
            durationMinutes: 785,
          },
          dataVersion: "version-1",
        }}
      />,
    );

    expect(markup).toContain("Quick facts");
    expect(markup).toContain("Bangkok airports");
    expect(markup).toContain(">2<");
    expect(markup).toContain("Direct destinations");
    expect(markup).toContain(">5<");
    expect(markup).toContain('href="/flights/bangkok-to-chiang-mai"');
    expect(markup).toContain(">Chiang Mai<");
    expect(markup).toContain('href="/flights/bangkok-to-paris"');
    expect(markup).toContain(">Paris<");
  });
});
