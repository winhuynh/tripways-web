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
  it("renders only City fields and selected URL state", () => {
    const html = renderToStaticMarkup(<MasterRouteFilter
      fields={CITY_ROUTE_FILTER_FIELDS}
      values={{ departure_airports: ["BKK"], route_type: "international" }}
      facets={routeSearchFixture.facets}
      departureAirports={["BKK", "DMK"]}
      clearHref="/flights-from/bangkok"
    />);
    expect(html).toContain('name="departure_airports"');
    expect(html).toContain('value="BKK" selected=""');
    expect(html).toContain('name="destination_countries"');
    expect(html).toContain('name="max_duration_minutes"');
    expect(html).not.toContain('name="max_stops"');
    expect(html).not.toContain('name="direction"');
  });

  it("renders Route stop, connection, time and layover controls", () => {
    const html = renderToStaticMarkup(<MasterRouteFilter
      fields={ROUTE_PAGE_FILTER_FIELDS}
      values={{ max_stops: 1, departure_time_buckets: ["morning"] }}
      facets={{ ...routeSearchFixture.facets, connections: [{ value: "SIN", count: 2 }] }}
      clearHref="/flights/ho-chi-minh-city-to-london"
      nextCursor="next-cursor"
    />);
    expect(html).toContain('name="max_stops"');
    expect(html).toContain('name="connection_airports"');
    expect(html).toContain('name="departure_time_buckets"');
    expect(html).toContain('name="max_layover_minutes"');
    expect(html).toContain("Next page");
    expect(html).not.toContain('name="route_type"');
  });

  it("keeps Airport controls direct-only", () => {
    const html = renderToStaticMarkup(<MasterRouteFilter
      fields={AIRPORT_ROUTE_FILTER_FIELDS}
      values={{ direction: "to", counterpart_query: "SGN" }}
      facets={routeSearchFixture.facets}
      clearHref="/airports/suvarnabhumi-bkk"
      airportCode="BKK"
    />);
    expect(html).toContain('name="direction"');
    expect(html).toContain('name="counterpart_query"');
    expect(html).toContain('name="counterpart_countries"');
    expect(html).toContain('name="route_type"');
    expect(html).not.toContain('name="max_duration_minutes"');
    expect(html).not.toContain('name="connection_airports"');
  });
});
