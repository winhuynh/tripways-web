import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import TermsPage, { metadata } from "./page";

describe("Terms page", () => {
  it("publishes the legal and data-use contract", () => {
    const markup = renderToStaticMarkup(<TermsPage />);

    expect(metadata.title).toBe("Terms of Service");
    expect(markup).toContain("Terms of Service");
    expect(markup).toContain("Effective July 30, 2026");
    expect(markup).toContain("informational and planning purposes only");
    expect(markup).toContain("Third-party data and services");
    expect(markup).toContain("Automated access and extraction");
    expect(markup).toContain("public search-engine crawlers");
    expect(markup).toContain("Limitation of liability");
    expect(markup).toContain("Contact");
  });
});
