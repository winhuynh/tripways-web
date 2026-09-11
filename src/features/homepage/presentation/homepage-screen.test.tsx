import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { HomepageScreen } from "./homepage-screen";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("HomepageScreen", () => {
  it("renders the hero section with clean search bar and authoritative route explorer title", () => {
    const html = renderToStaticMarkup(<HomepageScreen />);
    expect(html).toContain("Find the best flight routes anywhere");
    expect(html).toContain("From");
    expect(html).toContain("To");
    expect(html).toContain("Explore routes");
    expect(html).not.toContain("Direct flights only");
    expect(html).not.toContain("Multi-city search");
  });

  it("renders the interactive map shell and defaults to New York JFK when no origin is specified", () => {
    const html = renderToStaticMarkup(<HomepageScreen />);
    expect(html).toContain("SHOWING FLIGHTS FROM");
    expect(html).toContain("New York JFK");
  });

  it("renders local hub direct destinations and trending nonstop routes without observed fare jargon", () => {
    const html = renderToStaticMarkup(<HomepageScreen />);
    expect(html).toContain("Direct flights from New York (JFK)");
    expect(html).toContain("Trending Flight Routes");
    expect(html).toContain("Global Corridors");
    expect(html).toContain("Verified Route Data");
    expect(html).not.toContain("Observed Fares");
    expect(html).not.toContain("Travelpayouts Data API v3");
    expect(html).not.toContain("ILLUSTRATIVE PREVIEW DATA");
    expect(html).not.toContain("ADVERTISEMENT");
  });

  it("renders how it works, benefit-driven value pillars, global directory, FAQ with schema, and advisory notice", () => {
    const html = renderToStaticMarkup(<HomepageScreen />);
    expect(html).not.toContain("Find nonstop flights from popular cities");
    expect(html).toContain('href="/flights-from/bangkok"');
    expect(html).toContain('href="/flights-from/london"');

    // Useful route planning tools (Google Flights style)
    expect(html).toContain("Useful tools to help you plan smarter flight routes");
    expect(html).toContain("Compare direct and 1-stop connections");
    expect(html).toContain("Map your flight corridors visually");
    expect(html).toContain("See every airline flying your route");
    expect(html).toContain("Discover everywhere you can fly from your city");
    expect(html).not.toContain("How Tripways Route Intelligence Works");
    expect(html).not.toContain("Uncover Direct Routes You Didn&#x27;t Know Existed");

    // Global directory & FAQ
    expect(html).toContain("Worldwide Flight Routes &amp; Airport Hubs");
    expect(html).toContain("Frequently Asked Questions");
    expect(html).toContain('"@type":"FAQPage"');

    // Transparency advisory notice
    expect(html).toContain("Data Accuracy Notice — Before you travel:");
  });
});
