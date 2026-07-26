import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CityDestinationsSection } from "./city-destinations-section";

describe("CityDestinationsSection", () => {
  it("renders the editorial route catalogue and newsletter form", () => {
    const markup = renderToStaticMarkup(
      <CityDestinationsSection
        cityName="Singapore"
        quickFactsSlot={<div>Quick facts slot</div>}
        result={{
          destinations: [
            {
              cityName: "Bangkok",
              citySlug: "bangkok",
              countryIso2: "TH",
              countryName: "Thailand",
              originAirports: ["SIN"],
              destinationAirports: ["BKK", "DMK"],
              airlines: ["SQ", "TG"],
              directRouteCount: 2,
              frequencyPerWeek: 84,
              shortestDurationMinutes: 145,
              longestDurationMinutes: 160,
              routePath: "/flights/singapore-to-bangkok",
            },
          ],
          total: 1,
          facets: { airports: [], airlines: [], countries: [] },
        }}
      />,
    );

    expect(markup).toContain("Destinations");
    expect(markup).toContain("Singapore");
    expect(markup).toContain("Bangkok");
    expect(markup).toContain('type="email"');
    expect(markup).toContain("Subscribe");
    expect(markup).toContain("View route");
  });
});
