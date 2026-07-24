import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AdSlot } from "./ad-slot";

describe("AdSlot", () => {
  it("renders a stable provider-ready sidebar placement", () => {
    const markup = renderToStaticMarkup(
      <AdSlot format="rectangle" placement="city_destination_sidebar" />,
    );

    expect(markup).toContain('aria-label="Advertisement"');
    expect(markup).toContain('data-ad-format="rectangle"');
    expect(markup).toContain('data-ad-placement="city_destination_sidebar"');
    expect(markup).toContain("Advertisement");
    expect(markup).toContain("Tripways is supported by our partners.");
  });

  it("renders a distinct inline placement below the FAQ", () => {
    const markup = renderToStaticMarkup(
      <AdSlot format="leaderboard" placement="city_after_faq" />,
    );

    expect(markup).toContain('data-ad-format="leaderboard"');
    expect(markup).toContain('data-ad-placement="city_after_faq"');
  });
});
