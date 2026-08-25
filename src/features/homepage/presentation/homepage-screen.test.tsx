import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { HomepageModel } from "../domain/homepage-model";
import { HomepageScreen } from "./homepage-screen";

const model: HomepageModel = {
  originCityCount: 3,
  originAirportCount: 4,
  publishedDirectRouteCount: 8,
  dataVersion: "version",
  generatedAt: "2026-08-11T00:00:00Z",
};

describe("HomepageScreen", () => {
  it("renders the hero section with search bar and title", () => {
    const html = renderToStaticMarkup(<HomepageScreen model={model} />);
    expect(html).toContain("Where can you fly nonstop?");
    expect(html).toContain("FLYING FROM");
    expect(html).toContain("SHOW ME");
  });

  it("renders the interactive map shell and defaults to New York JFK when no origin is specified", () => {
    const html = renderToStaticMarkup(<HomepageScreen model={model} />);
    expect(html).toContain("SHOWING FLIGHTS FROM");
    expect(html).toContain("New York JFK");
  });

  it("renders the popular nonstop routes section with comparison cards", () => {
    const html = renderToStaticMarkup(<HomepageScreen model={model} />);
    expect(html).toContain("Popular nonstop routes");
    expect(html).toContain("ILLUSTRATIVE PREVIEW DATA");
    expect(html).toContain("LHR");
    expect(html).toContain("SIN");
  });

  it("renders popular cities picker, value pillars, and travel advisory notice", () => {
    const html = renderToStaticMarkup(<HomepageScreen model={model} />);
    expect(html).toContain("Find nonstop flights from popular cities");
    expect(html).toContain("Find your next destination");
    expect(html).toContain("See your options on a map");
    expect(html).toContain("Choose the route that works for you");
    expect(html).toContain("Before you travel:");
  });
});
