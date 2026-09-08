import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AirlineLogo, AirlineBadgeGroup } from "./airline-logo";
import {
  getAirlineLogoUrl,
  renderAirlineLogosHtml,
} from "@/features/route-search/domain/route-filter-labels";

describe("AirlineLogo", () => {
  it("renders Aviasales CDN image when valid IATA is provided", () => {
    const markup = renderToStaticMarkup(
      <AirlineLogo iata="VN" name="Vietnam Airlines" size={28} />
    );

    expect(markup).toContain("<img");
    expect(markup).toContain('src="/api/airlines/VN/logo"');
    expect(markup).toContain('alt="Vietnam Airlines"');
    expect(markup).toContain('width="28"');
    expect(markup).toContain('height="28"');
  });

  it("renders typographic fallback badge when IATA is empty", () => {
    const markup = renderToStaticMarkup(<AirlineLogo iata="" />);

    expect(markup).toContain("<span");
    expect(markup).not.toContain("<img");
    expect(markup).toContain("✈");
  });
});

describe("AirlineBadgeGroup", () => {
  it("renders multiple airline logos and humanized names", () => {
    const markup = renderToStaticMarkup(
      <AirlineBadgeGroup airlines={["VN", "SQ"]} size={18} />
    );

    expect(markup).toContain('src="/api/airlines/VN/logo"');
    expect(markup).toContain('src="/api/airlines/SQ/logo"');
    expect(markup).toContain("Vietnam Airlines (VN), Singapore Airlines (SQ)");
  });

  it("deduplicates redundant airline codes", () => {
    const markup = renderToStaticMarkup(
      <AirlineBadgeGroup airlines={["VN", "VN", "SQ"]} />
    );

    const vnMatches = markup.match(/src="\/api\/airlines\/VN\/logo"/g);
    expect(vnMatches?.length).toBe(1);
  });

  it("limits logos to maxLogos and shows overflow counter", () => {
    const markup = renderToStaticMarkup(
      <AirlineBadgeGroup
        airlines={["VN", "SQ", "TG", "BA", "JL"]}
        maxLogos={3}
      />
    );

    expect(markup).toContain("+2");
  });

  it("hides textual names when showNames is false", () => {
    const markup = renderToStaticMarkup(
      <AirlineBadgeGroup airlines={["VN"]} showNames={false} />
    );

    expect(markup).toContain('src="/api/airlines/VN/logo"');
    expect(markup).not.toContain("Vietnam Airlines (VN)");
  });
});

describe("Airline Logo Helpers", () => {
  it("getAirlineLogoUrl returns proper edge proxy route for valid IATA", () => {
    expect(getAirlineLogoUrl("vn")).toBe("/api/airlines/VN/logo");
    expect(getAirlineLogoUrl("")).toBe("");
    expect(getAirlineLogoUrl("INVALID")).toBe("");
  });

  it("renderAirlineLogosHtml produces valid img markup", () => {
    const html = renderAirlineLogosHtml(["VN", "SQ"]);
    expect(html).toContain('<img src="/api/airlines/VN/logo"');
    expect(html).toContain('<img src="/api/airlines/SQ/logo"');
  });
});
