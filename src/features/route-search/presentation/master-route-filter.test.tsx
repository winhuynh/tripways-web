import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { routeSearchFixture } from "../domain/route-search-model.fixture";
import {
  AIRPORT_ROUTE_FILTER_FIELDS,
  CITY_ROUTE_FILTER_FIELDS,
  ROUTE_PAGE_FILTER_FIELDS,
} from "../domain/route-filter";
import { MasterRouteFilter } from "./master-route-filter";

describe("MasterRouteFilter", () => {
  it("renders only City fields and selected URL state with humanized labels", () => {
    const html = renderToStaticMarkup(
      <MasterRouteFilter
        fields={CITY_ROUTE_FILTER_FIELDS}
        values={{ departure_airports: ["BKK"], route_type: "international" }}
        facets={routeSearchFixture.facets}
        departureAirports={["BKK", "DMK"]}
        clearHref="/flights-from/bangkok"
      />,
    );
    expect(html).toContain('name="departure_airports"');
    expect(html).toContain('value="BKK"');
    expect(html).toContain('checked=""');
    expect(html).toContain("Suvarnabhumi Airport (BKK)");
    expect(html).toContain("Don Mueang International Airport (DMK)");
    expect(html).toContain('name="destination_countries"');
    expect(html).toContain("Singapore");
    expect(html).toContain('name="max_duration_minutes"');
    expect(html).toContain('type="range"');
    expect(html).toContain("Filters");
    expect(html).not.toContain('name="max_stops"');
    expect(html).not.toContain('name="direction"');
  });

  it("renders Route stop, connection, time and layover controls with humanized labels", () => {
    const html = renderToStaticMarkup(
      <MasterRouteFilter
        fields={ROUTE_PAGE_FILTER_FIELDS}
        values={{ max_stops: 1, departure_time_buckets: ["morning"] }}
        facets={{ ...routeSearchFixture.facets, connections: [{ value: "SIN", count: 2 }] }}
        clearHref="/flights/ho-chi-minh-city-to-london"
        nextCursor="next-cursor"
      />,
    );
    expect(html).toContain('name="max_stops"');
    expect(html).toContain('name="days_of_week"');
    expect(html).toContain("Operating days");
    expect(html).toContain('name="connection_airports"');
    expect(html).toContain("Singapore (SIN)");
    expect(html).toContain('class="master-filter__choice-count">2</span>');
    expect(html).toContain('name="departure_time_buckets"');
    expect(html).toContain("Morning");
    expect(html).toContain("06:00 – 12:00");
    expect(html).toContain('name="max_layover_minutes"');
    expect(html).toContain("Next page");
    expect(html).not.toContain('name="route_type"');
  });


  it("keeps Airport controls direct-only with humanized airport direction", () => {
    const html = renderToStaticMarkup(
      <MasterRouteFilter
        fields={AIRPORT_ROUTE_FILTER_FIELDS}
        values={{ direction: "to", counterpart_query: "SGN" }}
        facets={routeSearchFixture.facets}
        clearHref="/airports/suvarnabhumi-bkk"
        airportCode="BKK"
      />,
    );
    expect(html).toContain('name="direction"');
    expect(html).toContain("From Bangkok (BKK)");
    expect(html).toContain("To Bangkok (BKK)");
    expect(html).toContain('name="counterpart_query"');
    expect(html).toContain('name="counterpart_countries"');
    expect(html).toContain('name="route_type"');
    expect(html).not.toContain('name="max_duration_minutes"');
    expect(html).not.toContain('name="connection_airports"');
  });
});
