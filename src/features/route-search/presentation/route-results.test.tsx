import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { routeSearchFixture } from "../domain/route-search-model.fixture";
import { RouteResults } from "./route-results";

describe("RouteResults", () => {
  it("does not render a broken route-guide link when no guide is published", () => {
    const model = {
      ...routeSearchFixture,
      options: [{ ...routeSearchFixture.options[0], routePath: null }],
    };

    const markup = renderToStaticMarkup(<RouteResults model={model} />);

    expect(markup).not.toContain("<a");
    expect(markup).toContain("Route guide unavailable");
  });

  it("renders humanized city and airline names in route items", () => {
    const markup = renderToStaticMarkup(<RouteResults model={routeSearchFixture} />);

    expect(markup).toContain("Bangkok (BKK) → Singapore (SIN)");
    expect(markup).toContain("Singapore Airlines (SQ)");
    expect(markup).toContain("Nonstop");
  });

  it("uses singular flight option copy for one result", () => {
    const markup = renderToStaticMarkup(
      <RouteResults
        model={{ ...routeSearchFixture, options: [routeSearchFixture.options[0]], total: 1 }}
      />,
    );
    expect(markup).toContain("Showing 1 of 1 flight option");
  });

  it("renders active filter chips when filterValues and clearHref are provided", () => {
    const markup = renderToStaticMarkup(
      <RouteResults
        model={routeSearchFixture}
        filterValues={{
          airlines: ["SQ"],
          max_stops: 0,
          max_duration_minutes: 180,
        }}
        clearHref="/flights/bangkok-to-singapore"
      />,
    );

    expect(markup).toContain("Active filters:");
    expect(markup).toContain("Singapore Airlines (SQ)");
    expect(markup).toContain("Nonstop only");
    expect(markup).toContain("≤ 3h duration");
    expect(markup).toContain("Clear all");
  });
});
