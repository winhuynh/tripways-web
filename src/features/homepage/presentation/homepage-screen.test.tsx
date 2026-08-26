import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { HomepageScreen } from "./homepage-screen";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("HomepageScreen", () => {
  it("renders the hero section with clean search bar and English title", () => {
    const html = renderToStaticMarkup(<HomepageScreen />);
    expect(html).toContain("Compare and book cheap flights with ease");
    expect(html).toContain("From");
    expect(html).toContain("To");
    expect(html).toContain("Search flights");
    expect(html).toContain("Direct flights only");
    expect(html).toContain("Flight search");
    expect(html).toContain("Multi-city search");
  });

  it("renders the interactive map shell and defaults to New York JFK when no origin is specified", () => {
    const html = renderToStaticMarkup(<HomepageScreen />);
    expect(html).toContain("SHOWING FLIGHTS FROM");
    expect(html).toContain("New York JFK");
  });

  it("renders the popular nonstop routes section with comparison cards", () => {
    const html = renderToStaticMarkup(<HomepageScreen />);
    expect(html).toContain("Popular nonstop routes");
    expect(html).toContain("ILLUSTRATIVE PREVIEW DATA");
    expect(html).toContain("LHR");
    expect(html).toContain("SIN");
  });

  it("renders popular cities picker, value pillars, and travel advisory notice", () => {
    const html = renderToStaticMarkup(<HomepageScreen />);
    expect(html).toContain("Find nonstop flights from popular cities");
    expect(html).toContain("Find your next destination");
    expect(html).toContain("See your options on a map");
    expect(html).toContain("Choose the route that works for you");
    expect(html).toContain("Before you travel:");
  });
});
