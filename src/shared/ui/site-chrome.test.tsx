import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SiteFooter, SiteHeader } from ".";

describe("shared site chrome", () => {
  it("renders accessible primary navigation from the shared header", () => {
    const markup = renderToStaticMarkup(<SiteHeader />);

    expect(markup).toContain('aria-label="Primary navigation"');
    expect(markup).toContain('href="/"');
    expect(markup).toContain('href="/#global-route-map"');
    expect(markup).toContain('href="/flights-from/bangkok"');
    expect(markup).toContain("TRIPWAYS");
    expect(markup).toContain("EXPLORE");
    expect(markup).toContain("SIGN UP");
    expect(markup).toContain("profile-avatar.jpg");
  });

  it("renders footer navigation and a labelled newsletter form", () => {
    const markup = renderToStaticMarkup(<SiteFooter />);

    expect(markup).toContain('aria-label="Footer navigation"');
    expect(markup).toContain('aria-label="Newsletter signup"');
    expect(markup).toContain('type="email"');
    expect(markup).toContain("DIRECTORIES");
    expect(markup).toContain("ECOSYSTEM");
  });
});
