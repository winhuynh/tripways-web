import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { SiteFooter, SiteHeader } from ".";

// Default mock for next/navigation
const mockUsePathname = vi.fn(() => "/flights/london-to-singapore");
vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("shared site chrome", () => {
  it("renders a compact canonical route switcher beside the home link on subpages", () => {
    mockUsePathname.mockReturnValue("/flights/london-to-singapore");
    const markup = renderToStaticMarkup(<SiteHeader />);

    expect(markup).toContain('aria-label="Tripways"');
    expect(markup).toContain('href="/"');
    expect(markup).toContain("TRIPWAYS");
    expect(markup).toContain("flight-search-bar--compact");
    expect(markup).toContain("From");
    expect(markup).toContain("To");
    expect(markup).toContain("Search");
    expect(markup).not.toContain("<nav");
    expect(markup).not.toContain("SIGN IN");
  });

  it("omits the compact route switcher on homepage to prevent duplication with hero search", () => {
    mockUsePathname.mockReturnValue("/");
    const markup = renderToStaticMarkup(<SiteHeader />);

    expect(markup).toContain('aria-label="Tripways"');
    expect(markup).toContain('href="/"');
    expect(markup).toContain("TRIPWAYS");
    expect(markup).not.toContain("flight-search-bar--compact");
    expect(markup).not.toContain("Search");
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
