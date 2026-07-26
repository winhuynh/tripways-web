import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import HomePage from "./page";

describe("HomePage", () => {
  it("composes the approved editorial homepage sections", () => {
    const text = renderToStaticMarkup(HomePage());

    expect(text).toContain("Discover");
    expect(text).toContain("where");
    expect(text).toContain("the world connects.");
    expect(text).toContain("Search routes");
    expect(text).toContain("Directories");
    expect(text).toContain("Significant Corridors");
    expect(text).toContain("Discover destinations.");
    expect(text).toContain("Visualize connections.");
    expect(text).toContain("Understand mobility.");
  });
});
