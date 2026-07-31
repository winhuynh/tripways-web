import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { RouteInformationDisclaimer } from "./route-information-disclaimer";

describe("RouteInformationDisclaimer", () => {
  it("explains route freshness and links to the Terms", () => {
    const markup = renderToStaticMarkup(<RouteInformationDisclaimer />);

    expect(markup).toContain('role="note"');
    expect(markup).toContain("planning reference only");
    expect(markup).toContain("Verify current services and schedules");
    expect(markup).toContain('href="/terms"');
  });
});
