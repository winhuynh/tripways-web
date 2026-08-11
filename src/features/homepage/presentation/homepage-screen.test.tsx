import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { HomepageModel } from "../domain/homepage-model";
import { HomepageScreen } from "./homepage-screen";

const model: HomepageModel = { cityCount: 3, airportCount: 4, directRouteCount: 8, dataVersion: "version", generatedAt: "2026-08-11T00:00:00Z" };

describe("HomepageScreen", () => {
  it("renders static landing copy and backend-owned coverage statistics", () => {
    const html = renderToStaticMarkup(<HomepageScreen model={model} />);
    expect(html).toContain("<strong>4</strong><span> airports</span>");
    expect(html).toContain("<strong>8</strong><span> direct routes</span>");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("Popular nonstop routes");
    expect(html).not.toContain("Find nonstop flights from popular cities");
  });
});
