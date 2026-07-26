import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const CITY_PAGE_CSS = readFileSync(
  new URL("./city-page.css", import.meta.url),
  "utf8",
);

describe("City Hub theme", () => {
  it("uses the shared warm page background from the approved Figma frame", () => {
    expect(CITY_PAGE_CSS).toContain(
      ".city-editorial-shell {\n  --city-charcoal:",
    );
    expect(CITY_PAGE_CSS).toContain("background: var(--color-background);");
    expect(CITY_PAGE_CSS).toContain("color: var(--color-on-background);");
    expect(CITY_PAGE_CSS).not.toContain("background: var(--city-black);");
  });

  it("keeps the airport story dark without overriding shared header and footer surfaces", () => {
    expect(CITY_PAGE_CSS).toContain(
      ".city-page .highlight-section.airport-operations",
    );
    expect(CITY_PAGE_CSS).toContain("background: var(--city-charcoal);");
    expect(CITY_PAGE_CSS).not.toContain(
      ".city-editorial-shell .editorial-site-header",
    );
    expect(CITY_PAGE_CSS).not.toContain(
      ".city-editorial-shell .editorial-site-footer",
    );
  });
});
