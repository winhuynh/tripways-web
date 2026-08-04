import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SiteFooter, SiteHeader } from ".";

describe("shared site chrome", () => {
  it("renders a Terms-only header while product pages are rebuilt", () => {
    const markup = renderToStaticMarkup(<SiteHeader />);

    expect(markup).toContain('aria-label="Primary navigation"');
    expect(markup).toContain('href="/terms"');
    expect(markup).toContain("TRIPWAYS");
    expect(markup).not.toContain("flights-from");
    expect(markup).not.toContain("SIGN UP");
  });

  it("renders only retained legal navigation in the footer", () => {
    const markup = renderToStaticMarkup(<SiteFooter />);

    expect(markup).toContain('aria-label="Footer navigation"');
    expect(markup).toContain('aria-label="Legal navigation"');
    expect(markup).toContain('href="/terms"');
    expect(markup).not.toContain("flights-from");
    expect(markup).not.toContain("Newsletter");
  });
});
