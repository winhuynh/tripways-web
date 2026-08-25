import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SiteFooter, SiteHeader } from ".";

describe("shared site chrome", () => {
  it("renders a compact canonical route switcher beside the home link", () => {
    const markup = renderToStaticMarkup(<SiteHeader />);

    expect(markup).toContain('aria-label="Tripways"');
    expect(markup).toContain('href="/"');
    expect(markup).toContain("TRIPWAYS");
    expect(markup).toContain('aria-label="Explore another flight route"');
    expect(markup).toContain("FROM");
    expect(markup).toContain("TO");
    expect(markup).toContain("EXPLORE");
    expect(markup).not.toContain("<nav");
    expect(markup).not.toContain("SIGN IN");
  });

  it("renders the approved two-row footer with six essential links", () => {
    const markup = renderToStaticMarkup(<SiteFooter />);

    expect(markup).toContain('aria-label="Footer navigation"');
    expect(markup).toContain("© 2026 Tripways. All rights reserved.");
    expect(markup).toContain('href="/about"');
    expect(markup).toContain('href="/terms"');
    expect(markup).toContain('href="/privacy"');
    expect(markup).toContain('href="/cookies"');
    expect(markup).toContain('href="/accessibility"');
    expect(markup).toContain('href="/contact"');
    expect(markup).not.toContain("Terms of Service");
    expect(markup).not.toContain("Tripways legal information");
  });

  it("links only to pages that exist in the app router", () => {
    for (const route of ["about", "terms", "privacy", "cookies", "accessibility", "contact"]) {
      expect(existsSync(join(process.cwd(), "src", "app", route, "page.tsx"))).toBe(true);
    }
  });
});
import { existsSync } from "node:fs";
import { join } from "node:path";
