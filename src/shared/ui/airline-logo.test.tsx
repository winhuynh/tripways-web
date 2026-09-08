import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AirlineLogo } from "./airline-logo";

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
