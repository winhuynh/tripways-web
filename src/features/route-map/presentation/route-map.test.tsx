import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { RouteMap } from "./route-map";
import { buildRouteMapPopupHtml } from "./route-map-popup";
import type { RouteMapReadModel } from "../domain/route-map-model";

const readModel: RouteMapReadModel = {
  origin: {
    type: "city",
    name: "Bangkok",
    slug: "bangkok",
    latitude: 13.7563,
    longitude: 100.5018,
  },
  destinations: [
    {
      cityName: "Tokyo",
      citySlug: "tokyo",
      countryIso2: "JP",
      countryName: "Japan",
      latitude: 35.6762,
      longitude: 139.6503,
      routePath: "/flights/bangkok-to-tokyo",
      originAirports: ["BKK"],
      destinationAirports: ["NRT"],
      airlines: ["TG"],
      shortestDurationMinutes: 345,
      frequencyPerWeek: 21,
    },
  ],
  meta: {
    dataVersion: "v1",
    total: 1,
    omittedDestinationCount: 0,
    limit: 100,
  },
};

describe("RouteMap", () => {
  it("renders an independently labelled stable map region", () => {
    const markup = renderToStaticMarkup(<RouteMap readModel={readModel} />);

    expect(markup).toContain('aria-label="Interactive direct-route map from Bangkok"');
    expect(markup).toContain("Loading interactive route map");
    expect(markup).toContain("route-map-shell");
  });

  it("renders an explicit empty state without initializing map geometry", () => {
    const markup = renderToStaticMarkup(
      <RouteMap
        readModel={{ ...readModel, destinations: [], meta: { ...readModel.meta, total: 0 } }}
      />,
    );

    expect(markup).toContain("No direct routes match these filters");
    expect(markup).toContain("Bangkok remains the selected departure city");
  });
});

describe("buildRouteMapPopupHtml", () => {
  it("escapes database values and includes the internal route link", () => {
    const html = buildRouteMapPopupHtml({
      ...readModel.destinations[0]!,
      cityName: "<Tokyo>",
    });

    expect(html).toContain("&lt;Tokyo&gt;");
    expect(html).not.toContain("<Tokyo>");
    expect(html).toContain('href="/flights/bangkok-to-tokyo"');
    expect(html).toContain("BKK");
    expect(html).toContain("NRT");
    expect(html).toContain("5h 45m");
  });
});
