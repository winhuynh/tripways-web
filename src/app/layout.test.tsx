import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import RootLayout from "./layout";

describe("Root layout", () => {
  it("wraps every page in the shared header and footer", () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <main>Page content</main>
      </RootLayout>,
    );

    expect(markup).toContain('class="editorial-site-header"');
    expect(markup).toContain("Page content");
    expect(markup).toContain('class="editorial-site-footer"');
  });
});
