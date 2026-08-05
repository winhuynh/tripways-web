import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SiteFooter, SiteHeader } from ".";

describe("shared site chrome", () => {
  it("renders a logo-only header linked to the retained site entry", () => {
    const markup = renderToStaticMarkup(<SiteHeader />);

    expect(markup).toContain('aria-label="Tripways"');
    expect(markup).toContain('href="/terms"');
    expect(markup).toContain("TRIPWAYS");
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
