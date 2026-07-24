import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { getAirport } from "../domain/airport";
import { RouteMap } from "./route-map";

describe("RouteMap", () => {
  it("renders an accessible loading fallback with route summaries", () => {
    const origin = getAirport("SGN")!;
    const destination = getAirport("SIN")!;
    const markup = renderToStaticMarkup(
      <RouteMap destinations={[destination]} origin={origin} />,
    );

    expect(markup).toContain('aria-label="Interactive route map from Ho Chi Minh City"');
    expect(markup).toContain("Loading interactive map");
    expect(markup).toContain("SGN");
    expect(markup).toContain("SIN");
  });
});
