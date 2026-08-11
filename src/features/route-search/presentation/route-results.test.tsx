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
});
